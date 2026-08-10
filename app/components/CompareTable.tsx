"use client";

import { useMemo, useState } from "react";
import { cars, display, money, specGroups, type Car } from "../data";

export function CompareTable({ initial = [] }: { initial?: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial.length ? initial.slice(0, 3) : ["vf-6", "vf-7", "vf-8"]);
  const [differences, setDifferences] = useState(false);
  const chosen = useMemo(() => selected.map((slug) => cars.find((car) => car.slug === slug)).filter(Boolean) as Car[], [selected]);
  const update = (index: number, slug: string) => setSelected((current) => current.map((value, idx) => idx === index ? slug : value));
  const add = () => { const next = cars.find((car) => !selected.includes(car.slug)); if (next && selected.length < 3) setSelected([...selected, next.slug]); };

  return (
    <div className="compare-page">
      <div className="compare-hero"><span className="eyebrow">SO SÁNH THÔNG MINH</span><h1>Đặt các lựa chọn<br/>lên cùng một bàn cân.</h1><p>So sánh tối đa 3 mẫu xe dựa trên dữ liệu sản phẩm chính thức.</p></div>
      <div className="compare-selector">
        {chosen.map((car, index) => <div className="compare-select-card" key={`${index}-${car.slug}`}><img src={car.image} alt={car.name}/><select value={car.slug} onChange={(event) => update(index, event.target.value)}>{cars.map((item) => <option key={item.slug} value={item.slug} disabled={selected.includes(item.slug) && item.slug !== car.slug}>{item.name}</option>)}</select><strong>{money(car.price)}</strong></div>)}
        {selected.length < 3 && <button className="add-car" onClick={add}><b>+</b><span>Thêm xe</span></button>}
      </div>
      <div className="compare-toolbar"><div><b>So sánh chi tiết</b><span>{chosen.length} mẫu xe</span></div><label><input type="checkbox" checked={differences} onChange={(event) => setDifferences(event.target.checked)}/> Chỉ hiển thị điểm khác biệt</label></div>
      <div className="compare-table-wrap">
        {specGroups.map((group) => {
          const rows = group.items.filter(([, key]) => !differences || new Set(chosen.map((car) => display(car[key] as string | null))).size > 1);
          if (!rows.length) return null;
          return <section className="compare-group" key={group.title}><h2>{group.title}</h2>{rows.map(([label, key]) => <div className="compare-row" key={key}><span>{label}</span>{chosen.map((car) => <b key={car.slug} className={!car[key] ? "updating" : ""}>{display(car[key] as string | null)}</b>)}</div>)}</section>;
        })}
      </div>
      <p className="data-note">Thông số có thể khác nhau theo phiên bản. Các mục chưa xuất hiện trong tài liệu nguồn được ghi là “Dữ liệu đang cập nhật”.</p>
    </div>
  );
}
