import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete?: (otp: string) => void;
    onChange?: (otp: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    length = 6,
    onComplete,
    onChange,
    disabled = false,
    autoFocus = true,
    placeholder = '',
    className = '',
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0] && !disabled) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus, disabled]);

    const handleChange = (index: number, value: string) => {
        if (disabled) return;

        const regex = /^[a-zA-Z0-9]+$/;
        if (!value.match(regex) || value.length > 1) {
            return; // Ignore invalid input
        }

        const newOtp = [...otp];
        newOtp[index] = value.substring(0, 1); // Ensure only one character is stored
        setOtp(newOtp);

        const otpString = newOtp.join('');
        onChange?.(otpString);

        // Auto-focus next input
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onComplete when all fields are filled
        if (otpString.length === length && !otpString.includes('')) {
            onComplete?.(otpString);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        // Handle backspace
        if (e.key === 'Backspace') {
            if (otp[index]) {
                // Clear current field
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                onChange?.(newOtp.join(''));
            } else if (index > 0) {
                // Move to previous field and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                onChange?.(newOtp.join(''));
                inputRefs.current[index - 1]?.focus();
            }
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain');
        const pastedNumbers = pastedData.match(/^[a-zA-Z0-9]+$/g)?.[0]?.split('') || [];

        if (pastedNumbers) {
            const newOtp = new Array(length).fill('');
            for (let i = 0; i < pastedNumbers.length; i++) {
                newOtp[i] = pastedNumbers[i];
            }
            setOtp(newOtp);
            onChange?.(newOtp.join(''));

            // Focus the next empty field or the last field
            const nextIndex = Math.min(pastedNumbers.length, length - 1);
            inputRefs.current[nextIndex]?.focus();

            // Check if complete
            if (pastedNumbers.length === length) {
                onComplete?.(pastedNumbers.join(''));
            }
        }
    };

    const handleClick = (index: number) => {
        if (disabled) return;

        inputRefs.current[index]?.setSelectionRange(1, 1);

        if (index > 0 && !otp[index - 1]) {
            // If the clicked input is not empty, focus on the previous input if it is empty
            inputRefs.current[otp.indexOf('')]?.focus();
        }
        if (index < length - 1 && !otp[index + 1]) {
            // If the clicked input is not empty, focus on the next input if it is empty
            inputRefs.current[otp.lastIndexOf('') + 1]?.focus();
        }
    };

    const handleFocus = (index: number) => {
        // Select all text when focusing
        inputRefs.current[index]?.select();
    };

    const clearOtp = () => {
        if (disabled) return;
        setOtp(new Array(length).fill(''));
        onChange?.('');
        inputRefs.current[0]?.focus();
    };

    return (
        <div className={`flex flex-col items-center space-y-4 ${className}`}>
            <div className="flex space-x-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={() => handleFocus(index)}
                        onClick={() => handleClick(index)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={`
              w-12 h-12 text-center text-lg font-semibold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${digit ? 'border-green-500 bg-green-50' : 'border-gray-300'}
              ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white hover:border-gray-400'}
              ${digit && !disabled ? 'shadow-sm' : ''}
            `}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>

            {!disabled && (
                <button
                    onClick={clearOtp}
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
                >
                    Clear
                </button>
            )}
        </div>
    );
};
