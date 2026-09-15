import { fail, loadCars } from "../core.js";
import { mountSiteShell, VehicleCard } from "../components.js?v=2026091502";

mountSiteShell();

loadCars().then(cars => {
  const preferred = ["vf-3", "vf-5", "vf-7"];
  document.querySelector("#local-model-grid").innerHTML = preferred.map(slug => cars.find(car => car.slug === slug)).filter(Boolean).map(car => VehicleCard(car)).join("");
}).catch(fail);
