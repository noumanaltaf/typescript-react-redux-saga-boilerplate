import { fork, Effect } from 'redux-saga/effects';

import usersSaga from 'sagas/users/users';

export default function* rootSaga(): IterableIterator<Effect> {
    yield fork(usersSaga);
}
