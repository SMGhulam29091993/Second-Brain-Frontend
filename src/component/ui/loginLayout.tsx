import { ComponentType, useEffect } from 'react';
import { BrainIcon } from '../../icons/BrainIcon';
import { SunIcon } from '../../icons/SunIcon';
import { MoonIcon } from '../../icons/MoonIcon';

export function LoginLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: T) => {
        // Check for theme in local storage and set it on the html element
        useEffect(() => {
            const theme = localStorage.getItem('theme');
            const html = document.querySelector('html');
            if (!html) return;
            if (theme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }, []);

        const changeTheme = () => {
            const html = document.querySelector('html');
            if (!html) return;
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };

        return (
            <div className="h-screen flex flex-col bg-slate-200 dark:bg-slate-800">
                <header className="flex items-center justify-between px-6 py-4 bg-slate-100 shadow-md dark:bg-slate-600">
                    <div className="flex items-center gap-2">
                        <BrainIcon />
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                            <span className="text-orange-300 italic">Second</span> Brain
                        </h2>
                    </div>
                    <button
                        onClick={changeTheme}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <div className="hidden dark:block">
                            <SunIcon />
                        </div>
                        <div className="block dark:hidden">
                            <MoonIcon />
                        </div>
                    </button>
                </header>
                <main className="flex-1 bg-slate-100 dark:bg-black flex items-center justify-center overflow-hidden">
                    <WrappedComponent {...props} />
                </main>
            </div>
        );
    };
}
