import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Store, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import vendorService from '@/services/vendorService';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
];

export default function VendorRegistration() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        // Step 1: Account Details
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',

        // Step 2: Business Details
        companyName: '',
        gstNumber: '',
        phone: '',

        // Step 3: Address
        address: '',
        city: '',
        state: '',
        pincode: '',

        // Step 4: Bank Details
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',

        // Terms
        agreeToTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.email || !formData.password || !formData.fullName) {
                toast({
                    title: 'Missing Fields',
                    description: 'Please fill in all required fields',
                    variant: 'destructive',
                });
                return false;
            }
            if (formData.password.length < 6) {
                toast({
                    title: 'Invalid Password',
                    description: 'Password must be at least 6 characters',
                    variant: 'destructive',
                });
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                toast({
                    title: 'Password Mismatch',
                    description: 'Passwords do not match',
                    variant: 'destructive',
                });
                return false;
            }
        }

        if (currentStep === 2) {
            if (!formData.companyName || !formData.phone) {
                toast({
                    title: 'Missing Fields',
                    description: 'Please fill in all required fields',
                    variant: 'destructive',
                });
                return false;
            }
        }

        if (currentStep === 3) {
            if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
                toast({
                    title: 'Missing Fields',
                    description: 'Please fill in all address fields',
                    variant: 'destructive',
                });
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            toast({
                title: 'Terms Required',
                description: 'Please accept the terms and conditions',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const bankDetails = {
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                accountHolderName: formData.accountHolderName
            };

            const response = await vendorService.register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                companyName: formData.companyName,
                gstNumber: formData.gstNumber || null,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                bankDetails
            });

            if (response.data) {
                // Auto-login after successful registration
                await signIn(formData.email, formData.password);
                setSuccess(true);

                setTimeout(() => {
                    navigate('/vendor/dashboard');
                }, 2000);
            }
        } catch (error) {
            toast({
                title: 'Registration Failed',
                description: error.message || 'Failed to register as vendor',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-4">Registration Successful!</h1>
                        <p className="text-gray-600 mb-8">
                            Your vendor account has been created successfully. Your account is pending admin approval.
                            We'll notify you once it's approved.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    const steps = [
        { number: 1, title: 'Account Details', icon: '👤' },
        { number: 2, title: 'Business Details', icon: '🏢' },
        { number: 3, title: 'Address', icon: '📍' },
        { number: 4, title: 'Bank Details', icon: '🏦' }
    ];

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Store className="w-8 h-8 text-green-700" />
                            </div>
                            <h1 className="text-3xl font-serif text-gray-900 mb-2">Become a Vendor</h1>
                            <p className="text-gray-600">
                                Join our platform and start selling your Ayurvedic products
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                {steps.map((step, index) => (
                                    <div key={step.number} className="flex-1">
                                        <div className="flex items-center">
                                            <div className={`flex flex-col items-center flex-1 ${index !== 0 ? 'ml-2' : ''}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= step.number
                                                        ? 'bg-green-700 text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {step.icon}
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${currentStep >= step.number ? 'text-green-700' : 'text-gray-500'
                                                    }`}>
                                                    {step.title}
                                                </span>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className={`h-1 flex-1 ${currentStep > step.number ? 'bg-green-700' : 'bg-gray-200'
                                                    }`} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Account Details */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Minimum 6 characters"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm Password *
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Re-enter password"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Business Details */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Company Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Your company name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                GST Number (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="gstNumber"
                                                value={formData.gstNumber}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="22AAAAA0000A1Z5"
                                                maxLength={15}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Address */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Address</h2>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address *
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                                                placeholder="Street address, building number"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    placeholder="City"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State *
                                                </label>
                                                <select
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                >
                                                    <option value="">Select State</option>
                                                    {INDIAN_STATES.map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                PIN Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                required
                                                maxLength={6}
                                                pattern="[0-9]{6}"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="400001"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Bank Details */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Details</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            This information is required for payment processing. All data is encrypted and secure.
                                        </p>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={formData.bankName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="e.g., HDFC Bank"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                name="accountHolderName"
                                                value={formData.accountHolderName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="As per bank records"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Bank account number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                name="ifscCode"
                                                value={formData.ifscCode}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="e.g., HDFC0001234"
                                                maxLength={11}
                                            />
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                id="agreeToTerms"
                                                name="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onChange={handleChange}
                                                className="mt-1"
                                            />
                                            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                                                I agree to the{' '}
                                                <Link to="/terms" className="text-green-700 hover:underline">
                                                    Terms & Conditions
                                                </Link>{' '}
                                                and{' '}
                                                <Link to="/privacy" className="text-green-700 hover:underline">
                                                    Privacy Policy
                                                </Link>
                                                . I understand that my account will be reviewed before approval.
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}

                                    <div className={currentStep === 1 ? 'ml-auto' : ''}>
                                        {currentStep < 4 ? (
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Complete Registration'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Help Text */}
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have a vendor account?{' '}
                            <Link to="/auth" className="text-green-700 hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
