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
                <main className="flex-1 bg-slate-100 dark:bg-black flex flex-col md:flex-row items-center justify-center overflow-hidden p-4">
                    <div className="text-center md:text-left md:w-1/2 lg:w-1/3 p-6 space-y-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            Unlock Your <span className="text-orange-500">Second Brain</span>
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Your ultimate digital companion for capturing, organizing, and
                            retrieving every piece of information that matters to you.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                            <li>
                                Effortlessly save and organize notes, articles, and various sources.
                            </li>
                            <li>
                                Integrate knowledge from platforms like YouTube, GitHub, and X
                                (formerly Twitter).
                            </li>
                            <li>
                                Build a comprehensive knowledge network by connecting related
                                thoughts and information.
                            </li>
                            <li>
                                Access your organized information anytime, anywhere, across devices.
                            </li>
                            <li>
                                Enhance your productivity and creativity by centralizing your
                                knowledge.
                            </li>
                            <li>Summarize and share your insights with ease.</li>
                        </ul>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            "The best way to predict the future is to create it." - Peter Drucker
                        </p>
                    </div>
                    <div className="md:w-1/2 lg:w-1/3 flex justify-center items-center">
                        <WrappedComponent {...props} />
                    </div>
                </main>
            </div>
        );
    };
}
