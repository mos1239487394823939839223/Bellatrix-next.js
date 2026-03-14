'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.jsx';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { motion } from 'framer-motion';
import { KeyIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { changePassword, user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Required';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'Required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Min 6 characters';
    else if (formData.newPassword === formData.currentPassword) newErrors.newPassword = 'Must be different';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Required';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'No match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const result = await changePassword(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => router.push('/admin/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Change password error:', error);
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

  // Success State
  if (isSuccess) {
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
            <h2 className="text-2xl font-bold text-white mb-2">Password Changed!</h2>
            <p className="text-white/70 text-sm mb-6">Your password has been updated successfully.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Redirecting to dashboard...</span>
            </div>
            <Link 
              to="/admin" 
              className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all"
            >
              Go to Dashboard →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
            Change Password
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-center text-lg mb-8"
          >
            Keep your account secure
          </motion.p>
          
          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 max-w-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold">Security Tips</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Use at least 8 characters
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Mix uppercase & lowercase
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Include numbers & symbols
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
              src="/images/logoTwo.png" 
              alt="Bellatrix Logo" 
              className="w-40 h-40 object-contain mx-auto mb-4 brightness-0 invert"
            />
            <h1 className="text-xl font-bold text-white">Change Password</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Update Password</h2>
              {user && <p className="text-white/50 text-sm mt-1">{user.email || user.userName}</p>}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'} 
                    name="currentPassword" 
                    value={formData.currentPassword} 
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.currentPassword ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && <p className="mt-2 text-xs text-red-400">{errors.currentPassword}</p>}
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-transparent text-xs text-white/40">New Password</span>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    name="newPassword" 
                    value={formData.newPassword} 
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.newPassword ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPassword(!showNewPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="mt-2 text-xs text-red-400">{errors.newPassword}</p>}
                {formData.newPassword && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.width }} />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.level === 1 ? 'text-red-400' : passwordStrength.level === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
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
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-xs text-red-400">{errors.confirmPassword}</p>}
                {formData.confirmPassword && formData.newPassword && (
                  <p className={`mt-2 text-xs flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                    {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/25"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <ShieldCheckIcon className="w-5 h-5" />
                    Update Password
                  </>
                )}
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
