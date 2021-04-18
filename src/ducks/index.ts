import { combineReducers } from 'redux';

import users, { IUsersState } from './user';

export interface IApplicationState {
    users: IUsersState;
}

const appReducer = combineReducers<IApplicationState>({
    users,
});

const rootReducer = (state: any, action: any) => {
    return appReducer(state, action);
};

export default rootReducer;
