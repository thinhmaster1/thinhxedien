import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { calculateDecliningBalanceSchedule } from "../js/loan-calculator.js";
import { FIXED_PHYSICAL_INSURANCE, percentagePromotionDiscount, physicalInsuranceQuote, rollingCostsTotal, roundUpToThousand, tieredPromotionRate, vehiclePriceBeforePromotions } from "../js/quote-calculator.js";

const promotions = JSON.parse(readFileSync(new URL("../data/promotions.json", import.meta.url), "utf8"));

const schedule = calculateDecliningBalanceSchedule({
  principal: 500000000,
  annualRate: 8.5,
  floatingAnnualRate: 11.5,
  months: 60,
  fixedMonths: 12
});
assert.equal(schedule.rows.length,60);
assert.equal(Math.round(schedule.rows[0].principalPayment),8333333);
assert.equal(Math.round(schedule.rows[0].interest),3541667);
assert.equal(Math.round(schedule.rows[0].payment),11875000);
assert.equal(Math.round(schedule.balanceAfterFixed),400000000);
assert.equal(Math.round(schedule.rows[12].interest),3833333);
assert.equal(Math.round(schedule.floatingFirstPayment),12166667);
assert.equal(Math.round(schedule.rows.at(-1).balance),0);
assert.ok(schedule.rows[1].payment < schedule.rows[0].payment);
assert.ok(schedule.rows.at(-1).payment < schedule.rows[12].payment);

const zeroInterest = calculateDecliningBalanceSchedule({ principal:120000000,annualRate:0,floatingAnnualRate:0,months:12,fixedMonths:12 });
assert.equal(zeroInterest.totalInterest,0);
assert.equal(zeroInterest.totalPayment,120000000);
assert.equal(Math.round(zeroInterest.rows.at(-1).balance),0);

for (const slug of ["vf-2", "vf-3", "ec-van"]) {
  assert.equal(physicalInsuranceQuote({ slug },999000000,"white").amount,FIXED_PHYSICAL_INSURANCE);
  assert.equal(physicalInsuranceQuote({ slug },999000000,"yellow").amount,FIXED_PHYSICAL_INSURANCE);
}
assert.deepEqual(physicalInsuranceQuote({ slug:"vf-5" },500000000,"white"),{ amount:6000000,note:"1,2% giá xe sau ưu đãi · làm tròn lên 1.000đ" });
assert.deepEqual(physicalInsuranceQuote({ slug:"vf-5" },500000000,"yellow"),{ amount:8000000,note:"1,6% giá xe sau ưu đãi · làm tròn lên 1.000đ" });
assert.deepEqual(physicalInsuranceQuote({ slug:"vf-7" },688200000,"white"),{ amount:8259000,note:"1,2% giá xe sau ưu đãi · làm tròn lên 1.000đ" });
assert.deepEqual(physicalInsuranceQuote({ slug:"limo-green" },636090000,"yellow"),{ amount:10178000,note:"1,6% giá xe sau ưu đãi · làm tròn lên 1.000đ" });
assert.equal(roundUpToThousand(7633080),7634000);
assert.equal(roundUpToThousand(4500000),4500000);
assert.equal(rollingCostsTotal(5675000,7634000),13309000);
assert.equal(rollingCostsTotal(5325000,0),5325000);

const futureGreen = promotions.futureGreen2;
for (const slug of ["vf-2", "vf-3"]) {
  assert.equal(tieredPromotionRate(futureGreen,"owner",slug),.03);
  assert.equal(tieredPromotionRate(futureGreen,"special",slug),.06);
}
for (const slug of ["vf-7", "vf-9", "vf-8-moi", "ec-van", "vf-wild-comfort"]) {
  assert.equal(tieredPromotionRate(futureGreen,"owner",slug),.05);
  assert.equal(tieredPromotionRate(futureGreen,"special",slug),.07);
}
for (const slug of ["herio-green", "vf-5", "vf-6", "vf-8", "limo-green", "mpv-7"]) {
  assert.equal(tieredPromotionRate(futureGreen,"owner",slug),.09);
  assert.equal(tieredPromotionRate(futureGreen,"special",slug),.09);
}
assert.equal(percentagePromotionDiscount(188000000,.03),5640000);
assert.equal(vehiclePriceBeforePromotions(188000000,8000000),196000000);
assert.equal(percentagePromotionDiscount(vehiclePriceBeforePromotions(188000000,8000000),.03),5880000);
assert.equal(percentagePromotionDiscount(699000000,.09),62910000);
assert.equal(tieredPromotionRate(futureGreen,"missing","vf-2"),0);

console.log("PASS: loan schedule, physical insurance and Vì tương lai xanh 2 tiered discounts.");
