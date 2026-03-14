'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, KeyIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get('email');
    const code = searchParams.get('code');
    if (email) setFormData(prev => ({ ...prev, email, resetToken: code || '' }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.resetToken.trim()) newErrors.resetToken = 'Code is required';
    else if (formData.resetToken.length < 6) newErrors.resetToken = 'Min 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.newPassword.trim()) newErrors.newPassword = 'Password is required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Min 6 characters';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Required';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'No match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsSubmitting(true);
    try {
      const result = await resetPassword(formData);
      if (result.success) {
        router.push('/auth/login?message=' + encodeURIComponent('Password reset successfully!'));
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '', width: '0%' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (strength <= 2) return { level: 1, label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 4) return { level: 2, label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { level: 3, label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

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
              src="/images/logoTwo.png" 
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
            {step === 1 ? 'Enter Verification Code' : 'Create New Password'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-center text-lg mb-8"
          >
            {step === 1 ? 'Enter the code from your email' : 'Choose a strong password'}
          </motion.p>
          
          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'
            }`}>
              {step > 1 ? <CheckIcon className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 rounded-full ${step > 1 ? 'bg-blue-500' : 'bg-white/20'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'
            }`}>
              2
            </div>
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
              src="/images/logoTwo.png" 
              alt="Bellatrix Logo" 
              className="w-40 h-40 object-contain mx-auto mb-4 brightness-0 invert"
            />
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
          </div>

          {/* Mobile Progress */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'
            }`}>
              {step > 1 ? <CheckIcon className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-12 h-1 rounded-full ${step > 1 ? 'bg-blue-500' : 'bg-white/20'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'
            }`}>
              2
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-4">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Verify Your Identity</h2>
                  <p className="text-white/50 text-sm mt-1">Enter the code from your email</p>
                </div>

                <div className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                    />
                  </div>

                  {/* Code Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Verification Code</label>
                    <input
                      type="text"
                      name="resetToken"
                      value={formData.resetToken}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        errors.resetToken ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-center text-lg tracking-widest font-mono`}
                      placeholder="Enter code"
                    />
                    {errors.resetToken && <p className="mt-2 text-xs text-red-400">{errors.resetToken}</p>}
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/25"
                  >
                    <span>Continue</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 mb-4">
                    <KeyIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">New Password</h2>
                  <p className="text-white/50 text-sm mt-1">Choose a strong password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 bg-white/5 border ${
                          errors.newPassword ? 'border-red-500/50' : 'border-white/10'
                        } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="mt-2 text-xs text-red-400">{errors.newPassword}</p>}
                    
                    {/* Password Strength */}
                    {formData.newPassword && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${passwordStrength.color} transition-all`} style={{ width: passwordStrength.width }} />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.level === 1 ? 'text-red-400' : 
                          passwordStrength.level === 2 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 pr-12 bg-white/5 border ${
                          errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                        } rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-2 text-xs text-red-400">{errors.confirmPassword}</p>}
                    
                    {/* Match Indicator */}
                    {formData.confirmPassword && formData.newPassword && (
                      <p className={`mt-2 text-xs flex items-center gap-1 ${
                        formData.newPassword === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords don\'t match'}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/10"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/25"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <span>Reset</span>
                          <CheckIcon className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Link to="/auth/login" className="text-sm text-white/50 hover:text-blue-400 transition-colors">
                ← Back to Sign In
              </Link>
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

export default ResetPassword;
