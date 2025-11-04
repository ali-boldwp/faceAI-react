import { ReactElement } from "react";
import Dashboard from "Pages/Home/index";
import Register from "Pages/Auth/Register";
import Login from "Pages/Auth/Login";
import ResetPassword from "Pages/Auth/ResetPassword";

export interface RouteProps {
    path: string;
    component: ReactElement;
}

const routes: RouteProps[] = [
    { path: "/", component: <Dashboard /> },
];

const nonAuthRoutes: RouteProps[] = [
    { path: "/register", component: <Register /> },
    { path: "/login", component: <Login /> },
    { path: "/reset-password", component: <ResetPassword /> },
]

export {
    routes,
    nonAuthRoutes
};
