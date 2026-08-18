const ACCESS_HASH = "f6bca1d9410f17cb033cce86877c077d28343888b1d105f26ebde9ff6ead3540";
const ACCESS_KEY = "thinh-xe-dien-private-tools-access";
const LEGACY_ACCESS_KEY = "thinh-xe-dien-quote-access";

const digest = async value => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

export function setupPrivateAccess({ gateId, formId, inputId, errorId }) {
  const gate = document.querySelector(`#${gateId}`);
  const form = document.querySelector(`#${formId}`);
  const input = document.querySelector(`#${inputId}`);
  const error = document.querySelector(`#${errorId}`);
  const unlock = () => {
    sessionStorage.setItem(ACCESS_KEY, "granted");
    document.body.classList.remove("quote-locked");
    gate.hidden = true;
  };

  if (sessionStorage.getItem(ACCESS_KEY) === "granted" || sessionStorage.getItem(LEGACY_ACCESS_KEY) === "granted") unlock();

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (await digest(input.value) === ACCESS_HASH) {
      unlock();
      return;
    }
    error.textContent = "Passcode chưa đúng. Vui lòng thử lại.";
    input.value = "";
    input.focus();
  });
}
