(() => {
  if (location.protocol !== "file:") return;

  const showNotice = () => {
    const notice = document.createElement("aside");
    notice.className = "file-protocol-notice";
    notice.setAttribute("role","alert");

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = "Trang cần chạy qua máy chủ local";
    const description = document.createElement("span");
    description.textContent = "Mở file trực tiếp sẽ không tải được dữ liệu xe và các công cụ tính toán.";
    copy.append(title,description);

    const link = document.createElement("a");
    const page = location.pathname.split("/").pop() || "index.html";
    link.href = new URL(`${encodeURIComponent(page)}${location.search}`,"http://127.0.0.1:3000/").href;
    link.textContent = "Mở qua localhost";
    notice.append(copy,link);
    document.body.prepend(notice);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",showNotice,{ once: true });
  else showNotice();
})();
