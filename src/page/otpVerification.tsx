import { useEffect, useState } from 'react';
import { LoginLayout } from '../component/ui/loginLayout';
import { OTPInput } from '../component/ui/otpInput';
import api from '../config/axios.config';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const verificationPage = () => {
    useEffect(() => {
        document.title = 'Otp Verification | Second Brain';
    }, []);
    // const [otpValue, setOtpValue] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(false);

    const params = useParams();
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

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
    return (
        <>
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Enter Verification Code
                        </h1>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to your phone number
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
                            <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                                Didn't receive the code? Resend
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginLayout(verificationPage);
