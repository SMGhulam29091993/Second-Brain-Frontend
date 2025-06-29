import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './component/Auth/PrivateRoute';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

const Display = lazy(() => import('./component/sharedComponents/display.component'));
const LoginPage = lazy(() => import('./page/login'));
const RegisterPage = lazy(() => import('./page/signup'));
const SharedBrain = lazy(() => import('./component/sharedComponents/sharedBrain.component'));
const VerificationPage = lazy(() => import('./page/otpVerification'));
const ForgotPassword = lazy(() => import('./page/forgotPassword'));
const ChangePassword = lazy(() => import('./page/changePassword'));
const SummaryPage = lazy(() => import('./page/summary'));
const SharedSummaryPage = lazy(() => import('./page/sharedSummary'));

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
                        {/* Public Routes */}
                        <Route path="/brain/:hashCode" element={<SharedBrain />} />
                        <Route path="/shared-summary/:hash" element={<SharedSummaryPage />} />

                        <Route
                            path="/*"
                            element={!token ? <LoginPage /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/register"
                            element={!token ? <RegisterPage /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/verify-email/:hashCode"
                            element={!token ? <VerificationPage /> : <Navigate to="/dashboard" />}
                        />
                        <Route
                            path="/forgot-password"
                            element={!token ? <ForgotPassword /> : <Navigate to="/dashboard" />}
                        />
                        <Route path="/reset-password/:id" element={<ChangePassword />} />
                        <Route path="/summary/:id" element={<SummaryPage />} />
                    </Routes>
                </Suspense>
                <Toaster position="top-center" />
            </BrowserRouter>
        </div>
    );
}

export default App;
