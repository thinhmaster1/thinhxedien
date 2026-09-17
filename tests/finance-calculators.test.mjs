import assert from "node:assert/strict";
import { calculateDecliningBalanceSchedule } from "../js/loan-calculator.js";
import { FIXED_PHYSICAL_INSURANCE, physicalInsuranceQuote } from "../js/quote-calculator.js";

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
assert.deepEqual(physicalInsuranceQuote({ slug:"vf-5" },500000000,"white"),{ amount:6000000,note:"1,2% giá niêm yết" });
assert.deepEqual(physicalInsuranceQuote({ slug:"vf-5" },500000000,"yellow"),{ amount:8000000,note:"1,6% giá niêm yết" });

console.log("PASS: declining-balance loan schedule and physical insurance rules.");
