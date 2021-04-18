import { combineReducers } from 'redux';
import users, { IUserState } from './users';

export interface IUsersState {
  users: IUserState;
}
const combined = combineReducers({
  users,
});

export default combined;
