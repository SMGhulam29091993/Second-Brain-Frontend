import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../../config/axios.config';
import { BrainIcon } from '../../icons/BrainIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { SunIcon } from '../../icons/SunIcon';
import { useSourceStore } from '../../store/sourceStore';
import { useAuthStore } from '../../store/authStore';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { Button } from '../ui/button';

export interface ContentDto {
    link: string;
    type: 'video' | 'image' | 'audio' | 'article' | 'repository';
    title: string;
    tags: string[];
    userId: string;
    source: 'youtube' | 'twitter' | 'facebook' | 'github';
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
    __v?: number;
}

interface SourceDto {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../../config/axios.config';
import { BrainIcon } from '../../icons/BrainIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { SunIcon } from '../../icons/SunIcon';
import { useSourceStore } from '../../store/sourceStore';
import { useAuthStore } from '../../store/authStore';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { Button } from '../ui/button';

export const Header = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(
        (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    );

    const clearToken = useAuthStore((state) => state.clearToken);
    const activeSource = useSourceStore((state) => state.source);
    const setSourceStore = useSourceStore((state) => state.setSource);

    const { data: allSourceData } = useQuery({
        queryKey: ['allSource'],
        queryFn: async () => {
            const response = await api.get('/content/get-all-sources');
            return response.data;
        },
    });

    const sources = allSourceData?.data || [];

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
        <header className="fixed top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setSourceStore('')}
                >
                    <div className="p-2 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                        <BrainIcon />
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white hidden sm:block">
                        Second<span className="text-blue-600">Brain</span>
                    </h1>
                </motion.div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm cursor-pointer"
                    >
                        <AnimatePresence mode="wait">
                            {theme === 'dark' ? (
                                <motion.div
                                    key="sun"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                >
                                    <SunIcon />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                >
                                    <MoonIcon />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <Button
                        variants="ghost"
                        size="sm"
                        text="Logout"
                        startIcon={<LogoutIcon />}
                        onClick={clearToken}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                </div>
            </div>

            {/* Mobile Horizontal Source List */}
            <div className="sm:hidden w-full overflow-x-auto px-4 pb-3 flex gap-2 scrollbar-hide">
                <button
                    onClick={() => setSourceStore('')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!activeSource ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                >
                    All
                </button>
                {sources.map((source: any) => (
                    <button
                        key={source._id}
                        onClick={() => setSourceStore(source.name)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${activeSource === source.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                    >
                        {source.name}
                    </button>
                ))}
            </div>
        </header>
    );
};
