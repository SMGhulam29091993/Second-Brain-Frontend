import { useState } from 'react';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import { SubmitIcon } from '../icons/SubmitIcon';
import api from '../config/axios.config';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [error, setError] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
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
            setLoading(false);
            setError(false);
            localStorage.setItem('token', resp.data.token);
            navigate('/dashboard');
        }

        return;
    };
    return (
        <>
            <div className="my-14 flex flex-col items-center bg-slate-200 dark:bg-slate-600 rounded-lg p-4 shadow-xl w-xl min-h-60 gap-4 text-black dark:text-slate-100">
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
            </div>
        </>
    );
};

export default LoginLayout(LoginPage);
