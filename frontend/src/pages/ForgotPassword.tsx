import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: 'Error',
                description: 'Please enter your email address',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
            } else {
                toast({
                    title: 'Error',
                    description: data.message || 'Failed to send reset email',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            // Even if there's an error, we show success to prevent email enumeration
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-4">Check Your Email</h1>
                        <p className="text-gray-600 mb-8">
                            If an account exists with <strong>{email}</strong>, you will receive a password
                            reset link shortly. Please check your inbox and spam folder.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setEmail('');
                                }}
                                className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Try Different Email
                            </button>
                            <Link
                                to="/auth"
                                className="block w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors text-center"
                            >
                                Back to Sign In
                            </Link>
                        </div>
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
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-2">Forgot Password?</h1>
                        <p className="text-gray-600">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
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
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Remember your password?{' '}
                        <Link to="/auth" className="text-green-700 hover:text-green-800 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
