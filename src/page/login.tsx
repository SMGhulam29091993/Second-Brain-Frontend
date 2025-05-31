import { useEffect, useState } from 'react';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import { SubmitIcon } from '../icons/SubmitIcon';
import api from '../config/axios.config';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [error, setError] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const setToken = useAuthStore((state) => state.setToken);

    // useEffect(() => {
    //     localStorage.removeItem('token');
    // }, []);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    const handleSubmit = async () => {
        // Handle form submission logic here
        const resp = await api.post('/user/login', formData);
        setLoading(true);
        setError(false);
        if (resp.status === 200) {
            setTimeout(() => setLoading(false), 1500);
            setError(false);
            // localStorage.setItem('token', resp.data.data.token);
            console.log('Login successful:', resp.data.data);
            const token = resp.data.data.token;
            if (!token) {
                const hashCode = resp.data.data;
                console.log('Hash code:', hashCode);
                navigate(`/verify-email/${encodeURIComponent(hashCode)}`);
                setLoading(false);
                return;
            }

            setToken(resp.data.data.token);
        }
        setTimeout(() => navigate('/dashboard'), 500);

        return;
    };
    return (
        <>
            <div className="my-14 flex flex-col items-center bg-slate-200 dark:bg-slate-600 rounded-lg p-4 shadow-xl w-72 md:w-xl gap-4 text-black dark:text-slate-100">
                <h2 className="text-2xl font-medium">LOGIN</h2>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="outline-none border border-slate-500 p-3 rounded-lg w-full"
                    onChange={onChangeHandler}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="outline-none border border-slate-500 p-3 rounded-lg w-full"
                    onChange={onChangeHandler}
                />
                <Button
                    variants="primary"
                    text="Login"
                    startIcon={<SubmitIcon />}
                    size="lg"
                    fullWidth={true}
                    loading={loading}
                    onClick={handleSubmit}
                />
                <p className="font-light">
                    New here?{' '}
                    <span
                        className="text-blue-500 font-medium cursor-pointer"
                        onClick={() => navigate('/register')}
                    >
                        Register Here...
                    </span>
                </p>
            </div>
        </>
    );
};

export default LoginLayout(LoginPage);
