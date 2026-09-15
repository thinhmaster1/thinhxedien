(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem("thinh-theme-demo");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const applyTheme = (theme) => {
    root.dataset.demoTheme = theme;
    themeButton?.setAttribute(
      "aria-label",
      theme === "dark" ? "Chuyển chế độ sáng" : "Chuyển chế độ tối",
    );
    themeColor?.setAttribute("content", theme === "dark" ? "#07101f" : "#f4f7fb");
  };

  applyTheme(savedTheme || preferredTheme);

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.demoTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("thinh-theme-demo", nextTheme);
  });

  const tabs = [...document.querySelectorAll("[data-demo-tab]")];
  const loanSummary = document.querySelector("[data-loan-summary]");
  const totalLabel = document.querySelector("[data-total-label]");
  const totalValue = document.querySelector("[data-total-value]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const isLoan = tab.dataset.demoTab === "loan";
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      loanSummary?.toggleAttribute("hidden", !isLoan);
      if (totalLabel) totalLabel.textContent = isLoan ? "TỔNG CHI PHÍ LĂN BÁNH" : "TỔNG THANH TOÁN";
      if (totalValue) totalValue.textContent = "971.570.000 ₫";
    });
  });
})();
