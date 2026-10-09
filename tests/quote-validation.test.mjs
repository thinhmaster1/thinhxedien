import assert from 'node:assert/strict';
import { validateMoneyInput, promotionAvailability } from '../js/quote-validation.js';
import { quoteLoanBreakdown, vehiclePriceBeforePromotions, percentagePromotionDiscount } from '../js/quote-calculator.js';

for (const raw of ['-1','1e6','abc','12.5','1,23','Infinity','9999999999999999999']) assert.ok(validateMoneyInput(raw).error,raw);
assert.equal(validateMoneyInput('1,234,000').value,1234000);
assert.equal(validateMoneyInput('').value,0);
assert.ok(validateMoneyInput('501',500).error);
const promotion = { startsAt:'2026-09-19',endsAt:'2026-12-19' };
assert.equal(promotionAvailability(promotion,{},'2026-09-18').available,false);
assert.equal(promotionAvailability(promotion,{},'2026-09-19').available,true);
assert.equal(promotionAvailability(promotion,{},'2026-12-19').available,true);
assert.equal(promotionAvailability(promotion,{},'2026-12-20').available,false);
assert.equal(promotionAvailability({program:'futureGreen2'},{futureGreen2:promotion},'2027-01-01').available,false);
console.log('PASS: malformed money, numeric limits and promotion date boundaries.');
assert.equal(quoteLoanBreakdown(1000000,2000000).remainingLoan,0);
assert.equal(quoteLoanBreakdown(Infinity).downPayment,0);
assert.equal(vehiclePriceBeforePromotions(Infinity,12000000),12000000);
assert.equal(percentagePromotionDiscount(1000000,Infinity),0);
