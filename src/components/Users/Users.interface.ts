import { IUser } from "ducks/user/users";

export interface IUsersProps {
    usersData: IUser[],
    fetchUsers(): void;
}