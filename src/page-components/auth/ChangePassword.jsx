'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.jsx';
import { KeyIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Btn, PageHeader, Panel, inputClass } from '../../components/Admin/ui';

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
    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Enter your current password';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'Enter a new password';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Use at least 6 characters';
    else if (formData.newPassword === formData.currentPassword) newErrors.newPassword = 'Must be different from your current password';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm the new password';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
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

  const fields = [
    { name: 'currentPassword', label: 'Current password', placeholder: 'Enter your current password', show: showCurrentPassword, toggle: setShowCurrentPassword, autoComplete: 'current-password' },
    { name: 'newPassword', label: 'New password', placeholder: 'At least 6 characters', show: showNewPassword, toggle: setShowNewPassword, autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm new password', placeholder: 'Re-enter the new password', show: showConfirmPassword, toggle: setShowConfirmPassword, autoComplete: 'new-password' },
  ];

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md pt-10">
        <Panel className="p-8 text-center">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--adm-success-soft)] text-[var(--adm-success)]">
            <CheckCircleIcon className="h-6 w-6" />
          </span>
          <h1 className="text-lg font-semibold text-[var(--adm-text)]">Password updated</h1>
          <p className="mt-1 text-sm text-[var(--adm-text-muted)]">Taking you back to the dashboard…</p>
          <Link
            href="/admin/dashboard"
            className="mt-6 inline-flex h-9 items-center rounded-lg bg-[var(--adm-accent-strong)] px-4 text-sm font-medium text-white hover:bg-[var(--adm-accent)]"
          >
            Go to dashboard
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change password"
        description={user ? `Signed in as ${user.email || user.userName}` : 'Update the password for your admin account.'}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="max-w-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium text-[var(--adm-text)]">
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    id={f.name}
                    type={f.show ? 'text' : 'password'}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    autoComplete={f.autoComplete}
                    aria-invalid={Boolean(errors[f.name])}
                    className={`${inputClass} pr-10 ${errors[f.name] ? '!border-[var(--adm-danger)]' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => f.toggle((v) => !v)}
                    aria-label={f.show ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--adm-text-subtle)] hover:text-[var(--adm-text)]"
                  >
                    {f.show ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors[f.name] && <p className="mt-1.5 text-xs text-[var(--adm-danger)]">{errors[f.name]}</p>}

                {f.name === 'newPassword' && formData.newPassword && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--adm-surface-2)]">
                      <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.width }} />
                    </div>
                    <span className="w-14 text-right text-xs text-[var(--adm-text-muted)]">{passwordStrength.label}</span>
                  </div>
                )}
                {f.name === 'confirmPassword' && formData.confirmPassword && formData.newPassword && !errors.confirmPassword && (
                  <p className={`mt-1.5 text-xs ${formData.newPassword === formData.confirmPassword ? 'text-[var(--adm-success)]' : 'text-[var(--adm-danger)]'}`}>
                    {formData.newPassword === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 border-t border-[var(--adm-border)] pt-5">
              <Btn type="submit" variant="primary" icon={ShieldCheckIcon} loading={isSubmitting}>
                Update password
              </Btn>
              <Btn variant="ghost" onClick={() => router.push('/admin/dashboard')}>
                Cancel
              </Btn>
            </div>
          </form>
        </Panel>

        <Panel className="h-fit p-5">
          <div className="flex items-center gap-2">
            <KeyIcon className="h-4 w-4 text-[var(--adm-text-subtle)]" />
            <h2 className="text-sm font-semibold text-[var(--adm-text)]">A strong password has</h2>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-[var(--adm-text-muted)]">
            {[
              ['At least 8 characters', formData.newPassword.length >= 8],
              ['Upper and lowercase letters', /[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword)],
              ['A number', /[0-9]/.test(formData.newPassword)],
              ['A symbol', /[^A-Za-z0-9]/.test(formData.newPassword)],
            ].map(([label, met]) => (
              <li key={label} className="flex items-center gap-2">
                <CheckCircleIcon className={`h-4 w-4 ${met ? 'text-[var(--adm-success)]' : 'text-[var(--adm-text-subtle)]'}`} />
                <span className={met ? 'text-[var(--adm-text)]' : ''}>{label}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
};

export default ChangePassword;
