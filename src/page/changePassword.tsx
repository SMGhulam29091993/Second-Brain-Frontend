import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import api from '../config/axios.config';
import { SubmitIcon } from '../icons/SubmitIcon';
import toast from 'react-hot-toast';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    const userId = params.id;

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error('Both fields are required');
            setError('Both fields are required');

            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            setError('Password must be at least 6 characters');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await api.put(`/user/reset-password/${userId}`, {
                password: formData.newPassword,
            });
            if (res.status === 200) {
                toast.success('Password changed successfully!');
                setSuccess('Password changed successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error('Failed to change password. Please try again.');
                setError('Failed to change password. Please try again.');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to change password.');
            setError(err.response?.data?.message || 'Failed to change password.');
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
                            Change Password
                        </h2>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Enter your new password below
                        </p>
                    </div>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-lg text-sm animate-fadeIn">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/30 text-green-500 p-2 rounded-lg text-sm animate-fadeIn">
                            {success}
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
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter new password"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200"
                                onChange={onChangeHandler}
                                value={formData.newPassword}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200"
                                onChange={onChangeHandler}
                                value={formData.confirmPassword}
                            />
                        </div>
                        <Button
                            variants="primary"
                            text="Change Password"
                            startIcon={<SubmitIcon />}
                            size="md"
                            fullWidth={true}
                            loading={loading}
                            onClick={handleSubmit}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginLayout(ChangePassword);
