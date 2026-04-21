'use client'
import React, { useState } from "react";
import { postJson } from "../lib/api";

const ContactForm = ({
  onSubmit,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    country: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.industry &&
      formData.country &&
      formData.message.trim() && formData.message.trim().length >= 10
    );
  };

  const industryToEnum = (label) => {
    const map = { "Manufacturing": 1, "Retail & E-commerce": 2, "Healthcare": 3, "Finance & Banking": 4, "Technology": 5, "Professional Services": 6, "Non-Profit": 7, "Other": 8 };
    return map[label] ?? 0;
  };

  const countryToEnum = (label) => {
    const map = { "United States": 3898, "Canada": 3386, "United Kingdom": 3895, "Australia": 3194, "Germany": 3413, "France": 3406, "UAE": 3890, "Saudi Arabia": 3760, "Egypt": 3358, "Other": 999 };
    return map[label] ?? 999;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (onSubmit) return onSubmit(e);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phone.trim() || null,
      companyName: formData.companyName.trim() || null,
      industry: industryToEnum(formData.industry),
      country: countryToEnum(formData.country),
      message: formData.message.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.message || payload.message.length < 10 || payload.industry === 0) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await postJson("/ContactMessages/submit", payload);
      setSuccess(true);
      if (typeof onSuccess === "function") onSuccess();
      setFormData({ fullName: "", email: "", phone: "", companyName: "", industry: "", country: "", message: "" });
    } catch (err) {
      setError(err?.message || "Failed to submit. Please try again.");
      if (typeof onError === "function") onError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-base placeholder-white/40 focus:bg-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 hover:border-white/30";
  const selectClasses = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-base focus:bg-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 cursor-pointer hover:border-white/30";
  const labelClasses = "text-white/80 text-sm font-semibold mb-1.5 block";

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-400/40 rounded-xl p-4 text-green-300 text-sm flex items-center gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-4 text-red-300 text-sm flex items-center gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Full Name <span className="text-cyan-400">*</span>
              </span>
            </label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputClasses} placeholder="John Doe" required autoComplete="name" />
          </div>
          <div className="group">
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email <span className="text-cyan-400">*</span>
              </span>
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} placeholder="john@company.com" required inputMode="email" autoComplete="email" />
          </div>
        </div>

        {/* Row 2: Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Phone
              </span>
            </label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClasses} placeholder="+1 (555) 123-4567" inputMode="tel" autoComplete="tel" />
          </div>
          <div className="group">
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Company
              </span>
            </label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={inputClasses} placeholder="Your Company" autoComplete="organization" />
          </div>
        </div>

        {/* Row 3: Industry & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Industry <span className="text-cyan-400">*</span>
              </span>
            </label>
            <select name="industry" value={formData.industry} onChange={handleInputChange} className={selectClasses} required
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px', appearance: 'none', paddingRight: '28px' }}>
              <option value="" className="bg-[var(--color-brand-dark-navy)]">Select...</option>
              <option value="Manufacturing" className="bg-[var(--color-brand-dark-navy)]">Manufacturing</option>
              <option value="Retail & E-commerce" className="bg-[var(--color-brand-dark-navy)]">Retail & E-commerce</option>
              <option value="Healthcare" className="bg-[var(--color-brand-dark-navy)]">Healthcare</option>
              <option value="Finance & Banking" className="bg-[var(--color-brand-dark-navy)]">Finance & Banking</option>
              <option value="Technology" className="bg-[var(--color-brand-dark-navy)]">Technology</option>
              <option value="Professional Services" className="bg-[var(--color-brand-dark-navy)]">Professional Services</option>
              <option value="Other" className="bg-[var(--color-brand-dark-navy)]">Other</option>
            </select>
          </div>
          <div className="group">
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Country <span className="text-cyan-400">*</span>
              </span>
            </label>
            <select name="country" value={formData.country} onChange={handleInputChange} className={selectClasses} required
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px', appearance: 'none', paddingRight: '28px' }}>
              <option value="" className="bg-[var(--color-brand-dark-navy)]">Select...</option>
              <option value="United States" className="bg-[var(--color-brand-dark-navy)]">United States</option>
              <option value="United Kingdom" className="bg-[var(--color-brand-dark-navy)]">United Kingdom</option>
              <option value="Canada" className="bg-[var(--color-brand-dark-navy)]">Canada</option>
              <option value="UAE" className="bg-[var(--color-brand-dark-navy)]">UAE</option>
              <option value="Saudi Arabia" className="bg-[var(--color-brand-dark-navy)]">Saudi Arabia</option>
              <option value="Egypt" className="bg-[var(--color-brand-dark-navy)]">Egypt</option>
              <option value="Germany" className="bg-[var(--color-brand-dark-navy)]">Germany</option>
              <option value="Other" className="bg-[var(--color-brand-dark-navy)]">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="group">
          <label className={labelClasses}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Message <span className="text-cyan-400">*</span>
            </span>
          </label>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleInputChange}
            className={`${inputClasses} resize-none`}
            placeholder="Tell us about your project and how we can help..."
            maxLength={500}
            required
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${formData.message.length > 450 ? 'text-amber-400' : 'text-white/40'}`}>
              {formData.message.length}/500
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              24hr response
            </span>
            <span className="text-white/50 text-sm flex items-center gap-2 hidden sm:flex">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Secure
            </span>
          </div>
          <button
            type="submit"
            disabled={!isFormValid() || submitting}
            className={`px-6 py-2.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2
              ${!isFormValid() || submitting
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
              style={{ minHeight: 48 }}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
