import { display, fail, loadCars, money, param, specGroups } from "../core.js";
import { CarSelector, CompareValue, Footer, Header, MissingNote } from "../components.js";

document.querySelector("#header").innerHTML = Header();
document.querySelector("#footer").innerHTML = Footer();

loadCars().then(cars => {
  const root = document.querySelector("#compare-root");
  let selected = (param("xe") || "vf-6,vf-7,vf-8").split(",").filter(slug => cars.some(car => car.slug === slug)).slice(0,3);
  if (!selected.length) selected = ["vf-6","vf-7","vf-8"];
  let differencesOnly = false;
  const chosen = () => selected.map(slug => cars.find(car => car.slug === slug));
  const numeric = text => Number(String(text || "").replace(/[^0-9]/g,"")) || 0;

  function bestIndexes(items, key, mode = "max") {
    const values = items.map(car => key === "price" ? car.price || Infinity : numeric(car.specs[key]));
    const target = mode === "min" ? Math.min(...values) : Math.max(...values);
    return values.map((item,index) => item === target ? index : -1).filter(index => index >= 0);
  }

  function render() {
    const list = chosen();
    const highlights = { price: bestIndexes(list,"price","min"), range: bestIndexes(list,"range"), power: bestIndexes(list,"power"), battery: bestIndexes(list,"battery") };
    root.innerHTML = `<section class="selector-section"><div class="selector-grid">${list.map((car,index) => CarSelector(car,cars,index,selected)).join("")}${selected.length < 3 ? `<button class="empty-selector" id="add-car"><span>+</span><b>Thêm xe</b></button>` : ""}</div></section>
      <section class="quick-compare"><div class="compare-section-head"><div><span>TỔNG QUAN</span><h2>Những khác biệt chính.</h2></div><label><input id="differences" type="checkbox" ${differencesOnly ? "checked" : ""}> Chỉ hiện điểm khác biệt</label></div>${[["Giá từ","price"],["Quãng đường","range"],["Công suất","power"],["Dung lượng pin","battery"]].map(([label,key]) => `<div class="comparison-row" style="--count:${list.length}"><span>${label}</span>${list.map((car,index) => CompareValue(key === "price" ? money(car.price) : car.specs[key],highlights[key].includes(index))).join("")}</div>`).join("")}</section>
      <section class="full-comparison">${specGroups.map(group => { const rows = group.items.filter(([,key]) => list.some(car => car.specs[key]) && (!differencesOnly || new Set(list.map(car => display(car.specs[key]))).size > 1)); return rows.length ? `<details open><summary><h2>${group.title}</h2><span>${rows.length} tiêu chí</span><i></i></summary><div>${rows.map(([label,key]) => `<div class="comparison-row" style="--count:${list.length}"><span>${label}</span>${list.map(car => CompareValue(car.specs[key])).join("")}</div>`).join("")}</div></details>` : ""; }).join("")}</section>
      <section class="compare-summary"><div class="section-title"><span>TÓM TẮT</span><h2>Mỗi lựa chọn<br>có một thế mạnh.</h2></div><div class="summary-grid"><article><span>GIÁ THẤP NHẤT</span><b>${list[highlights.price[0]].name}</b><small>${money(list[highlights.price[0]].price)}</small></article><article><span>ĐI XA NHẤT</span><b>${list[highlights.range[0]].name}</b><small>${display(list[highlights.range[0]].specs.range)}</small></article><article><span>CÔNG SUẤT LỚN NHẤT</span><b>${list[highlights.power[0]].name}</b><small>${display(list[highlights.power[0]].specs.power)}</small></article></div></section>${MissingNote()}`;
  }

  root.addEventListener("change", event => {
    if (event.target.matches("[data-selector]")) { selected[Number(event.target.dataset.selector)] = event.target.value; history.replaceState(null,"",`?xe=${selected.join(",")}`); render(); }
    if (event.target.id === "differences") { differencesOnly = event.target.checked; render(); }
  });
  root.addEventListener("click", event => {
    const remove = event.target.closest("[data-remove]");
    if (remove && selected.length > 1) { selected.splice(Number(remove.dataset.remove),1); history.replaceState(null,"",`?xe=${selected.join(",")}`); render(); }
    if (event.target.closest("#add-car")) { const next = cars.find(car => !selected.includes(car.slug)); if (next) { selected.push(next.slug); render(); } }
  });
  render();
}).catch(fail);
