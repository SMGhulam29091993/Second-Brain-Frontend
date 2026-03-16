import { motion } from 'framer-motion';
import { ReactElement } from 'react';

type Variants = 'primary' | 'secondary' | 'danger' | 'ghost';
type Sizes = 'sm' | 'md' | 'lg';

export interface ButtonProps {
    variants: Variants;
    size?: Sizes;
    loading?: boolean;
    onClick?: () => void;
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<Variants, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-blue-500/50',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 shadow-sm hover:shadow-md focus:ring-slate-400/50 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-red-500/50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-400/50',
};

const sizeStyles: Record<Sizes, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const defaultStyles =
    'rounded-xl flex items-center justify-center font-bold focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-50 select-none';

export const Button = ({
    variants,
    size = 'md',
    loading = false,
    onClick,
    text,
    startIcon,
    endIcon,
    fullWidth = false,
    disabled = false,
    className = '',
    type = 'button',
}: ButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
                ${variantStyles[variants]}
                ${sizeStyles[size]}
                ${defaultStyles}
                ${fullWidth ? 'w-full' : ''}
                ${loading || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${className}
                ${!startIcon && !endIcon ? '' : 'px-3 md:px-4'} 
            `}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <span className="text-sm hidden md:block">Loading...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 w-full">
                    {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
                    <span className={`${(startIcon || endIcon) ? 'hidden md:block' : ''} whitespace-nowrap`}>
                        {text}
                    </span>
                    {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
                </div>
            )}
        </motion.button>
    );
};
