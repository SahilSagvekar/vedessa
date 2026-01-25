import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
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

export default function VendorProfile({ profile }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        companyName: profile?.companyName || '',
        gstNumber: profile?.gstNumber || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const bankDetails = formData.bankName ? {
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                accountHolderName: formData.accountHolderName
            } : null;

            await vendorService.updateProfile({
                fullName: formData.fullName,
                companyName: formData.companyName,
                gstNumber: formData.gstNumber,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                ...(bankDetails && { bankDetails })
            });

            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Vendor Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Status */}
                    <div className={`p-4 rounded-lg ${profile?.isApproved ? 'bg-green-50' : 'bg-amber-50'}`}>
                        <p className="text-sm font-medium">
                            Account Status: {' '}
                            <span className={profile?.isApproved ? 'text-green-700' : 'text-amber-700'}>
                                {profile?.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
                            </span>
                        </p>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Personal Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email (Read-only)
                            </label>
                            <input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Business Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GST Number
                                </label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                    maxLength={15}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Business Address</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PIN Code
                                </label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bank Details (Optional) */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Bank Details (Optional)</h3>
                        <p className="text-sm text-gray-500">Update your bank details for payment processing</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                                    maxLength={11}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
