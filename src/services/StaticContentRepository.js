/**
 * Default section content shipped in /public/data/*.json.
 *
 * Several sections on one page used to fetch the same file separately (the HR
 * page loaded hr.json three times). This repository loads each file once per
 * browser session and shares the promise. Failures reject (so each section's
 * own fallback still runs) and are not cached, so a later call retries.
 */
export class StaticContentRepository {
  constructor({ basePath = "/data", fetchImpl } = {}) {
    this.basePath = basePath;
    this.fetchImpl = fetchImpl || ((...a) => fetch(...a));
    this.cache = new Map();
  }

  /** @param {string} name file name with or without ".json" (e.g. "hr", "payroll.json") */
  load(name) {
    const file = name.endsWith(".json") ? name : `${name}.json`;
    if (!this.cache.has(file)) {
      const promise = this.fetchImpl(`${this.basePath}/${file}`).then((res) => {
        if (!res.ok) throw new Error(`Could not load ${file} (${res.status})`);
        return res.json();
      });
      promise.catch(() => this.cache.delete(file));
      this.cache.set(file, promise);
    }
    return this.cache.get(file);
  }
}

export const staticContent = new StaticContentRepository();
export default staticContent;
