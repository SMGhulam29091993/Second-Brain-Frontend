// ./components/ui/button.tsx
import { ReactElement } from 'react';

type Variants = 'primary' | 'secondary';
type Sizes = 'sm' | 'md' | 'lg';

interface ButtonProps {
    variants: Variants;
    size?: Sizes;
    loading?: boolean;
    onClick: () => void;
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    fullWidth?: boolean;
    disabled?: boolean;
}

const variantStyles: Record<Variants, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-300 hover:text-black focus:ring-purple-300',
    secondary: 'bg-blue-300 text-black hover:bg-blue-600 hover:text-white focus:ring-purple-700',
};

const sizeStyles: Record<Sizes, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
};

const defaultStyles =
    'rounded-md flex items-center justify-center font-semibold focus:outline-none  transition disabled:opacity-50';

export const Button = ({
    variants,
    size = 'lg',
    loading = false,
    onClick,
    text,
    startIcon,
    endIcon,
    fullWidth = false,
    disabled = false,
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className={`
        ${variantStyles[variants]}
        ${sizeStyles[size]}
        ${defaultStyles}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
        >
            {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
                <>
                    {startIcon && <span className="md:mr-2 ">{startIcon}</span>}
                    <span className="hidden md:block">{text}</span>
                    {endIcon && <span className="ml-2">{endIcon}</span>}
                </>
            )}
        </button>
    );
};
