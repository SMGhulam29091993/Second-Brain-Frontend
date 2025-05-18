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

        // Change theme and set it in local storage
        // This function is called when the user clicks on the theme toggle button
        const changeTheme = () => {
            const html = document.querySelector('html');
            if (!html) return;
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };
        return (
            <>
                <div className="flex flex-col bg-slate-200 dark:bg-slate-800 ">
                    <header className="flex items-center justify-between p-4 text-white bg-slate-100 shadow-2xl dark:bg-slate-600">
                        <div className="flex items-center gap-2 dark:text-slate-100">
                            <BrainIcon />
                            <h2 className="md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                <span className="text-orange-300 italic">Second</span> Brain
                            </h2>
                        </div>
                        <div
                            onClick={changeTheme}
                            className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
                        >
                            <div className="hidden dark:block relative">
                                <SunIcon />
                            </div>
                            <div className="block dark:hidden relative">
                                <MoonIcon />
                            </div>
                        </div>
                    </header>
                    <main className="dark:bg-black h-screen bg-slate-100 flex flex-col items-center">
                        <WrappedComponent {...props} />
                    </main>
                </div>
            </>
        );
    };
}
