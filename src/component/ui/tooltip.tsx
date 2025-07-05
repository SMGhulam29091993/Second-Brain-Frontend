import React from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

export const Tooltip = ({ text, children }: TooltipProps) => {
    return (
        <div className="relative flex items-center group">
            {children}
            <div className="absolute bottom-full mb-2 hidden group-hover:block">
                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black dark:bg-gray-700 shadow-lg rounded-md">
                    {text}
                </span>
                <div className="w-6 h-3 -mt-2 rotate-45 bg-black dark:bg-gray-700"></div>
            </div>
        </div>
    );
};
