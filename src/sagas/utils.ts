import { call, put, CallEffect, Effect } from 'redux-saga/effects';
// import { ExtendedActions, CombinedActions, SagaActions } from 'ducks/utils';

interface IOptions {
    postApiSuccessCallEffect?(...args: any[]): any;
    postApiFailureCallEffect?(...args: any[]): any;
}

function* handleApiCall(apiCallEffect: CallEffect, successAction: (data: any) => any, failureAction: (data: string) => any, options?: IOptions): IterableIterator<Effect> {
    const { postApiSuccessCallEffect = null, postApiFailureCallEffect = null } = options || {};
    try {
        let response: any;
        response = yield apiCallEffect;

        yield put(successAction(response));

        if (postApiSuccessCallEffect) {
            yield call(postApiSuccessCallEffect, response);
        }

    } catch (error) {
        if (postApiFailureCallEffect) {
            yield call(postApiFailureCallEffect, error);
        }
        yield put(failureAction(error));
    }
}

/**
 * Creates a call effect to handle the API call, and then call either the success action or failure action as appropriate.
 * @template The expected API response type.
 * @param apiCallEffect API call effect
 * @param successAction Success Redux action
 * @param failureAction Failure Redux action
 * @param options Contains FormValidation and Continuation Call Effects
 * @returns A Redux call effect
 */
export function callApi<T = any>(apiCallEffect: CallEffect, successAction: (data: T) => any, failureAction: (data: string) => any, options?: IOptions): CallEffect {
    return call(handleApiCall, apiCallEffect, successAction, failureAction, options);
}

// type ActionType<A extends object, S extends object, K extends keyof CombinedActions<A, S>> = ReturnType<CombinedActions<A, S>[K]>;
// type ActionData<A extends object, S extends object, K extends keyof CombinedActions<A, S>> = ReturnType<CombinedActions<A, S>[K]>['data'];
// type SuccessData<D extends object, A extends object, K extends keyof SagaActions<D, A>> = Parameters<SagaActions<D, A>[K]['successCallback']>[1];

// /**
//  * Connects the async action and it's success/failure actions (saga) to an API function.
//  * @template D The reducers data type (e.g. IContactData)
//  * @template A The async actions
//  * @template S The sync actions
//  * @template K The async action to attach.
//  * @param extendedAction The actions object to attach to the API
//  * @param actionName The action name to attach to the API (an Async Action)
//  * @param api The API function to call when the action is invoked.
//  * @yields A sequence of Redux call effects.
//  */
// export function connectSagaToApi<D extends object, A extends object, S extends object, K extends keyof A>(
//     extendedAction: ExtendedActions<D, A, S>,
//     actionName: K,
//     api: (data: ActionData<A, S, K>) => Promise<SuccessData<D, A, K>>)
//     : (action: ActionType<A, S, K>) => IterableIterator<Effect> {
//     return function* (payload: ActionType<A, S, K>): IterableIterator<Effect> {
//         const { success, failure } = extendedAction.saga[actionName];
//         yield call(handleApiCall, call(api, payload.data), success, failure);
//     };
// }
