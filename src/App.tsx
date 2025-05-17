import { lazy } from 'react';

const Display = lazy(() => import('./component/sharedComponents/display.component'));

function App() {
    return (
        <>
            <div className="dark:bg-black bg-slate-100 min-h-screen">
                <Display />
            </div>
        </>
    );
}

export default App;
