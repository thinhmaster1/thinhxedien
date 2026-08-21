import { categories, fail, loadCars } from "../core.js";
import { applySeo, CategorySection, Footer, Header } from "../components.js";

applySeo({
  title: "Thịnh Xe Điện | Giá xe VinFast & khuyến mãi 2026",
  description: "Xem các dòng xe điện VinFast, giá theo phiên bản, khuyến mãi và nhận tư vấn tại Thủ Dầu Một, Bình Dương qua 0352 978 519.",
  canonical: "https://thinhmaster1.github.io/thinhxedien/index.html"
});

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

loadCars().then(cars => {
  const grouped = Object.keys(categories).map(key => ({
    key,
    meta: categories[key],
    cars: cars.filter(car => car.category === key).sort((a,b) => a.displayOrder - b.displayOrder)
  })).filter(group => group.cars.length);

  document.querySelector("#category-list").innerHTML = grouped.map(CategorySection).join("");
}).catch(fail);
