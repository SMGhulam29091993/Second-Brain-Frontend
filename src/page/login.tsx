import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import api from '../config/axios.config';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
    useEffect(() => {
        document.title = 'Sign In | SecondBrain';
    }, []);

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
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
                    navigate(`/verify-email/${encodeURIComponent(hashCode)}`, {
                        state: { email: formData.email },
                    });
                    return;
                }
                setToken(resp.data.data.token);
                toast.success('Welcome back!');
                setTimeout(() => navigate('/dashboard'), 500);
            }
        } catch (err: any) {
            setError('Invalid Credentials. Please try again.');
            toast.error('Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-left">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    Welcome back
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Please enter your details to sign in.
                </p>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold"
                >
                    {error}
                </motion.div>
            )}

            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        Email Address
                    </label>
                    <div className="relative group">
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder="name@company.com"
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all duration-200 font-medium"
                            onChange={onChangeHandler}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <button 
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                        >
                            Forgot?
                        </button>
                    </div>
                    <div className="relative group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all duration-200 font-medium"
                            onChange={onChangeHandler}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    variants="primary"
                    text="Sign in"
                    size="lg"
                    fullWidth={true}
                    loading={loading}
                    type="submit"
                />
            </form>

            <div className="pt-6 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-600 dark:text-blue-400 font-black hover:underline transition-all"
                    >
                        Sign up for free
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginLayout(LoginPage);
