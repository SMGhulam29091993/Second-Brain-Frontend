import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './component/Auth/PrivateRoute';
import { useAuthStore } from './store/authStore';

const Display = lazy(() => import('./component/sharedComponents/display.component'));
const LoginPage = lazy(() => import('./page/login'));

function App() {
    const token = useAuthStore((state) => state.token);
    console.log('Token:', token);

    return (
        <div className="bg-slate-100 dark:bg-black">
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        {/* Protected Routes */}
                        <Route element={<PrivateRoute token={token} redirect="/login" />}>
                            <Route path="/dashboard" element={<Display />} />
                        </Route>
                        {/* Catch-All Route or Redirect */}
                        <Route
                            path="*"
                            element={<Navigate to={token ? '/dashboard' : '/login'} />}
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    );
}

export default App;
