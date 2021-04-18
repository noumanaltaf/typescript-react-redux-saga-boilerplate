import { connect } from 'react-redux';
import UserDetail from './UserDetail';
import { selectors as usersSelectors, actions as usersActions } from 'ducks/user/users';
import { IApplicationState } from 'ducks/index';
import { bindActionCreators, Dispatch } from 'redux';

const mapStateToProps = (state: IApplicationState) => ({
    selectedUser: usersSelectors.selected(state),
    isLoading: usersSelectors.fetchUserIsLoading(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        fetchUser: usersActions.fetchUser,
    },
    dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
