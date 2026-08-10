import { Catalog } from "./components/Catalog";
import { Header } from "./components/Header";
import { cars } from "./data";

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <Header dark />
        <div className="hero-media"><img src="/cars/vf7.jpg" alt="VinFast VF 7" /></div>
        <div className="hero-shade" />
        <div className="hero-copy"><span className="eyebrow light">DỮ LIỆU XE ĐIỆN VINFAST 2026</span><h1>Chọn xe bằng<br/><em>dữ liệu thật.</em></h1><p>Khám phá, đối chiếu và tìm ra mẫu xe phù hợp nhất với nhu cầu của bạn.</p><div className="hero-actions"><a className="primary-btn" href="#dong-xe">Khám phá {cars.length} mẫu xe</a><a className="text-btn" href="/so-sanh">So sánh ngay <span>↗</span></a></div></div>
        <div className="hero-stats"><div><b>{cars.length}</b><span>Mẫu xe</span></div><div><b>28</b><span>Tiêu chí</span></div><div><b>07.2026</b><span>Cập nhật</span></div></div>
      </section>
      <Catalog />
      <section className="insight-strip"><div><span className="eyebrow">CHỌN NHANH THEO NHU CẦU</span><h2>Mỗi hành trình,<br/>một lựa chọn phù hợp.</h2></div><div className="insight-cards"><a href="/?nhu-cau=do-thi"><span>01</span><b>Đi phố linh hoạt</b><small>Minio Green · VF 2 · VF 3</small></a><a href="/?nhu-cau=gia-dinh"><span>02</span><b>Gia đình đa dụng</b><small>VF 5 · VF 6 · VF 7 · MPV 7</small></a><a href="/?nhu-cau=cao-cap"><span>03</span><b>Trải nghiệm cao cấp</b><small>VF 8 · VF 9</small></a><a href="/?nhu-cau=dich-vu"><span>04</span><b>Kinh doanh hiệu quả</b><small>Herio · Limo · EC Van</small></a></div></section>
      <footer id="nguon-du-lieu"><div className="brand"><span className="brand-mark">V</span><span>VINFAST <b>EXPLORER</b></span></div><p>Dữ liệu được tổng hợp từ bảng thông số sản phẩm và chính sách giá VinFast tại thị trường Việt Nam, cập nhật tháng 07/2026.</p><span>Trang tham khảo độc lập · Không phải website bán hàng chính thức</span></footer>
    </main>
  );
}
