import React, { useEffect, useState } from 'react';
import { BrainIcon } from '../../icons/BrainIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { PlusIcon } from '../../icons/PlusIcons';
import { ShareIcon } from '../../icons/ShareIcons';
import { SunIcon } from '../../icons/SunIcon';
import { Button } from '../ui/button';

interface HeaderProps {
    setOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setOpen }) => {
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
        <div className="flex items-center justify-between p-4 text-white">
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
            <div className="flex items-center gap-2">
                <span>
                    <Button
                        variants="secondary"
                        text="Share"
                        startIcon={<ShareIcon />}
                        size="md"
                        onClick={() => console.log('Share')}
                    />
                </span>
                <Button
                    variants="primary"
                    text="Add Content"
                    startIcon={<PlusIcon />}
                    size="md"
                    onClick={() => setOpen(true)}
                />
            </div>
        </div>
    );
};
