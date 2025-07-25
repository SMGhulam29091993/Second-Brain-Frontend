import { useEffect, useState } from 'react';
import { SubmitIcon } from '../icons/SubmitIcon';
import { Button } from '../component/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios.config';
import { LoginLayout } from '../component/ui/loginLayout';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    useEffect(() => {
        document.title = 'Forgot Password | Second Brain';
    }, []);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [mailSent, setMailSent] = useState<boolean>(false);

    const navigate = useNavigate();

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.email) {
                setError('Email is required');
                return;
            }
            setLoading(true);
            setError(null);
            const response = await api.post('/user/send-reset-password-email', formData);
            if (response.status === 200) {
                toast.success('Reset link sent to your email.');
                setLoading(false);
                setFormData({ email: '' });
                setMailSent(true);
            } else {
                toast.error('Failed to send reset link. Please try again.');
                setError('Failed to send reset link. Please try again.');
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Email not sent... Please try again later.'
            );
            setError(
                error instanceof Error ? error.message : 'Email not send... Please try again later.'
            );
        }
    };
    return (
        <>
            <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-xl transform transition-all duration-300 hover:scale-[1.01]">
                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 space-y-4">
                        <div>
                            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                                Reset Password
                            </h2>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Reset your password to access your Second Brain
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-lg text-sm animate-fadeIn">
                                {error}
                            </div>
                        )}
                        {mailSent && (
                            <div className="bg-green-50 dark:bg-green-900/30 text-green-500 p-2 rounded-lg text-sm animate-fadeIn">
                                {'Reset link sent to your email. Please check your inbox.'}
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
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="your@email.com"
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200"
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
                            </div>

                            <div>
                                <Button
                                    variants="primary"
                                    text="Send Reset Link"
                                    startIcon={<SubmitIcon />}
                                    size="md"
                                    fullWidth={true}
                                    loading={loading}
                                    onClick={handleSubmit}
                                />
                            </div>
                            <div className="text-center text-xs mt-4 flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Don't want to reset password?{' '}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setError(null);
                                            navigate('/login');
                                        }}
                                        className="cursor-pointer font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                    >
                                        Go to Login
                                    </button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginLayout(ForgotPassword);
