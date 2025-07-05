import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import api from '../config/axios.config';
import { SubmitIcon } from '../icons/SubmitIcon';
import toast from 'react-hot-toast';

interface FormData {
    username: string;
    email: string;
    password: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    general?: string;
}

const RegisterPage = () => {
    useEffect(() => {
        document.title = 'Sign Up | Second Brain';
    }, []);

    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            toast.error('Username is required');
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            toast.error('Username must be at least 3 characters');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            toast.error('Email is required');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            toast.error('Please enter a valid email address');
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            toast.error('Password is required');
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            toast.error('Password must be at least 6 characters');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear error when user starts typing
        if (errors[id as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fill the form correctly before submitting.');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/user/register', formData);

            if (res.status === 201 || res.status === 200) {
                const hashCode = res.data.data.hashedCode;
                if (hashCode) {
                    toast.success('Registration successful! Please verify your email.');
                    navigate(`/verify-email/${encodeURIComponent(hashCode)}`);
                }
            }
        } catch (err: any) {
            setErrors({
                general: err.response?.data?.message ?? 'Registration failed. Please try again.',
            });
            toast.error(err.response?.data?.message ?? 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-xl transform transition-all duration-300 hover:scale-[1.01]">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 space-y-4">
                    <div>
                        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                            Create Account
                        </h2>
                        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                            Start organizing your thoughts with Second Brain
                        </p>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Your personal knowledge hub for organizing notes, sources, and ideas.
                        </p>
                    </div>

                    {errors.general && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-lg text-xs animate-fadeIn">
                            {errors.general}
                        </div>
                    )}

                    <form
                        className="space-y-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="johndoe"
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 ${
                                        errors.username
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    onChange={onChangeHandler}
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                            </div>
                            {errors.username && (
                                <p className="mt-0.5 text-xs text-red-500">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 ${
                                        errors.email
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    onChange={onChangeHandler}
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                            {errors.email && (
                                <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="••••••••"
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 ${
                                        errors.password
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    onChange={onChangeHandler}
                                />
                            </div>
                            <div className="flex items-center mt-1">
                                <input
                                    id="show-password"
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword((prev) => !prev)}
                                    className="mr-2"
                                />
                                <label
                                    htmlFor="show-password"
                                    className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                                >
                                    Show Password
                                </label>
                            </div>
                            {errors.password && (
                                <p className="mt-0.5 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <Button
                                variants="primary"
                                text="Create Account"
                                startIcon={<SubmitIcon />}
                                size="md"
                                fullWidth={true}
                                loading={loading}
                                onClick={handleSubmit}
                            />
                        </div>
                    </form>

                    <div className="text-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginLayout(RegisterPage);
