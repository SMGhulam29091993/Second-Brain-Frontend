import { useEffect, useState } from 'react';
import { LoginLayout } from '../component/ui/loginLayout';
import { OTPInput } from '../component/ui/otpInput';
import api from '../config/axios.config';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const verificationPage = () => {
    useEffect(() => {
        document.title = 'Otp Verification | Second Brain';
    }, []);
    // const [otpValue, setOtpValue] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [isResending, setIsResending] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(false);

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const setToken = useAuthStore((state) => state.setToken);
    const email = (location.state as { email?: string } | null)?.email;

    const hashCode = params.hashCode ? decodeURIComponent(params.hashCode) : '';

    const handleOtpComplete = async (otp: string) => {
        const isValidOtp = otp.length === 6 && /^[a-zA-Z0-9]+$/.test(otp); // Check if OTP is 6 digits
        if (!isValidOtp) {
            console.error('Invalid OTP format');
            return;
        }
        const res = await api.post(`/user/verify/${hashCode}`, { code: otp });
        if (res.status !== 200) {
            toast.error('OTP verification failed. Please try again.');
            console.error('OTP verification failed');
            return;
        }
        const token = res.data.data.token;
        const user = res.data.data.user;

        toast.success('OTP verified successfully!');
        if (user.isEmailVerified) {
            setToken(token);
            navigate('/dashboard');
        }

        setIsComplete(true);

        // Simulate verification process
        setTimeout(() => {
            setIsComplete(false);
        }, 2000);
    };

    const handleOtpChange = () => {
        // setOtpValue(otp);
        setIsComplete(false);
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Email is missing. Please go back and try again.');
            return;
        }

        try {
            setIsResending(true);
            const response = await api.post('/user/resend-verification-email', { email });

            if (response.status === 200) {
                toast.success('Verification code resent successfully.');
                return;
            }

            toast.error('Failed to resend. Please try again.');
        } catch (error) {
            toast.error('Failed to resend. Please try again.');
        } finally {
            setIsResending(false);
        }
    };
    return (
        <>
            <div className="flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 max-w-md w-full border border-slate-100 dark:border-slate-800">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                            Verify your Email
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            We've sent a 6-digit code to <br/>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{email || 'your email'}</span>
                        </p>
                    </div>

                    <div className="mb-6">
                        <OTPInput
                            length={6}
                            onComplete={handleOtpComplete}
                            onChange={handleOtpChange}
                            disabled={false}
                            className="mb-4"
                        />
                    </div>

                    {isComplete && (
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                ✓ OTP Verified Successfully!
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isResending
                                    ? 'Resending...'
                                    : "Didn't receive the code? Resend"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginLayout(verificationPage);
