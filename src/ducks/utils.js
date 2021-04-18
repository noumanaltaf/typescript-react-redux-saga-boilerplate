import { isNull } from 'utils/utils';

// action creator helper
const constructType = (namespace, key, lifecycle = 'none') => {
    if (lifecycle === 'none') {
        return `${namespace}_${key}`;
    }

    return `${namespace}_${key}.${lifecycle}`;
};

export const createActions = (actionCreators, namespace) => {
    let { asyncs, ...syncs } = actionCreators;
    if (!asyncs) {
        asyncs = {};
    }

    if (!Object.entries) {
        Object.entries = function (obj) {
            const ownProps = Object.keys(obj);
            let i = ownProps.length;
            const resArray = new Array(i); // preallocate the Array
            while (i--) {
                resArray[i] = [ownProps[i], obj[ownProps[i]]];
            }

            return resArray;
        };
    }

    const sagas = Object.entries(asyncs).reduce(
        (acc, [key, entry]) => {
            return {
                ...acc,
                [key]: {
                    success: (payload) => ({
                        type: constructType(namespace, key, 'success'),
                        name: key,
                        lifecycle: 'success',
                        callback: entry.successCallback,
                        payload
                    }),
                    failure: (error) => ({
                        type: constructType(namespace, key, 'failure'),
                        name: key,
                        lifecycle: 'failure',
                        callback: entry.failureCallback,
                        error
                    })
                }
            };
        },
        {});

    asyncs = Object.entries(asyncs).reduce(
        (acc, [key, entry]) => {
            return {
                ...acc,
                [key]: (...args) => ({
                    type: constructType(namespace, key),
                    name: key,
                    lifecycle: 'request',
                    callback: entry.callback,
                    data: typeof (entry) === 'function' ? entry(...args) : typeof (entry) === 'object' ? entry.action(...args) : null
                })
            };
        },
        {});

    syncs = Object.entries(syncs).reduce(
        (acc, [key, entry]) => {
            return {
                ...acc,
                [key]: (...args) => ({
                    type: constructType(namespace, key),
                    name: key,
                    lifecycle: 'none',
                    callback: entry.callback,
                    data: typeof (entry) === 'function' ? entry(...args) : typeof (entry) === 'object' ? entry.action(...args) : null
                })
            };
        },
        {});

    const sagaTypes = Object.entries(sagas).reduce(
        (acc, [key, sagaActions]) => ({
            ...acc,
            [key]: Object.entries(sagaActions).reduce(
                (sagaActionAcc, [lifecycle, func]) => ({
                    ...sagaActionAcc,
                    [lifecycle]: constructType(namespace, key, lifecycle),
                }),
                {}
            )
        }),
        {}
    );

    const types = Object.entries({ ...syncs, ...asyncs }).reduce(
        (acc, [key, func]) => ({
            ...acc,
            [key]: constructType(namespace, key),
        }),
        { saga: sagaTypes }
    );

    const actions = { ...syncs, ...asyncs, saga: sagas };

    return { types, actions };
};

// help with constructing async stores
export const asyncInitialState = (initialData = null) => {
    return {
        fetched: false,
        loading: false,
        detailLoading: false,
        error: null,
        data: initialData,
        notifications: {}
    };
};

export const asyncOnRequest = (state, action) => ({
    ...state,
    error: null,
    notifications: {},
    loading: true,
    [`${action.name}_loading`]: true,
});

export const asyncOnSuccess = (state, action, map, notification) => {
    const notifications = { [action.name]: true, ...(notification || {}) };

    notifications.clear = () => {
        notifications[action.name] = false;
    };

    return {
        ...state,
        fetched: true,
        loading: false,
        [`${action.name}_loading`]: false,
        notifications: notifications,
        data: map(state.data, action)
    };
};

export const asyncOnError = (state, action) => ({
    ...state,
    loading: false,
    [`${action.name}_loading`]: false,
    error: action.error
});

// help creating async selectors
export const asyncSelectors = (getState, dataSelectors) => {
    const selectors = Object.entries(dataSelectors).reduce(
        (acc, [key, func]) => ({
            ...acc,
            [key]: (state, ...args) => {
                if (isNull(getState(state))) {
                    return;
                }
                const { fetched, data } = getState(state);

                if (fetched === false) {
                    return null;
                }

                return func(data, ...args);
            }
        }),
        {}
    );

    return {
        ...selectors,
        isFetched: (state) => getState(state).fetched,
        isLoading: (state) => getState(state).loading,
        error: (state) => getState(state).error,
    };
};

// help creating sync selectors

export const syncSelectors = (getState, dataSelectors) => {
    const selectors = Object.entries(dataSelectors).reduce(
        (acc, [key, func]) => ({
            ...acc,
            [key]: (state, ...args) => {
                return func(getState(state, ...args));
            }
        }),
        {}
    );

    return selectors;
};

export function initializeReducer(options) {
    const { namespace, initialData, syncActions, asyncActions } = options;
    const initialState = asyncInitialState(initialData);
    const { actions, types } = createActions({ asyncs: asyncActions, ...syncActions }, namespace);

    const reducer = function (state = initialState, action) {
        if (types[action.name] && types[action.name] === action.type) {
            let data = action.data;
            if (action.callback) {
                data = action.callback(state.data, action.data);
            }
            if (action.lifecycle === 'none') {
                return { ...state, data: { ...state.data, ...data } };
            } else if (action.lifecycle === 'request') {
                return asyncOnRequest({ ...state, data: { ...state.data, ...data } }, { ...action, data: data });
            }
        } else if (action.lifecycle === 'success' && types.saga[action.name] && types.saga[action.name].success === action.type) {
            if (action.callback) {
                const data = action.callback(state.data, action.payload);
                return asyncOnSuccess(state, action, () => data);
            }
        } else if (action.lifecycle === 'failure' && types.saga[action.name] && types.saga[action.name].failure === action.type) {
            if (action.callback) {
                const data = action.callback(state.data, action.payload);
                return asyncOnError({ ...state, data: { ...state.data, ...data } });
            } else {
                return asyncOnError(state, action);
            }
        }

        return state;
    }

    return { initialState, actions, types, reducer };
}
