import UserDetailPage from "components/UserDetail";
import Users from "components/Users";

export interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: any;
    props?: any;
}

const routes: IRoute[] = [
    {
        path: '/user/:Id?',
        name: 'User Detail',
        component: UserDetailPage,
        exact: true,
    },
    {
        path: '/users',
        name: 'Users Page',
        component: Users,
        exact: true,
    },
];

export default routes;
