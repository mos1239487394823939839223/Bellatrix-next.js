'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';
import { CheckBadgeIcon, EnvelopeIcon, ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Verification = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { verify } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    const codeFromQuery = searchParams.get('code');
    if (emailFromQuery || codeFromQuery) {
      setFormData(prev => ({ ...prev, email: emailFromQuery || prev.email, code: codeFromQuery || prev.code }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    else if (formData.code.length < 4) newErrors.code = 'Min 4 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      setServerError('');
      const result = await verify({
        email: formData.email.trim(),
        code: formData.code.trim(),
      });
      if (result.success) {
        router.push('/auth/login?message=' + encodeURIComponent('Email verified successfully! You can now sign in.'));
      } else if (result.message) {
        setServerError(result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      const msg = error?.response?.data?.message || 'Verification failed. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#001038' }}>
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#000e30' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src="/images/logoOne.png" 
              alt="Bellatrix Logo" 
              className="w-72 h-72 object-contain drop-shadow-2xl brightness-0 invert"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white text-center mb-3"
          >
            Verify Your Email
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-center text-lg mb-8"
          >
            Enter the code we sent you
          </motion.p>
          
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 max-w-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-semibold">Check Your Emails</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                📧 Verification code email
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                🔐 Temporary password email
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <img 
              src="/images/logoOne.png" 
              alt="Bellatrix Logo" 
              className="w-40 h-40 object-contain mx-auto mb-4 brightness-0 invert"
            />
            <h1 className="text-xl font-bold text-white">Verify Email</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 mb-4">
                <CheckBadgeIcon className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
              <p className="text-white/50 text-sm mt-1">Enter the verification code sent to your email</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!emailFromState}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.email ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Code Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Verification Code</label>
                <input
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  maxLength="6"
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.code ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all text-center text-lg tracking-widest font-mono`}
                  placeholder="Enter code"
                />
                {errors.code && <p className="mt-2 text-xs text-red-400">{errors.code}</p>}
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p>Keep your <strong>temporary password</strong> from the second email - you'll need it to log in!</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/25"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>

              {serverError && (
                <p className="text-sm text-red-400 text-center">{serverError}</p>
              )}
            </form>

            {/* Links */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-3">
              <p className="text-white/50 text-sm">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                  onClick={() => alert('Resend functionality can be implemented here')}
                >
                  Resend Code
                </button>
              </p>
              <p className="text-white/50 text-sm">
                Already verified?{' '}
                <Link
                  to="/auth/login"
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-white/30">
            © 2024 Bellatrix. All rights reserved.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Verification;
