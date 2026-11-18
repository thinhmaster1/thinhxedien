import {test,expect} from '@playwright/test';

test('editable note dropdown and total-only reduction',async ({page})=>{
  await page.goto('quote.html');
  await expect(page.locator('#quote-form')).toBeVisible();
  const note='Hỗ trợ giao xe <img src=x onerror="window.noteXss=1">';
  await page.locator('#new-total-discount-note').fill(note);
  await page.locator('#add-total-discount-note').click();
  await expect(page.locator('#total-discount-note')).toHaveValue(note);
  await page.locator('#total-discount').fill('1000000');
  await expect(page.locator('.vehicle-cost .subtotal b')).toContainText('188,000,000');
  await expect(page.locator('.payment-card.cash > h3')).toContainText('192,325,000');
  await expect(page.locator('.payment-card.cash .fee-breakdown')).toContainText(note);
  await expect(page.locator('#quote-results img')).toHaveCount(0);
  expect(await page.evaluate(()=>window.noteXss)).toBeUndefined();
  await page.getByRole('tab',{name:'Trả góp',exact:true}).click();
  await expect(page.locator('.payment-card.loan')).toBeVisible();
  await expect(page.locator('.payment-card.loan > h3')).toContainText('37,025,000');
  await expect(page.locator('.loan-note > b')).toContainText('159,800,000');
  await expect(page.locator('#loan-down-payment')).toHaveValue('28,200,000');
  await expect(page.locator('.payment-card.loan .fee-breakdown')).toContainText('4,500,000');
  const data=await page.evaluate(async()=> (await import('/js/pages/quote.js?v=2026111803')).currentQuoteImageData());
  expect(data.paymentTotal).toContain('37,025,000');
  expect(data.paymentRows.some(row=>row.note===note && row.value.includes('1,000,000'))).toBe(true);
  const downloading=page.waitForEvent('download');
  await page.locator('#download-quote-image').click();
  const file=await downloading;
  expect(file.suggestedFilename()).toContain('Tra-gop');
  const chunks=[];for await (const chunk of await file.createReadStream()) chunks.push(chunk);
  expect(Buffer.concat(chunks).subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  await page.locator('#total-discount').fill('40000000');
  await expect(page.locator('#download-quote-image')).toBeDisabled();
  await expect(page.locator('#total-discount')).toHaveAttribute('aria-invalid','true');
  await page.getByRole('tab',{name:'Trả thẳng',exact:true}).click();
  await expect(page.locator('#download-quote-image')).toBeEnabled();
  await expect(page.locator('.payment-card.cash > h3')).toContainText('153,325,000');
  for (const value of ['-1','abc','99999999999999999999']) {
    await page.locator('#total-discount').fill(value);
    await expect(page.locator('#download-quote-image')).toBeDisabled();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
