import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Display = lazy(() => import('./component/sharedComponents/display.component'));
const LoginPage = lazy(() => import('./page/login'));

function App() {
    return (
        <div className="bg-slate-100 dark:bg-black">
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={<Display />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </div>
    );
}

export default App;
