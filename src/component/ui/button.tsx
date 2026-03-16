import { motion } from 'framer-motion';
import { ReactElement } from 'react';

type Variants = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
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
    primary: 'bg-blue-600 text-white hover:bg-blue-300 hover:text-black focus:ring-purple-300',
    secondary: 'bg-blue-300 text-black hover:bg-blue-600 hover:text-white focus:ring-purple-700',
    success: 'bg-green-600 text-white hover:bg-green-300 hover:text-black focus:ring-purple-300',
    danger: 'bg-red-600 text-white hover:bg-red-300 hover:text-black focus:ring-purple-300',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-300 hover:text-black focus:ring-purple-300',
    info: 'bg-cyan-600 text-white hover:bg-cyan-300 hover:text-black focus:ring-purple-300',
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
                <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
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
