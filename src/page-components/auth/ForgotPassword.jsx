'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';
import { KeyIcon, EnvelopeIcon, ArrowRightIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const { forgotPassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSubmitted && countdown === 0) {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }
  }, [isSubmitted, countdown, router, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email'); return; }
    setIsSubmitting(true);
    setError('');
    try {
      const result = await forgotPassword(email);
      if (result.success) { setIsSubmitted(true); setCountdown(5); }
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#001038' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Sent!</h2>
            <p className="text-white/70 text-sm mb-2">We've sent a verification code to</p>
            <p className="text-blue-400 font-semibold mb-6">{email}</p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-300">
                Please check your inbox and spam folder. The code expires in <strong>24 hours</strong>.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Redirecting in <span className="font-bold text-blue-400">{countdown}</span>s</span>
            </div>

            <div className="space-y-3">
              <Link
                to="/auth/reset-password"
                state={{ email: email }}
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/25"
              >
                Enter Verification Code →
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3 px-4 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Didn't receive? Send again
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Link to="/auth/login" className="text-sm text-white/50 hover:text-blue-400 transition-colors">
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form State
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#001038' }}>
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#000e30' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
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
            Forgot Password?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-center text-lg mb-8 max-w-sm"
          >
            Don't worry! We'll help you reset it.
          </motion.p>
          
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 max-w-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold">What Happens Next</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Enter your email address
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Receive verification code
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Create new password
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
            <h1 className="text-xl font-bold text-white">Forgot Password</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-4">
                <KeyIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
              <p className="text-white/50 text-sm mt-1">Enter your email to receive a verification code</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    error ? 'border-red-500/50' : 'border-white/10'
                  } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all`}
                  placeholder="Enter your email address"
                />
                {error && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Warning Box */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-300">
                    Make sure to use the same email address you registered with.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm">
                Remember your password?{' '}
                <Link
                  to="/auth/login"
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                >
                  Sign In
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

export default ForgotPassword;
