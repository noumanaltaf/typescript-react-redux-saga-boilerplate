import { takeLatest, Effect, call } from 'redux-saga/effects';
import { types as userTypes, actions as userActions } from 'ducks/user/users';
import { IDataAction } from 'ducks/utils';
import * as api from 'api/user';
import { callApi } from 'sagas/utils';

function* fetchUser(action: IDataAction): IterableIterator<Effect> {
    const { success, failure } = userActions.saga.fetchUser;

    yield callApi(
        call(api.fetchUser, action.data),
        success,
        failure,
    );
}
function* fetchUsers(): IterableIterator<Effect> {
    const { success, failure } = userActions.saga.fetchUsers;

    yield callApi(
        call(api.fetchUsers),
        success,
        failure,
    );
}

export default function* rootSaga(): IterableIterator<Effect> {
    yield takeLatest(userTypes.fetchUser, fetchUser);
    yield takeLatest(userTypes.fetchUsers, fetchUsers);
}
