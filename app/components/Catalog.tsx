"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cars, display, money } from "../data";

const segments = ["Tất cả", "Mini EV", "Mini SUV", "A-SUV", "B-SUV", "C-SUV", "D-SUV", "E-SUV", "MPV", "Xe thương mại"];

export function Catalog() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("Tất cả");
  const [sort, setSort] = useState("featured");
  const [compare, setCompare] = useState<string[]>([]);

  const visible = useMemo(() => {
    const result = cars.filter((car) => (segment === "Tất cả" || car.segment === segment) && car.name.toLowerCase().includes(query.toLowerCase()));
    return [...result].sort((a, b) => sort === "price-up" ? (a.price ?? Infinity) - (b.price ?? Infinity) : sort === "range" ? parseInt(b.range || "0") - parseInt(a.range || "0") : 0);
  }, [query, segment, sort]);

  const toggleCompare = (slug: string) => setCompare((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : current);

  return (
    <>
      <section className="catalog" id="dong-xe">
        <div className="section-heading">
          <div><span className="eyebrow">DANH MỤC XE ĐIỆN</span><h2>Tìm chiếc xe dành cho bạn</h2></div>
          <p>Thông số và giá bán được tổng hợp từ tài liệu sản phẩm VinFast cập nhật tháng 07/2026.</p>
        </div>
        <div className="catalog-tools">
          <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên xe..." aria-label="Tìm theo tên xe" /></label>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sắp xếp xe">
            <option value="featured">Nổi bật</option><option value="price-up">Giá thấp đến cao</option><option value="range">Quãng đường xa nhất</option>
          </select>
        </div>
        <div className="segment-tabs" role="list" aria-label="Lọc phân khúc">
          {segments.map((item) => <button key={item} className={item === segment ? "active" : ""} onClick={() => setSegment(item)}>{item}</button>)}
        </div>
        <div className="car-grid">
          {visible.map((car) => (
            <article className="car-card" key={car.slug}>
              <Link className="car-image" href={`/xe/${car.slug}`}><img src={car.image} alt={`${car.name} - ảnh từ tài liệu sản phẩm`} /><span>{car.segment}</span></Link>
              <div className="car-content">
                <div className="car-title"><div><h3>{car.name}</h3><p>{car.tagline}</p></div><button className={`compare-check ${compare.includes(car.slug) ? "checked" : ""}`} onClick={() => toggleCompare(car.slug)} aria-label={`Thêm ${car.name} vào so sánh`}>{compare.includes(car.slug) ? "✓" : "+"}</button></div>
                <div className="car-price"><small>Giá từ</small><strong>{money(car.price)}</strong></div>
                <div className="mini-specs"><div><span>QUÃNG ĐƯỜNG</span><b>{display(car.range)}</b></div><div><span>CÔNG SUẤT</span><b>{display(car.power)}</b></div><div><span>SỐ CHỖ</span><b>{display(car.seats)}</b></div></div>
                <Link className="card-link" href={`/xe/${car.slug}`}>Khám phá chi tiết <span>→</span></Link>
              </div>
            </article>
          ))}
        </div>
        {!visible.length && <div className="empty-state">Không tìm thấy mẫu xe phù hợp. Hãy thử bộ lọc khác.</div>}
      </section>
      {compare.length > 0 && <div className="compare-dock"><span><b>{compare.length}/3</b> xe đã chọn</span><div className="compare-pills">{compare.map((slug) => { const car = cars.find((item) => item.slug === slug)!; return <button key={slug} onClick={() => toggleCompare(slug)}>{car.name} ×</button>; })}</div><Link href={`/so-sanh?xe=${compare.join(",")}`}>So sánh ngay →</Link></div>}
    </>
  );
}
