import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase/supabase.config';
import PasswordInput from '@/components/generic-input/password-input.component';
import BaseButton from '@/components/buttons/base-button.component';
import AbsoluteLoaderLayout from '@/components/loader/absolute-loader-layout.component';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorToast, setSuccessToast } from '@/store/toast/toast.actions';
import { selectAuthLoading } from '@/store/auth/auth.selector';

const ChangePasswordPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const authLoading = useSelector(selectAuthLoading);

    const showErrorMessage = (message: string) => {
        dispatch(setErrorToast(message));
    };

    const showSuccessMessage = (message: string) => {
        dispatch(setSuccessToast(message));
    };

    useEffect(() => {
        const validateCode = async () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');

            if (!code) {
                navigate('/auth/reset-password');
                return;
            }

            // try {
            //     setIsLoading(true);
            //     // Verify the recovery code
            //     const { error } = await supabase.auth.exchangeCodeForSession(code);
            //     if (error) {
            //         throw new Error(error.message)
            //     }
            // } catch (err: any) {
            //     setError('Invalid or expired code');
            //     console.error('Error validating code:', err);
            //     setTimeout(()=>{
            //         navigate('/auth/reset-password');
            //     }, 5000)
            // } finally {
            //     setIsLoading(false);
            // }
        };

        validateCode();
    }, [location, navigate, dispatch]);

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) {
                throw updateError;
            }

            showSuccessMessage('Password updated successfully!');
            setTimeout(() => navigate('/auth/signin'), 3000);
        } catch (err: any) {
            setError('Failed to reset password');
            showErrorMessage('Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
            <div className="w-full max-w-md p-8 space-y-3 lg:rounded-xl bg-white lg:shadow-lg">
                <h2 className="text-2xl font-bold text-center">Change Password</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <PasswordInput
                        label="New Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <BaseButton submitType="submit">Reset Password</BaseButton>
                    {error && <p className='text-red-400 text-sm my-6'>{error}</p>}
                </form>
            </div>
            {(isLoading || authLoading) && <AbsoluteLoaderLayout />}
        </div>
    );
};

export default ChangePasswordPage;