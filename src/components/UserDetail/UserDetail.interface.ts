import { IUser } from "ducks/user/users";

export interface IUsersDetailProps {
    selectedUser: IUser;
    isLoading: boolean;
    fetchUser(id: string): void;
}