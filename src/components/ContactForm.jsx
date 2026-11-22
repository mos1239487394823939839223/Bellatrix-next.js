'use client'
import React, { useId, useRef, useState } from "react";
import { services } from "../services";
import { validate as validateSchema } from "../core/validation/Validator";
import { contactMessageSchema } from "../core/validation/schemas";

const MIN_MESSAGE = 10;
const EMPTY_FORM = { fullName: "", email: "", phone: "", companyName: "", industry: "", country: "", message: "" };
const FIELD_ORDER = ["fullName", "email", "industry", "country", "message"];

// Same rules the messages service enforces (src/core/validation/schemas.js)
const validate = (data) => validateSchema(contactMessageSchema, data).errors;

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
  // Spam protection: a field people never see (bots fill it) and the time the
  // form was opened (bots submit instantly). Either one → pretend success, send nothing.
  const [trap, setTrap] = useState("");
  const openedAt = useRef(Date.now());
  
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

    const looksLikeBot = trap.trim() !== "" || Date.now() - openedAt.current < 3000;

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

    if (looksLikeBot) {
      // Look identical to a real success so bots don't adapt
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      setSubmitting(false);
      setSuccess(true);
      setFormData(EMPTY_FORM);
      setTouched({});
      return;
    }

    try {
      setSubmitting(true);
      await services.messages.submit({ ...formData, industryId: payload.industry, countryId: payload.country });
      setSuccess(true);
      if (typeof onSuccess === "function") onSuccess();
      setFormData(EMPTY_FORM);
      setTouched({});
    } catch (err) {
      const status = err?.response?.status || err?.status;
      setError(
        status === 429 || /429|too many/i.test(err?.message || "")
          ? "You've sent several messages in a short time. Please wait a few minutes and try again, or email info@bellatrixinc.com."
          : err?.message && !/^(Request failed|Network Error|Failed to fetch)/i.test(err.message)
          ? err.message
          : "We couldn't send your message. Please check your connection and try again."
      );
      if (typeof onError === "function") onError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "cf-input w-full px-3.5 py-2.5 rounded-md text-[15px] transition-[border-color,box-shadow,background-color] duration-200";
  const selectClasses = "cf-input w-full px-3.5 py-2.5 rounded-md text-[15px] transition-[border-color,box-shadow,background-color] duration-200 cursor-pointer";
  const labelClasses = "cf-label text-sm font-medium mb-1.5 block";
  const invalidClasses = " cf-invalid";
  const errorText = (name) =>
    fieldError(name) ? (
      <p id={`${fid(name)}-error`} className="mt-1.5 text-sm cf-error">
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
        <div className="mx-auto w-14 h-14 rounded-full cf-success-badge border flex items-center justify-center">
          <svg aria-hidden="true" className="w-7 h-7 cf-success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="mt-4 text-xl font-bold cf-title">Thanks — your message is on its way</h3>
        <p className="mt-2 cf-muted">A Bellatrix consultant will reply within 24 hours on business days.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {typeof onDone === "function" && (
            <button type="button" onClick={onDone} className="px-6 py-2.5 rounded-md font-semibold cf-submit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb4ff]" style={{ minHeight: 44 }}>
              Done
            </button>
          )}
          <button type="button" onClick={() => setSuccess(false)} className="px-6 py-2.5 rounded-md font-semibold cf-secondary-btn border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb4ff]" style={{ minHeight: 44 }}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form ref={formRef} className="space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Honeypot: hidden from people and screen readers; bots tend to fill every field */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor={fid("website")}>Leave this field empty</label>
          <input
            id={fid("website")}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </div>
        {/* Messages */}
        {error && (
          <div role="alert" className="cf-error-box border rounded-xl p-4 text-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div className="group">
            <label htmlFor={fid("fullName")} className={labelClasses}>
              <span className="flex items-center gap-1">Full name
              </span>
            </label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} {...a11y("fullName")} className={inputClasses + (fieldError("fullName") ? invalidClasses : "")} placeholder="Enter your full name" required aria-required="true" autoComplete="name" />
            {errorText("fullName")}
          </div>
          <div className="group">
            <label htmlFor={fid("email")} className={labelClasses}>
              <span className="flex items-center gap-1">Work email
              </span>
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} {...a11y("email")} className={inputClasses + (fieldError("email") ? invalidClasses : "")} placeholder="name@company.com" required aria-required="true" inputMode="email" autoComplete="email" />
            {errorText("email")}
          </div>
        </div>

        {/* Row 2: Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div className="group">
            <label htmlFor={fid("phone")} className={labelClasses}>
              <span className="flex items-center gap-1">Phone <span className="cf-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input type="tel" name="phone" id={fid("phone")} value={formData.phone} onChange={handleInputChange} className={inputClasses} placeholder="+971 50 123 4567" inputMode="tel" autoComplete="tel" />
          </div>
          <div className="group">
            <label htmlFor={fid("companyName")} className={labelClasses}>
              <span className="flex items-center gap-1">Company <span className="cf-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input type="text" name="companyName" id={fid("companyName")} value={formData.companyName} onChange={handleInputChange} className={inputClasses} placeholder="Company name" autoComplete="organization" />
          </div>
        </div>

        {/* Row 3: Industry & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div className="group">
            <label htmlFor={fid("industry")} className={labelClasses}>
              <span className="flex items-center gap-1">Industry
              </span>
            </label>
            <select name="industry" value={formData.industry} onChange={handleInputChange} {...a11y("industry")} onBlur={() => formData.industry && setTouched((p) => ({ ...p, industry: true }))} className={selectClasses + (fieldError("industry") ? invalidClasses : "")} required aria-required="true"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px', appearance: 'none', paddingRight: '28px' }}>
              <option value="" className="cf-option">Select...</option>
              <option value="Manufacturing" className="cf-option">Manufacturing</option>
              <option value="Retail & E-commerce" className="cf-option">Retail & E-commerce</option>
              <option value="Healthcare" className="cf-option">Healthcare</option>
              <option value="Finance & Banking" className="cf-option">Finance & Banking</option>
              <option value="Technology" className="cf-option">Technology</option>
              <option value="Professional Services" className="cf-option">Professional Services</option>
              <option value="Other" className="cf-option">Other</option>
            </select>
            {errorText("industry")}
          </div>
          <div className="group">
            <label htmlFor={fid("country")} className={labelClasses}>
              <span className="flex items-center gap-1">Country
              </span>
            </label>
            <select name="country" value={formData.country} onChange={handleInputChange} {...a11y("country")} onBlur={() => formData.country && setTouched((p) => ({ ...p, country: true }))} className={selectClasses + (fieldError("country") ? invalidClasses : "")} required aria-required="true" autoComplete="country-name"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px', appearance: 'none', paddingRight: '28px' }}>
              <option value="" className="cf-option">Select...</option>
              <option value="United States" className="cf-option">United States</option>
              <option value="United Kingdom" className="cf-option">United Kingdom</option>
              <option value="Canada" className="cf-option">Canada</option>
              <option value="UAE" className="cf-option">UAE</option>
              <option value="Saudi Arabia" className="cf-option">Saudi Arabia</option>
              <option value="Egypt" className="cf-option">Egypt</option>
              <option value="Germany" className="cf-option">Germany</option>
              <option value="Other" className="cf-option">Other</option>
            </select>
            {errorText("country")}
          </div>
        </div>

        {/* Message */}
        <div className="group">
          <label htmlFor={fid("message")} className={labelClasses}>
            <span className="flex items-center gap-1">How can we help?
            </span>
          </label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            {...a11y("message", fid("message-hint"))}
            className={`${inputClasses} resize-none${fieldError("message") ? invalidClasses : ""}`}
            placeholder="For example: we run three warehouses on spreadsheets and want inventory and invoicing in NetSuite."
            maxLength={500}
            required
            aria-required="true"
          />
          {errorText("message")}
          <div className="flex justify-between gap-3 mt-1">
            <span id={fid("message-hint")} className="text-xs cf-muted">At least {MIN_MESSAGE} characters.</span>
            <span aria-hidden="true" className={`text-xs ${formData.message.length > 450 ? 'cf-warn' : 'cf-muted'}`}>
              {formData.message.length}/500
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t cf-divider">
          <div className="cf-muted text-sm space-y-1">
            <p>
              Prefer email? <a href="mailto:info@bellatrixinc.com" className="cf-link">info@bellatrixinc.com</a>
            </p>
            <p className="text-xs">
              We use your details only to reply. See our <a href="/privacy" target="_blank" rel="noopener" className="cf-link">Privacy Policy</a>.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
            className={`w-full sm:w-auto justify-center px-7 py-3 rounded-md font-semibold text-[15px] transition-colors duration-150 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cb4ff]
              ${submitting
                ? "cf-submit-busy cursor-wait"
                : "cf-submit active:scale-[0.98]"
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
                Send message
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
