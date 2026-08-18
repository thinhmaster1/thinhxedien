const ACCESS_HASH = "f6bca1d9410f17cb033cce86877c077d28343888b1d105f26ebde9ff6ead3540";
const ACCESS_KEY = "thinh-xe-dien-private-tools-access";
const LEGACY_ACCESS_KEY = "thinh-xe-dien-quote-access";

const digest = async value => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

export const hasPrivateAccess = () => sessionStorage.getItem(ACCESS_KEY) === "granted" || sessionStorage.getItem(LEGACY_ACCESS_KEY) === "granted";
export const verifyPrivatePasscode = async value => await digest(value) === ACCESS_HASH;
export const grantPrivateAccess = () => sessionStorage.setItem(ACCESS_KEY, "granted");
