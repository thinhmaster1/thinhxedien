export type Car = {
  slug: string;
  name: string;
  segment: string;
  use: string;
  price: number | null;
  priceLabel?: string;
  image: string;
  tagline: string;
  seats: string | null;
  range: string | null;
  power: string | null;
  torque: string | null;
  battery: string | null;
  dimensions: string | null;
  wheelbase: string | null;
  clearance: string | null;
  trunk: string | null;
  topSpeed: string | null;
  driveModes: string | null;
  dcCharge: string | null;
  brakes: string | null;
  wheels: string | null;
  suspension: string | null;
  lights: string | null;
  screen: string | null;
  speakers: string | null;
  airbags: string | null;
  versions: { name: string; price: number | null }[];
  colors: string[];
};

export const updating = "Dữ liệu đang cập nhật";

export const cars: Car[] = [
  {
    slug: "minio-green", name: "Minio Green", segment: "Mini EV", use: "Đô thị", price: 269000000,
    image: "/cars/minio-green.jpg", tagline: "Nhỏ gọn, linh hoạt cho mọi hành trình trong phố.", seats: "4 chỗ", range: "210 km", power: "40 HP", torque: "65 Nm", battery: "18,3 kWh", dimensions: "3.090 × 1.496 × 1.664 mm", wheelbase: "2.065 mm", clearance: "165 mm", trunk: null, topSpeed: null, driveModes: "Eco / Normal", dcCharge: "24 kW", brakes: "Đĩa / Tang trống", wheels: "Mâm thép 13 inch", suspension: "MacPherson / MacPherson", lights: "LED / Halogen", screen: "7 inch", speakers: "2", airbags: "1", versions: [{name:"Tiêu chuẩn",price:269000000}], colors:["Trắng","Đen","Đỏ","Bạc","Hồng","Xanh lá"]
  },
  {
    slug: "vf-2", name: "VF 2", segment: "Mini SUV", use: "Đô thị", price: 188000000,
    image: "/cars/vf2.jpg", tagline: "Mẫu xe điện dễ tiếp cận cho nhịp sống trẻ.", seats: "4 chỗ", range: null, power: null, torque: null, battery: null, dimensions: null, wheelbase: null, clearance: null, trunk: null, topSpeed: null, driveModes: null, dcCharge: null, brakes: null, wheels: null, suspension: null, lights: null, screen: null, speakers: null, airbags: null, versions: [{name:"Tiêu chuẩn 3",price:188000000}], colors:["Dữ liệu đang cập nhật"]
  },
  {
    slug: "vf-3", name: "VF 3", segment: "Mini SUV", use: "Đô thị", price: 285000000,
    image: "/cars/vf3.jpg", tagline: "Cá tính, gọn gàng và sẵn sàng khám phá thành phố.", seats: "4 chỗ", range: "216 km", power: null, torque: "110 Nm", battery: "18,64 kWh", dimensions: "3.190 × 1.679 × 1.652 mm", wheelbase: "2.075 mm", clearance: "175 mm", trunk: "36 / 285 lít", topSpeed: null, driveModes: null, dcCharge: null, brakes: null, wheels: "Mâm thép 16 inch", suspension: "MacPherson / Thanh xoắn", lights: "Halogen / Halogen", screen: "10 inch", speakers: null, airbags: null, versions: [{name:"Eco",price:285000000},{name:"Plus",price:296000000}], colors:["Trắng","Xám","Đỏ Solar Ruby","Xanh lá nhạt","Hồng + nóc trắng"]
  },
  {
    slug: "herio-green", name: "Herio Green", segment: "Crossover", use: "Dịch vụ", price: 450000000,
    image: "/cars/vf5.jpg", tagline: "Tối ưu vận hành cho kinh doanh dịch vụ xanh.", seats: "5 chỗ", range: "326 km", power: "134 HP", torque: "135 Nm", battery: "37,23 kWh", dimensions: "3.967 × 1.723 × 1.579 mm", wheelbase: "2.514 mm", clearance: "160 mm", trunk: "260 / 900 lít", topSpeed: "130 km/h", driveModes: "Eco / Sport", dcCharge: "50 kW", brakes: "Đĩa thông gió / Đĩa", wheels: "Mâm thép 16 inch", suspension: "MacPherson / Thanh xoắn", lights: "Halogen / Halogen", screen: "10 inch", speakers: "2", airbags: "1", versions: [{name:"Tiêu chuẩn 2",price:450000000},{name:"Tiêu chuẩn 1",price:469000000}], colors:["Trắng","Đen","Xám"]
  },
  {
    slug: "vf-5", name: "VF 5", segment: "A-SUV", use: "Gia đình", price: 496000000,
    image: "/cars/vf5.jpg", tagline: "SUV điện năng động cho gia đình trẻ.", seats: "5 chỗ", range: null, power: null, torque: null, battery: null, dimensions: null, wheelbase: null, clearance: null, trunk: null, topSpeed: null, driveModes: null, dcCharge: null, brakes: null, wheels: "17 inch", suspension: null, lights: null, screen: "7 / 8 inch", speakers: "4", airbags: "6", versions: [{name:"Plus",price:496000000}], colors:["Trắng","Đen","Xám","Đỏ Solar Ruby","Xanh lá nhạt"]
  },
  {
    slug: "vf-6", name: "VF 6", segment: "B-SUV", use: "Gia đình", price: 646000000,
    image: "/cars/vf6.jpg", tagline: "Cân bằng giữa thiết kế, tiện nghi và hiệu suất.", seats: "5 chỗ", range: "460 - 485 km", power: "174 / 201 HP", torque: "250 / 310 Nm", battery: "59,6 kWh", dimensions: "4.241 × 1.834 × 1.580 mm", wheelbase: "2.730 mm", clearance: "170 mm", trunk: "423 / 1.576 lít", topSpeed: "150 / 175 km/h", driveModes: "Eco / Normal / Sport", dcCharge: null, brakes: "Đĩa / Đĩa", wheels: "17 / 18 inch", suspension: "MacPherson / Đa điểm", lights: "LED", screen: "12,9 inch", speakers: "6", airbags: "4 / 7", versions: [{name:"Eco",price:646000000},{name:"Plus",price:699000000}], colors:["Trắng","Đen","Xám","Đỏ Crimson Red","Đỏ Solar Ruby","Xanh lá nhạt"]
  },
  {
    slug: "vf-7", name: "VF 7", segment: "C-SUV", use: "Gia đình", price: 740000000,
    image: "/cars/vf7.jpg", tagline: "Thiết kế táo bạo, sức mạnh dành cho người dẫn đầu.", seats: "5 chỗ", range: "440 - 504 km", power: "174 / 201 HP", torque: "250 / 310 Nm", battery: "59,6 / 75,3 kWh", dimensions: "4.545 × 1.890 × 1.635 mm", wheelbase: "2.840 mm", clearance: "190 mm", trunk: "537 / 1.576 lít", topSpeed: "150 / 175 km/h", driveModes: "Eco / Normal / Sport", dcCharge: null, brakes: "Đĩa / Đĩa", wheels: "19 / 20 inch", suspension: "MacPherson / Đa điểm", lights: "LED", screen: "12,9 inch", speakers: "6 / 8", airbags: "4 / 7", versions: [{name:"Eco",price:740000000},{name:"Plus - trần thép",price:830000000},{name:"Plus - trần kính",price:850000000}], colors:["Trắng","Đen","Xám","Đỏ Solar Ruby","Xanh lá nhạt"]
  },
  {
    slug: "vf-8", name: "VF 8", segment: "D-SUV", use: "Cao cấp", price: 898000000,
    image: "/cars/vf8.jpg", tagline: "SUV điện cao cấp với hiệu năng mạnh mẽ.", seats: "5 chỗ", range: "457 - 562 km", power: "201 / 402 HP", torque: "310 / 620 Nm", battery: "87,7 kWh", dimensions: "4.750 × 1.934 × 1.667 mm", wheelbase: "2.950 mm", clearance: "157 / 162 mm", trunk: "376 / 1.373 lít", topSpeed: "171 / 200 km/h", driveModes: "Eco / Normal / Sport", dcCharge: "149 kW", brakes: "Đĩa thông gió / Đĩa thông gió", wheels: "19 / 20 inch", suspension: "MacPherson / Đa điểm", lights: "LED", screen: "15,6 inch", speakers: "8 / 11", airbags: "10 / 11", versions: [{name:"Eco",price:898000000},{name:"Plus",price:1079000000}], colors:["Trắng","Đen","Đỏ Crimson Red"]
  },
  {
    slug: "vf-8-moi", name: "VF 8 Thế hệ mới", segment: "D-SUV", use: "Cao cấp", price: 899000000,
    image: "/cars/vf8.jpg", tagline: "Trải nghiệm lái tinh chỉnh cho thế hệ mới.", seats: "5 chỗ", range: "480 - 500 km", power: "228 HP", torque: "330 Nm", battery: "60,13 kWh", dimensions: "4.701 × 1.872 × 1.670 mm", wheelbase: "2.840 mm", clearance: "170 mm", trunk: ">600 / 1.600 lít", topSpeed: "160 km/h", driveModes: "Eco / Normal / Sport", dcCharge: null, brakes: "Đĩa thông gió / Đĩa", wheels: "19 inch", suspension: "MacPherson / Đa điểm thích ứng FSD", lights: "LED", screen: "12,9 inch", speakers: "8", airbags: null, versions: [{name:"Tiêu chuẩn 3",price:899000000}], colors:["Trắng","Đen","Xám","Đỏ Solar Ruby","Xanh dương"]
  },
  {
    slug: "vf-9", name: "VF 9", segment: "E-SUV", use: "Cao cấp", price: 1348000000,
    image: "/cars/vf9.jpg", tagline: "SUV điện cỡ lớn cho hành trình đẳng cấp.", seats: "6 / 7 chỗ", range: "602 - 626 km", power: "402 HP", torque: "620 Nm", battery: "123 kWh", dimensions: "5.119 × 2.004 × 1.691 mm", wheelbase: "3.149 mm", clearance: "174 / 184 mm", trunk: "212 / 926 lít", topSpeed: "200 km/h", driveModes: "Eco / Normal / Sport", dcCharge: null, brakes: "Đĩa thông gió / Đĩa thông gió", wheels: "20 / 21 inch", suspension: "MacPherson / Đa điểm khí nén", lights: "LED matrix", screen: "15,6 inch", speakers: "11 / 13", airbags: "11", versions: [{name:"Eco",price:1348000000},{name:"Plus - trần thép",price:1529000000}], colors:["Trắng","Đen","Xám","Đỏ Crimson Red","Bạc","Xanh lá đậm"]
  },
  {
    slug: "limo-green", name: "Limo Green", segment: "MPV", use: "Dịch vụ", price: 699000000,
    image: "/cars/limo-green.jpg", tagline: "Không gian rộng rãi, tối ưu cho dịch vụ chuyên nghiệp.", seats: "7 chỗ", range: "450 km", power: "201 HP", torque: "280 Nm", battery: "60,13 kWh", dimensions: "4.740 × 1.872 × 1.729 mm", wheelbase: "2.840 mm", clearance: "180 mm", trunk: "102 / 606 / 1.240 lít", topSpeed: "140 km/h", driveModes: "Eco / Normal", dcCharge: "80 kW", brakes: "Đĩa thông gió / Đĩa", wheels: "18 inch", suspension: "MacPherson / Đa điểm", lights: "LED", screen: "10,1 inch", speakers: "4", airbags: "4", versions: [{name:"Tiêu chuẩn",price:699000000}], colors:["Trắng","Đen"]
  },
  {
    slug: "mpv-7", name: "VF MPV 7", segment: "MPV", use: "Gia đình", price: 750000000,
    image: "/cars/mpv7.jpg", tagline: "MPV điện đa dụng cho cả gia đình và công việc.", seats: "7 chỗ", range: null, power: null, torque: null, battery: null, dimensions: null, wheelbase: null, clearance: "185 mm", trunk: null, topSpeed: null, driveModes: "Eco / Normal / Sport", dcCharge: null, brakes: null, wheels: "19 inch", suspension: null, lights: null, screen: null, speakers: null, airbags: null, versions: [{name:"Tiêu chuẩn 2",price:750000000}], colors:["Trắng","Đen","Xám","Đỏ Solar Ruby","Nâu","Xanh dương"]
  },
  {
    slug: "ec-van", name: "EC Van", segment: "Xe thương mại", use: "Vận tải", price: 268000000,
    image: "/cars/ec-van.jpg", tagline: "Giải pháp vận tải điện gọn nhẹ và tiết kiệm.", seats: "2 chỗ", range: "175 km", power: "40 HP", torque: "110 Nm", battery: "18,3 kWh", dimensions: "3.767 × 1.680 × 1.790 mm", wheelbase: "2.520 mm", clearance: "165 mm", trunk: "2.600 lít", topSpeed: "75 km/h", driveModes: null, dcCharge: "24,2 kW", brakes: "Đĩa / Tang trống", wheels: "14 inch", suspension: "MacPherson / Nhíp lá", lights: "Halogen / Halogen", screen: null, speakers: "1 / 2", airbags: null, versions: [{name:"Tiêu chuẩn",price:268000000},{name:"Nâng cao",price:286000000},{name:"Nâng cao + cửa trượt",price:306000000}], colors:["Trắng"]
  }
];

export const money = (value: number | null) => value === null ? updating : new Intl.NumberFormat("vi-VN").format(value) + " ₫";
export const display = (value: string | null) => value || updating;

export const specGroups = [
  { title: "Kích thước & không gian", items: [["Kích thước", "dimensions"], ["Chiều dài cơ sở", "wheelbase"], ["Khoảng sáng gầm", "clearance"], ["Khoang hành lý", "trunk"], ["Số chỗ", "seats"]] },
  { title: "Pin & vận hành", items: [["Quãng đường", "range"], ["Dung lượng pin", "battery"], ["Công suất", "power"], ["Mô-men xoắn", "torque"], ["Tốc độ tối đa", "topSpeed"], ["Chế độ lái", "driveModes"], ["Sạc nhanh DC", "dcCharge"]] },
  { title: "Khung gầm & ngoại thất", items: [["Hệ thống phanh", "brakes"], ["Mâm", "wheels"], ["Hệ thống treo", "suspension"], ["Đèn", "lights"]] },
  { title: "Tiện nghi & an toàn", items: [["Màn hình", "screen"], ["Loa", "speakers"], ["Túi khí", "airbags"]] },
] as const;
