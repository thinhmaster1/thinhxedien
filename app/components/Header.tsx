import Link from "next/link";

export function Header({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`site-header ${dark ? "site-header--dark" : ""}`}>
      <Link className="brand" href="/" aria-label="VinFast Explorer - Trang chủ">
        <span className="brand-mark">V</span>
        <span>VINFAST <b>EXPLORER</b></span>
      </Link>
      <nav aria-label="Điều hướng chính">
        <Link href="/">Dòng xe</Link>
        <Link href="/so-sanh">So sánh</Link>
        <a href="#nguon-du-lieu">Nguồn dữ liệu</a>
      </nav>
      <Link className="header-cta" href="/so-sanh">So sánh xe</Link>
    </header>
  );
}
