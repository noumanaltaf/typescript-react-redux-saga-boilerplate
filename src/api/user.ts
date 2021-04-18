import { fetchGet } from "./utils";

export const fetchUsers = () => {
    const apiCall = fetchGet('users', null)
        .then((result) => result.data);

    return apiCall;
};
export const fetchUser = (id: string) => {
    const apiCall = fetchGet(`users/${id}`, null)
        .then((result) => ({ ...result.data, ...result.support }));

    return apiCall;
};