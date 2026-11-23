import { cachedFetch } from "../services/legacy/apiCache";
import { staticContent } from "../services/StaticContentRepository";

const TEN_MINUTES = 10 * 60 * 1000;

/**
 * Shared cached loader for /data/Implementation.json.
 * All Implementation page components call this instead of fetching individually,
 * so only one network request fires regardless of how many components mount.
 */
export function loadImplementationData() {
  return cachedFetch(
    "public:data:Implementation.json",
    () => staticContent.load("Implementation"),
    TEN_MINUTES
  );
}
