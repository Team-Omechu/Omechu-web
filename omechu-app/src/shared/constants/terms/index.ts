// Types
export type { TermsItem, TermsType, TermsConfig } from "./types";

// Config
export {
  TERMS_CONFIG,
  TERMS_MENU_LIST,
  isValidTermsType,
} from "./terms.config";

// Data (for direct access if needed)
export { termsForServiceMain } from "./data/service-main";
export { termsForServiceServe } from "./data/service-serve";
export { termsForPersonalInfo } from "./data/personalInfo";
export { termsForLocationInfo } from "./data/locationInfo";
