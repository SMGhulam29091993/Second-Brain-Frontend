import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
    children?: React.ReactNode;
    token: string | null | boolean;
    redirect: string;
}

export const PrivateRoute = ({ children, token, redirect }: PrivateRouteProps) => {
    if (!token || token === null) {
        console.log('Token is null or undefined');

        return <Navigate to={redirect} />;
    }
    return <>{children ? children : <Outlet />}</>;
};
