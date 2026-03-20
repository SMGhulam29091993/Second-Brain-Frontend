import { motion } from 'framer-motion';
import { ComponentType, useEffect, useState } from 'react';
import { BrainIcon } from '../../icons/BrainIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { SunIcon } from '../../icons/SunIcon';

export function LoginLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: T) => {
        const [theme, setTheme] = useState<'light' | 'dark'>(
            (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
        );

        useEffect(() => {
            const html = document.querySelector('html');
            if (!html) return;
            if (theme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            localStorage.setItem('theme', theme);
        }, [theme]);

        const toggleTheme = () => {
            setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        };

        return (
            <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
                {/* Left Side - Brand & Info (Hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 dark:bg-blue-900 p-12 flex-col justify-between overflow-hidden">
                    {/* Animated Background Shapes */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.5, 1],
                            x: [0, 100, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute -bottom-48 -right-48 w-[30rem] h-[30rem] bg-blue-400/20 rounded-full blur-3xl"
                    />

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <BrainIcon />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            SecondBrain
                        </h2>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl font-black text-white leading-[1.1] mb-8"
                        >
                            Your Mind, <br />
                            <span className="text-blue-200">Augmented.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-blue-100 leading-relaxed font-medium mb-12"
                        >
                            The ultimate digital space to capture, organize, and synthesize your knowledge from across the web.
                        </motion.p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { title: 'Centralize', desc: 'Notes, Videos, Tweets in one place.' },
                                { title: 'Summarize', desc: 'AI-powered insights at your fingertips.' },
                                { title: 'Sync', desc: 'Access your brain from any device.' },
                                { title: 'Share', desc: 'Collaborate and share your findings.' },
                            ].map((item, i) => (
                                <motion.div 
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                                >
                                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                    <p className="text-sm text-blue-200/80 leading-snug">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 text-blue-200/50 text-sm font-medium">
                        © 2024 SecondBrain. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex flex-col relative">
                    {/* Theme Toggle */}
                    <div className="absolute top-8 right-8 z-20">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 12 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </motion.button>
                    </div>

                    <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md"
                        >
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                                    <BrainIcon />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    SecondBrain
                                </h2>
                            </div>

                            <WrappedComponent {...(props as T)} />
                        </motion.div>
                    </main>
                </div>
            </div>
        );
    };
}
