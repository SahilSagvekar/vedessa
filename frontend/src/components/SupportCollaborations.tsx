import React, { useState } from 'react';
import { Send, Users, HeadphonesIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function SupportCollaborations() {
  const { toast } = useToast();
  const [collaborationForm, setCollaborationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [supportForm, setSupportForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    concern: ''
  });

  const [isSubmittingCollaboration, setIsSubmittingCollaboration] = useState(false);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  const handleCollaborationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCollaboration(true);

    try {
      const response = await api.post('/contact/collaboration', collaborationForm);

      if (response.data.success) {
        toast({
          title: 'Success!',
          description: response.data.message || 'Your collaboration request has been submitted successfully.',
        });

        // Reset form
        setCollaborationForm({
          fullName: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Failed to submit your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingCollaboration(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSupport(true);

    try {
      const response = await api.post('/contact/support', supportForm);

      if (response.data.success) {
        toast({
          title: 'Success!',
          description: response.data.message || 'Your support request has been submitted successfully.',
        });

        // Reset form
        setSupportForm({
          fullName: '',
          email: '',
          phone: '',
          concern: ''
        });
      }
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.message || 'Failed to submit your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            Support & Collaborations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you need help with your order or want to collaborate with us,
            we're here to support and connect with those who share our mission.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Collaborations Form */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-700" />
              <span className="text-xs font-medium text-green-700 uppercase tracking-wider">
                Collaboration
              </span>
            </div>

            <h3 className="text-2xl font-serif text-gray-800 mb-2">
              Collaborations & Media
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              For influencer partnerships, PR opportunities, or brand collaborations
            </p>

            <form onSubmit={handleCollaborationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={collaborationForm.fullName}
                  onChange={(e) => setCollaborationForm({ ...collaborationForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={collaborationForm.email}
                    onChange={(e) => setCollaborationForm({ ...collaborationForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={collaborationForm.phone}
                    onChange={(e) => setCollaborationForm({ ...collaborationForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About your work
                </label>
                <textarea
                  placeholder="Tell us about your work, audience, and collaboration ideas..."
                  value={collaborationForm.message}
                  onChange={(e) => setCollaborationForm({ ...collaborationForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingCollaboration}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
              >
                {isSubmittingCollaboration ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Support Form */}
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <HeadphonesIcon className="w-5 h-5 text-amber-700" />
              <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                Support
              </span>
            </div>

            <h3 className="text-2xl font-serif text-gray-800 mb-2">
              Order Support & Returns
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Need help with your order or want to initiate a return?
            </p>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={supportForm.fullName}
                  onChange={(e) => setSupportForm({ ...supportForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={supportForm.phone}
                    onChange={(e) => setSupportForm({ ...supportForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your concern
                </label>
                <textarea
                  placeholder="Describe your order issue, return request, or question..."
                  value={supportForm.concern}
                  onChange={(e) => setSupportForm({ ...supportForm, concern: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingSupport}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
              >
                {isSubmittingSupport ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}