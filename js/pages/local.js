import { fail, loadCars } from "../core.js";
import { Footer, Header, VehicleCard } from "../components.js";

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

loadCars().then(cars => {
  const preferred = ["vf-3", "vf-5", "vf-7"];
  document.querySelector("#local-model-grid").innerHTML = preferred.map(slug => cars.find(car => car.slug === slug)).filter(Boolean).map(car => VehicleCard(car)).join("");
}).catch(fail);
