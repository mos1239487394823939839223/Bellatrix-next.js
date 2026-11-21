'use client'
import React, { useId, useRef, useState } from "react";
import { postJson } from "../lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;
const EMPTY_FORM = { fullName: "", email: "", phone: "", companyName: "", industry: "", country: "", message: "" };
const FIELD_ORDER = ["fullName", "email", "industry", "country", "message"];

// Returns { field: "error message" } for every invalid field
const validate = (data) => {
  const errors = {};
  if (!data.fullName.trim()) errors.fullName = "Please enter your name.";
  if (!data.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = "Please enter a valid email, e.g. name@company.com.";
  if (!data.industry) errors.industry = "Please choose your industry.";
  if (!data.country) errors.country = "Please choose your country.";
  const msg = data.message.trim();
  if (!msg) errors.message = "Please tell us a little about your project.";
  else if (msg.length < MIN_MESSAGE) errors.message = `Please write at least ${MIN_MESSAGE} characters (${MIN_MESSAGE - msg.length} more).`;
  return errors;
};

const ContactForm = ({
  onSubmit,
  onSuccess,
  onError,
  onDone,
}) => {
  const uid = useId();
  const fid = (name) => `${uid}-${name}`;
  const formRef = useRef(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  // Fields the user has left (or tried to submit) — errors only show for these,
  // so people aren't scolded while still typing.
  const [touched, setTouched] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Don't flag an untouched empty field just because focus passed through it
    if (formData[name]?.trim?.()) setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const errors = validate(formData);
  const fieldError = (name) => (touched[name] ? errors[name] : undefined);

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

    const currentErrors = validate(formData);
    if (Object.keys(currentErrors).length > 0) {
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
      // Take the user straight to the first problem
      const first = FIELD_ORDER.find((f) => currentErrors[f]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }

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
      setFormData(EMPTY_FORM);
      setTouched({});
    } catch (err) {
      setError(
        err?.message && !/^(Request failed|Network Error|Failed to fetch)/i.test(err.message)
          ? err.message
          : "We couldn't send your message. Please check your connection and try again."
      );
      if (typeof onError === "function") onError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-base placeholder-white/40 focus:bg-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 hover:border-white/30";
  const selectClasses = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white text-base focus:bg-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 cursor-pointer hover:border-white/30";
  const labelClasses = "text-white/80 text-sm font-semibold mb-1.5 block";
  const invalidClasses = " !border-red-400/80 focus:!ring-red-400/30";
  const errorText = (name) =>
    fieldError(name) ? (
      <p id={`${fid(name)}-error`} className="mt-1.5 text-sm text-red-300">
        {fieldError(name)}
      </p>
    ) : null;
  // Accessibility props shared by every validated control
  const a11y = (name, extraDescribedBy) => ({
    id: fid(name),
    "aria-invalid": fieldError(name) ? true : undefined,
    "aria-describedby": [fieldError(name) ? `${fid(name)}-error` : null, extraDescribedBy].filter(Boolean).join(" ") || undefined,
    onBlur: handleBlur,
  });

  if (success) {
    return (
      <div role="status" className="py-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center">
          <svg aria-hidden="true" className="w-7 h-7 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">Thanks — your message is on its way</h3>
        <p className="mt-2 text-white/70">A Bellatrix consultant will reply within 24 hours on business days.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {typeof onDone === "function" && (
            <button type="button" onClick={onDone} className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" style={{ minHeight: 44 }}>
              Done
            </button>
          )}
          <button type="button" onClick={() => setSuccess(false)} className="px-6 py-2.5 rounded-xl font-semibold text-white/80 border border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" style={{ minHeight: 44 }}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form ref={formRef} className="space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Messages */}
        <p className="text-white/50 text-xs"><span className="text-cyan-400">*</span> Required</p>
        {error && (
          <div role="alert" className="bg-red-500/20 border border-red-400/40 rounded-xl p-4 text-red-300 text-sm flex items-center gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label htmlFor={fid("fullName")} className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Full Name <span className="text-cyan-400" aria-hidden="true">*</span>
              </span>
            </label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} {...a11y("fullName")} className={inputClasses + (fieldError("fullName") ? invalidClasses : "")} placeholder="John Doe" required aria-required="true" autoComplete="name" />
            {errorText("fullName")}
          </div>
          <div className="group">
            <label htmlFor={fid("email")} className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email <span className="text-cyan-400" aria-hidden="true">*</span>
              </span>
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} {...a11y("email")} className={inputClasses + (fieldError("email") ? invalidClasses : "")} placeholder="john@company.com" required aria-required="true" inputMode="email" autoComplete="email" />
            {errorText("email")}
          </div>
        </div>

        {/* Row 2: Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label htmlFor={fid("phone")} className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Phone
              </span>
            </label>
            <input type="tel" name="phone" id={fid("phone")} value={formData.phone} onChange={handleInputChange} className={inputClasses} placeholder="+1 (555) 123-4567" inputMode="tel" autoComplete="tel" />
          </div>
          <div className="group">
            <label htmlFor={fid("companyName")} className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Company
              </span>
            </label>
            <input type="text" name="companyName" id={fid("companyName")} value={formData.companyName} onChange={handleInputChange} className={inputClasses} placeholder="Your Company" autoComplete="organization" />
          </div>
        </div>

        {/* Row 3: Industry & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label htmlFor={fid("industry")} className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Industry <span className="text-cyan-400" aria-hidden="true">*</span>
              </span>
            </label>
            <select name="industry" value={formData.industry} onChange={handleInputChange} {...a11y("industry")} onBlur={() => formData.industry && setTouched((p) => ({ ...p, industry: true }))} className={selectClasses + (fieldError("industry") ? invalidClasses : "")} required aria-required="true"
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
            {errorText("industry")}
          </div>
          <div className="group">
            <label htmlFor={fid("country")} className={labelClasses}>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Country <span className="text-cyan-400" aria-hidden="true">*</span>
              </span>
            </label>
            <select name="country" value={formData.country} onChange={handleInputChange} {...a11y("country")} onBlur={() => formData.country && setTouched((p) => ({ ...p, country: true }))} className={selectClasses + (fieldError("country") ? invalidClasses : "")} required aria-required="true" autoComplete="country-name"
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
            {errorText("country")}
          </div>
        </div>

        {/* Message */}
        <div className="group">
          <label htmlFor={fid("message")} className={labelClasses}>
            <span className="flex items-center gap-2">
              <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Message <span className="text-cyan-400" aria-hidden="true">*</span>
            </span>
          </label>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleInputChange}
            {...a11y("message", fid("message-hint"))}
            className={`${inputClasses} resize-none${fieldError("message") ? invalidClasses : ""}`}
            placeholder="Tell us about your project and how we can help..."
            maxLength={500}
            required
            aria-required="true"
          />
          {errorText("message")}
          <div className="flex justify-between gap-3 mt-1">
            <span id={fid("message-hint")} className="text-xs text-white/50">At least {MIN_MESSAGE} characters.</span>
            <span aria-hidden="true" className={`text-xs ${formData.message.length > 450 ? 'text-amber-400' : 'text-white/50'}`}>
              {formData.message.length}/500
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-sm flex items-center gap-2">
              <svg aria-hidden="true" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              24hr response
            </span>
            <span className="text-white/50 text-sm flex items-center gap-2 hidden sm:flex">
              <svg aria-hidden="true" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Secure
            </span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
            className={`px-6 py-2.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300
              ${submitting
                ? "bg-white/10 text-white/60 cursor-wait"
                : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:brightness-110 text-white shadow-lg shadow-black/30 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
              style={{ minHeight: 48 }}
          >
            {submitting ? (
              <>
                <svg aria-hidden="true" className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
