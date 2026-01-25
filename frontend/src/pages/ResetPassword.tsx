import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Lock, ArrowLeft, Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [success, setSuccess] = useState(false);

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setValidating(false);
                setTokenValid(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate-reset-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                setTokenValid(response.ok);
            } catch (error) {
                setTokenValid(false);
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast({
                title: 'Error',
                description: 'Password must be at least 6 characters',
                variant: 'destructive',
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/auth'), 3000);
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Failed to reset password',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700" />
                </div>
            </Layout>
        );
    }

    if (!tokenValid) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-4">Invalid or Expired Link</h1>
                        <p className="text-gray-600 mb-8">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="block w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors text-center"
                        >
                            Request New Link
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    if (success) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-4">Password Reset Successful!</h1>
                        <p className="text-gray-600 mb-8">
                            Your password has been reset successfully. You'll be redirected to sign in shortly.
                        </p>
                        <Link
                            to="/auth"
                            className="block w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors text-center"
                        >
                            Sign In Now
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Reset Your Password</h1>
                        <p className="text-gray-600">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
