import { ComponentType, useEffect, useState } from 'react';
import { BrainIcon } from '../../icons/BrainIcon';
import { SunIcon } from '../../icons/SunIcon';
import { MoonIcon } from '../../icons/MoonIcon';

export function LoginLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: T) => {
        const [activeView, setActiveView] = useState<'description' | 'form'>('description');

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
                <main className="flex-1 bg-slate-100 dark:bg-black flex flex-col md:flex-row items-center justify-center overflow-y-auto pt-16 p-2 sm:p-4 lg:p-8">
                    {/* Desktop View */}
                    <div className="hidden md:flex md:flex-row md:w-full md:items-center md:justify-center">
                        <div className="text-center md:text-left md:w-1/2 lg:w-2/5 xl:w-1/3 p-4 sm:p-6 space-y-4">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                Unlock Your <span className="text-orange-500">Second Brain</span>
                            </h1>
                            <p className="text-base text-gray-700 dark:text-gray-300">
                                Your ultimate digital companion for capturing, organizing, and
                                retrieving every piece of information that matters to you.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                <li>
                                    Effortlessly save and organize notes, articles, and various
                                    sources.
                                </li>
                                <li>Integrate knowledge from platforms like YouTube, GitHub, and <span>X &#40;formerly Twitter&#41;</span>.</li>
                                <li>
                                    Build a comprehensive knowledge network and centralize your
                                    knowledge.
                                </li>
                                <li>Access, summarize, and share your insights with ease.</li>
                            </ul>
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                "The best way to predict the future is to create it." - Peter
                                Drucker
                            </p>
                        </div>
                        <div className="md:w-1/2 lg:w-2/5 xl:w-1/3 flex justify-center items-center p-2 sm:p-4">
                            <WrappedComponent {...props} />
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden flex flex-col items-center justify-center w-full p-4">
                        {activeView === 'description' && (
                            <div className="text-center w-full space-y-4">
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                    Unlock Your{' '}
                                    <span className="text-orange-500">Second Brain</span>
                                </h1>
                                <p className="text-base text-gray-700 dark:text-gray-300">
                                    Your ultimate digital companion for capturing, organizing, and
                                    retrieving every piece of information that matters to you.
                                </p>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                                    <li>
                                        Effortlessly save and organize notes, articles, and various
                                        sources.
                                    </li>
                                    <li>Integrate knowledge from platforms like YouTube, GitHub, and <span>X &#40;formerly Twitter&#41;</span>.</li>
                                    <li>
                                        Build a comprehensive knowledge network and centralize your
                                        knowledge.
                                    </li>
                                    <li>Access, summarize, and share your insights with ease.</li>
                                </ul>
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    "The best way to predict the future is to create it." - Peter
                                    Drucker
                                </p>
                                <div className="flex flex-col space-y-4 mt-6">
                                    <button
                                        onClick={() => setActiveView('form')}
                                        className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setActiveView('form')}
                                        className="w-full bg-gray-300 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeView === 'form' && (
                            <div className="w-full flex flex-col items-center justify-center">
                                <button
                                    onClick={() => setActiveView('description')}
                                    className="mb-4 self-start text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    &larr; Back
                                </button>
                                <WrappedComponent {...props} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    };
}
