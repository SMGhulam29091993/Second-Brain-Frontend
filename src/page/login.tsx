import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import api from '../config/axios.config';
import { SubmitIcon } from '../icons/SubmitIcon';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
    useEffect(() => {
        document.title = 'Sign In | Second Brain';
    }, []);

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const setToken = useAuthStore((state) => state.setToken);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setError(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            const resp = await api.post('/user/login', formData);

            if (resp.status === 200) {
                const token = resp.data.data.token;

                if (!token) {
                    const hashCode = resp.data.data;
                    if (!hashCode) {
                        toast.success('Please verify your email to continue.');
                    }
                    navigate(`/verify-email/${encodeURIComponent(hashCode)}`);
                    return;
                }
                setToken(resp.data.data.token);
                toast.success('Login successful!!!');
                setTimeout(() => navigate('/dashboard'), 500);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            toast.error('Login failed. Please try again.');
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
                            Welcome Back
                        </h2>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Sign in to access your Second Brain
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-lg text-sm animate-fadeIn">
                            {error}
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
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
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
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <Button
                                variants="primary"
                                text="Sign in"
                                startIcon={<SubmitIcon />}
                                size="md"
                                fullWidth={true}
                                loading={loading}
                                onClick={handleSubmit}
                            />
                        </div>
                    </form>

                    <div className="text-center text-xs mt-4 flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            New here?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="cursor-pointer font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                                Create an account
                            </button>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                            <button
                                onClick={() => navigate('/forgot-password')}
                                className="cursor-pointer font-medium text-amber-800 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 transition-colors duration-200"
                            >
                                Forgot Password?
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginLayout(LoginPage);
