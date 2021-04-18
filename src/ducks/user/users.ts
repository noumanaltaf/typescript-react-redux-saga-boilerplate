
import {
    createActions, asyncInitialState, asyncOnRequest, asyncOnSuccess, asyncOnError,
    IDataAction, IExtendedState, SuccessAction, asyncSelectors
} from 'ducks/utils'

export interface IUser {
    id?: number,
    email?: string,
    first_name?: string,
    last_name?: string,
    avatar?: string
    text?: string;
}

export interface IUserData {
    selected: IUser;
    users: IUser[];
    comments: any;
}

export interface IUserState extends IExtendedState<IUserData> {
    fetchUser_loading?: boolean;
}

export const { types, actions } = createActions(
    {
        setSelected: (row: any) => (row),
        asyncs: {
            fetchUsers: () => undefined,
            fetchUser: (id: string) => (id),
        }
    },
    'Users');

const initialState = asyncInitialState<IUserData>({
    comments: '',
    users: [],
    selected: {}
});

export default function userReducer(state: IUserState = initialState, action: IDataAction): IUserState {
    switch (action.type) {

        case types.fetchUsers:
        case types.fetchUser:
            return asyncOnRequest(state, action);

        case types.saga.fetchUsers.success:
            return asyncOnSuccess(state, action, (data: IUserData, successAction: SuccessAction) => {
                return {
                    ...data,
                    users: successAction.payload
                };
            });
        case types.saga.fetchUser.success:
            return asyncOnSuccess(state, action, (data: IUserData, successAction: SuccessAction) => {
                return {
                    ...data,
                    selected: successAction.payload
                };
            });

        case types.saga.fetchUser.failure:
        case types.saga.fetchUsers.failure:
            return asyncOnError(state, action);

        default:
            return state;
    }
};

export const selectors = {
    ...asyncSelectors(
        (state: { users: { users: IUserState } }) => state.users.users,
        {
            users: (data: IUserData) => data.users,
            selected: (data: IUserData) => data.selected
        }),
    fetchUserIsLoading: (state: { users: { users: IUserState } }) => state.users.users.fetchUser_loading || false,
};
