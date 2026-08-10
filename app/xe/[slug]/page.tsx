import Link from "next/link";
import { Header } from "../../components/Header";
import { cars, display, money, specGroups } from "../../data";

export default async function CarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((item) => item.slug === slug) || cars[0];
  const related = cars.filter((item) => item.slug !== car.slug && (item.segment === car.segment || item.use === car.use)).slice(0, 3);
  return <main className="detail-page">
    <Header dark />
    <section className="detail-hero"><img src={car.image} alt={car.name}/><div className="detail-overlay"/><div className="breadcrumb"><Link href="/">Dòng xe</Link><span>/</span><b>{car.name}</b></div><div className="detail-title"><span className="eyebrow light">{car.segment} · {car.use}</span><h1>{car.name}</h1><p>{car.tagline}</p><div><Link className="primary-btn" href={`/so-sanh?xe=${car.slug}`}>Thêm vào so sánh</Link><a className="text-btn" href="#thong-so">Xem thông số ↓</a></div></div></section>
    <section className="key-facts"><div><span>GIÁ TỪ</span><b>{money(car.price)}</b></div><div><span>QUÃNG ĐƯỜNG</span><b>{display(car.range)}</b></div><div><span>CÔNG SUẤT</span><b>{display(car.power)}</b></div><div><span>DUNG LƯỢNG PIN</span><b>{display(car.battery)}</b></div></section>
    <section className="detail-intro"><div><span className="eyebrow">TỔNG QUAN</span><h2>Hiểu chiếc xe<br/>qua từng con số.</h2></div><p>Thông số được giữ nguyên theo tài liệu nguồn và tách theo từng nhóm để bạn dễ theo dõi. Giá trị có dấu “/” thể hiện khác biệt giữa các phiên bản.</p></section>
    <section className="spec-sheet" id="thong-so">{specGroups.map((group, index) => <div className="spec-group" key={group.title}><div className="spec-group-title"><span>0{index + 1}</span><h2>{group.title}</h2></div><div className="spec-list">{group.items.map(([label,key]) => <div key={key}><span>{label}</span><b className={!car[key] ? "updating" : ""}>{display(car[key] as string | null)}</b></div>)}</div></div>)}</section>
    <section className="versions"><div><span className="eyebrow">GIÁ BÁN THAM KHẢO</span><h2>Phiên bản & giá đề xuất</h2><p>Đơn vị VNĐ, đã bao gồm VAT và pin. Áp dụng theo chính sách giá từ ngày 05/07/2026.</p></div><div className="version-list">{car.versions.map((version,index) => <div key={version.name}><span>0{index + 1}</span><b>{version.name}</b><strong>{money(version.price)}</strong></div>)}</div></section>
    <section className="colors"><div><span className="eyebrow">MÀU NGOẠI THẤT</span><h2>Bảng màu được công bố</h2></div><div className="color-list">{car.colors.map((color) => <span key={color}><i/>{color}</span>)}</div></section>
    {!!related.length && <section className="related"><span className="eyebrow">CÓ THỂ BẠN QUAN TÂM</span><h2>Những lựa chọn tương đồng</h2><div>{related.map((item) => <Link href={`/xe/${item.slug}`} key={item.slug}><img src={item.image} alt={item.name}/><span>{item.segment}</span><b>{item.name}</b><small>{money(item.price)}</small></Link>)}</div></section>}
    <footer><Link href="/">← Quay lại danh sách xe</Link><span>Dữ liệu cập nhật 07.2026</span></footer>
  </main>;
}
