export const UPDATING = "Dữ liệu đang cập nhật";

export const specGroups = [
  { title: "Kích thước & không gian", items: [["Kích thước", "dimensions"], ["Chiều dài cơ sở", "wheelbase"], ["Khoảng sáng gầm", "clearance"], ["Khoang hành lý", "trunk"], ["Số chỗ", "seats"]] },
  { title: "Pin & vận hành", items: [["Quãng đường", "range"], ["Dung lượng pin", "battery"], ["Công suất", "power"], ["Mô-men xoắn", "torque"], ["Tốc độ tối đa", "topSpeed"], ["Chế độ lái", "driveModes"], ["Hệ dẫn động", "drivetrain"], ["Phanh tái sinh", "regenerativeBraking"], ["Sạc nhanh DC", "dcCharge"], ["Sạc AC tối đa", "acCharge"]] },
  { title: "Phiên bản & trang bị", items: [["Loại pin theo phiên bản", "batteryType"], ["Bộ sạc tại nhà tương thích", "homeCharger"], ["Lốp theo phiên bản", "tireType"], ["Tùy chọn trả phí", "paidOptions"], ["Trang bị theo phiên bản", "versionEquipment"], ["Phụ kiện lắp thêm (AFS)", "optionalEquipment"]] },
  { title: "Khung gầm & ngoại thất", items: [["Hệ thống phanh", "brakes"], ["Phanh đỗ xe", "parkingBrake"], ["Mâm", "wheels"], ["Hệ thống treo", "suspension"], ["Đèn", "lights"], ["Gương & ngoại thất", "exteriorFeatures"]] },
  { title: "Nội thất & tiện nghi", items: [["Chất liệu ghế", "upholstery"], ["Ghế & vô-lăng", "seatFeatures"], ["Điều hòa & lọc khí", "climate"], ["Màn hình", "screen"], ["Âm thanh", "speakers"], ["Kết nối", "connectivity"], ["Tiện nghi khác", "convenience"]] },
  { title: "An toàn & hỗ trợ lái", items: [["Túi khí", "airbags"], ["An toàn chủ động", "safetySystems"], ["Hỗ trợ đỗ xe", "parkingSupport"], ["ADAS", "adas"]] }
];

export const categories = {
  city: { eyebrow: "NHỎ GỌN. LINH HOẠT.", title: "Xe đô thị", description: "Dễ dàng xoay xở trong phố, tối ưu cho những hành trình mỗi ngày." },
  family: { eyebrow: "RỘNG RÃI. ĐA DỤNG.", title: "SUV gia đình", description: "Không gian thoải mái và hiệu suất cân bằng cho mọi thành viên." },
  premium: { eyebrow: "TINH TẾ. MẠNH MẼ.", title: "SUV cao cấp", description: "Công nghệ, hiệu năng và sự thoải mái trên những hành trình dài." },
  service: { eyebrow: "THỰC DỤNG. HIỆU QUẢ.", title: "MPV & xe dịch vụ", description: "Tối ưu không gian và chi phí vận hành cho gia đình lẫn kinh doanh." },
  commercial: { eyebrow: "GỌN NHẸ. BỀN BỈ.", title: "Xe thương mại", description: "Giải pháp vận tải điện cho công việc trong đô thị." }
};

export const formatNumber = input => new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(Number(input));
export const money = input => input == null ? UPDATING : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.ceil(Number(input)))} ₫`;
export const moneyInputValue = input => Math.max(0, Number(String(input ?? "").replace(/[^\d]/g, "")) || 0);
export const formatMoneyInput = input => {
  const value = moneyInputValue(input.value);
  input.value = value ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value) : "";
};
export const display = input => input || UPDATING;
export const esc = input => String(input ?? "").replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char]));
export const param = name => new URLSearchParams(location.search).get(name);

export async function loadCars() {
  const response = await fetch("data/cars.json");
  if (!response.ok) throw new Error("Không thể tải dữ liệu xe");
  return (await response.json()).cars;
}

export function fail(error) {
  document.querySelector("main").innerHTML = `<div class="error-state"><b>Không thể hiển thị nội dung</b><p>${esc(error.message)}</p></div>`;
}
