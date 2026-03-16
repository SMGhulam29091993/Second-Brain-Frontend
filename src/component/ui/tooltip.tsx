import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

export const Tooltip = ({ text, children }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: -5, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full mb-2 z-[100] pointer-events-none"
                    >
                        <div className="relative">
                            <div className="bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xl whitespace-nowrap border border-slate-700 dark:border-slate-600">
                                {text}
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 border-r border-b border-slate-700 dark:border-slate-600" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
