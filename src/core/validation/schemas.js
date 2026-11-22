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

/** Admin: page settings. */
export const pageSchema = {
  name: [r.required("Page name is required."), r.maxLength(120), r.noScript()],
  slug: [r.required("URL slug is required."), r.slug(), r.maxLength(80)],
  metaTitle: [r.maxLength(70, "Keep the SEO title under 70 characters so Google shows it in full.")],
  metaDescription: [r.maxLength(160, "Keep the SEO description under 160 characters.")],
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
