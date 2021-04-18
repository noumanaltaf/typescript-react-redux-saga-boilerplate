import React from 'react';
import UserCard from 'components/common/UserCard';
import DashboardLayout from '../common/DashboardLayout';
import { IUsersProps } from './Users.interface';
import { useHistory } from "react-router-dom";
import { IUser } from 'ducks/user/users';

const Users = (props: IUsersProps) => {
    const { usersData, fetchUsers } = props;
    const history = useHistory();

    React.useEffect(
        () => {
            fetchUsers();
        }
    );

    function userOnClick(userData: IUser) {
        if (userData) {
            history.push({
                pathname: '/user',
                search: `Id=${userData.id}`
            })
        }
    }

    return (
        <DashboardLayout>
            {usersData && usersData.map((user) => (<UserCard key={user.id} data={user} onClick={userOnClick} />))}
        </DashboardLayout>
    );
};

export default Users;