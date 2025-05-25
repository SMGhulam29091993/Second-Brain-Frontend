import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './component/Auth/PrivateRoute';
import { useAuthStore } from './store/authStore';

const Display = lazy(() => import('./component/sharedComponents/display.component'));
const LoginPage = lazy(() => import('./page/login'));
const RegisterPage = lazy(() => import('./page/signup'));

function App() {
    const token = useAuthStore((state) => state.token);

    return (
        <div className="bg-slate-100 dark:bg-black">
            <BrowserRouter>
                <Suspense fallback={<div className="dark:text-white text-black">Loading...</div>}>
                    <Routes>
                        {/* Protected Routes */}
                        <Route element={<PrivateRoute token={token} redirect="/login" />}>
                            <Route path="/dashboard" element={<Display />} />
                        </Route>

                        {/* Redirect from root to login */}
                        {/* <Route
                            path="/*"
                            element={
                                <PrivateRoute token={!token} redirect="/dashboard">
                                    <LoginPage />
                                </PrivateRoute>
                            }
                        /> */}

                        <Route
                            path="/*"
                            element={!token ? <LoginPage /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/register"
                            element={!token ? <RegisterPage /> : <Navigate to="/dashboard" />}
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    );
}

export default App;
