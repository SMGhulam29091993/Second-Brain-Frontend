import { useState } from 'react';
import { Button } from '../component/ui/button';
import { LoginLayout } from '../component/ui/loginLayout';
import { SubmitIcon } from '../icons/SubmitIcon';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios.config';

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
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    const handleSubmit = async () => {
        // Handle form submission logic here
        if (!validateForm()) {
            return;
        }
        setLoading(true);

        const res = await api.post('/user/register', formData);
        if (res.status === 201 || res.status === 200) {
            const hashCode = res.data.data.hashedCode;
            if (hashCode) {
                console.log('Hash code:', hashCode);
                navigate(`/verify-email/${encodeURIComponent(hashCode)}`);
            }
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
        if (res.status !== 201 && res.status !== 200) {
            setLoading(false);
            setErrors({ general: 'Registration failed. Please try again.' });
        }
    };
    return (
        <>
            <div className="my-14 flex flex-col items-center bg-slate-200 dark:bg-slate-600 rounded-lg p-4 shadow-xl w-72 md:w-xl gap-4 text-black dark:text-slate-100">
                <h2 className="text-2xl font-medium">LOGIN</h2>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="outline-none border border-slate-500 p-3 rounded-lg w-full"
                    onChange={onChangeHandler}
                />
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
                    text="Regitser"
                    startIcon={<SubmitIcon />}
                    size="lg"
                    fullWidth={true}
                    // loading={loading}
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
};

export default LoginLayout(RegisterPage);
