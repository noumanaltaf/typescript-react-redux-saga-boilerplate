import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import Users from './Users';
import { selectors as usersSelectors, actions as usersActions } from 'ducks/user/users';
import { IApplicationState } from 'ducks/index';

const mapStateToProps = (state: IApplicationState) => ({
    usersData: usersSelectors.users(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        fetchUsers: usersActions.fetchUsers,
    },
    dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
