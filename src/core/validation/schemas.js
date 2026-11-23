import { rules as r } from "./Validator";

/** Contact / consultation form (public). Limits keep spam and abuse out. */
export const contactMessageSchema = {
  fullName: [r.required("Please enter your name."), r.maxLength(100), r.noScript()],
  email: [r.required("Please enter your email address."), r.email(), r.maxLength(150)],
  phone: [r.phone(), r.maxLength(30)],
  companyName: [r.maxLength(120), r.noScript()],
  industry: [r.required("Please choose your industry.")],
  country: [r.required("Please choose your country.")],
  message: [
    r.required("Please tell us a little about your project."),
    r.minLength(10, "Please write at least 10 characters."),
    r.maxLength(5000, "Please keep your message under 5,000 characters."),
    r.maxLinks(3),
    r.noScript(),
  ],
};

/** Admin: page settings (blocking rules). */
export const pageSchema = {
  name: [r.required("Page name is required."), r.minLength(2, "Page name must be at least 2 characters."), r.maxLength(100), r.noScript()],
  slug: [r.slug(), r.maxLength(200)],
  metaTitle: [r.maxLength(200, "The SEO title is far too long."), r.noScript()],
  metaDescription: [r.maxLength(500, "The SEO description is far too long."), r.noScript()],
};

/** Admin: page settings (advice only — saved anyway, shown as a hint). */
export const pageSeoHints = {
  metaTitle: [r.maxLength(60, "Tip: SEO titles over ~60 characters are cut off in Google results.")],
  metaDescription: [r.maxLength(160, "Tip: SEO descriptions over ~160 characters are cut off in Google results.")],
};

/** Admin: navigation category. */
export const categorySchema = {
  name: [r.required("Category name is required."), r.maxLength(80), r.noScript()],
  description: [r.maxLength(300)],
  sortOrder: [r.integer(), r.range(0, 9999)],
};

/** Admin: media details. */
export const mediaDetailsSchema = {
  alternateText: [r.maxLength(250, "Keep alt text under 250 characters."), r.noScript()],
  caption: [r.maxLength(500), r.noScript()],
};

/** Admin: page section saved through the editor. */
export const componentSchema = {
  componentType: [r.required("Section type is missing.")],
  contentJson: [
    r.required("Section content is missing."),
    r.custom((v) => {
      if (typeof v !== "string") return null;
      try {
        JSON.parse(v);
        return null;
      } catch {
        return "Section content isn't valid JSON.";
      }
    }),
    r.maxLength(500000, "This section is too large to save."),
  ],
};

/** Admin: login. */
export const loginSchema = {
  email: [r.required("Enter your email or username.")],
  password: [r.required("Enter your password.")],
};

/** Admin: change password. */
export const passwordChangeSchema = {
  currentPassword: [r.required("Enter your current password.")],
  newPassword: [
    r.required("Enter a new password."),
    r.minLength(10, "Use at least 10 characters."),
    r.pattern(/[a-z]/, "Add at least one lowercase letter."),
    r.pattern(/[A-Z]/, "Add at least one uppercase letter."),
    r.pattern(/\d/, "Add at least one number."),
    r.pattern(/[^A-Za-z0-9]/, "Add at least one symbol (e.g. ! @ # %)."),
    r.custom((v, data) => (v && v === data.currentPassword ? "The new password must be different from the current one." : null)),
  ],
  confirmPassword: [
    r.required("Confirm the new password."),
    r.custom((v, data) => (v !== data.newPassword ? "The passwords don't match." : null)),
  ],
};

/** Admin: one footer quick link. */
export const quickLinkSchema = {
  name: [r.required("Link text is required."), r.maxLength(60), r.noScript()],
  url: [r.required("Link address is required."), r.url()],
};

/** Admin: company / footer settings (only validates the fields present). */
export const companySettingsSchema = {
  companyName: [r.maxLength(100), r.noScript()],
  contactEmail: [r.email()],
  linkedin: [r.url()],
  instagram: [r.url()],
  facebook: [r.url()],
  twitter: [r.url()],
  youtube: [r.url()],
};

/** Admin: generic setting key/value. */
export const settingSchema = {
  key: [
    r.required("Setting key is required."),
    r.pattern(/^[a-zA-Z][a-zA-Z0-9_.-]*$/, "Use letters, numbers, _ . - only, starting with a letter."),
    r.maxLength(100),
  ],
  value: [r.maxLength(20000, "This value is too long.")],
};
