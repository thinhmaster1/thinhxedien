import { categories, fail, loadCars } from "../core.js";
import { CategorySection, Footer, Header } from "../components.js";

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
