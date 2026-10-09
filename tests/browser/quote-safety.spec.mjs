import { test, expect } from '@playwright/test';

test('untrusted customer text, invalid money and real PNG download', async ({ page }) => {
  await page.goto('quote.html');
  await expect(page.locator('#quote-form')).toBeVisible();
  const name = '<img src=x onerror="window.quoteXss=1"> Nguyễn Văn Khách';
  await page.locator('#customer-name').fill(name);
  await expect(page.locator('.quote-result-head')).toContainText(name);
  expect(await page.evaluate(()=>window.quoteXss)).toBeUndefined();
  await expect(page.locator('.quote-result-head img')).toHaveCount(0);
  expect(await page.evaluate(() => [...Object.values(localStorage),...Object.values(sessionStorage)].join(' '))).not.toContain(name);
  for (const raw of ['-500','abc','1e6','999999999999999999999']) {
    await page.locator('#discount').fill(raw);
    await expect(page.locator('#download-quote-image')).toBeDisabled();
    await expect(page.locator('#discount')).toHaveAttribute('aria-invalid','true');
  }
  await page.locator('#discount').fill('');
  await page.locator('#customer-phone').fill('not-a-phone');
  await expect(page.locator('#download-quote-image')).toBeDisabled();
  await page.locator('#customer-phone').fill('0352978519');
  for (const mode of ['cash','loan']) {
    await page.locator(`[data-payment-mode="${mode}"]`).click();
    for (const fee of ['0','3000000','5000000']) {
      await page.locator(`[name="registrationService"][value="${fee}"]`).check();
      const imageData = await page.evaluate(async () => (await import('/js/quote-image.js?v=2026100602')).currentQuoteImageData());
      expect(imageData.paymentTotal).toBe(await page.locator(`[data-payment-panel="${mode}"] > h3`).textContent());
      expect(imageData.disclaimer).toContain('Ngày lập:');
      expect(imageData.customer).toContain(name);
      const waiting = page.waitForEvent('download');
      await page.locator('#download-quote-image').click();
      const download = await waiting;
      expect(download.suggestedFilename()).toContain(mode === 'cash' ? 'Tra-thang' : 'Tra-gop');
      expect(download.suggestedFilename()).toContain('SDT-0352978519');
      const stream = await download.createReadStream();
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const png = Buffer.concat(chunks);
      expect(png.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(png.readUInt32BE(16)).toBe(1080);
      expect(png.readUInt32BE(20)).toBeGreaterThan(500);
    }
  }
  await page.locator('#loan-down-payment').fill('-1');
  await expect(page.locator('#download-quote-image')).toBeDisabled();
});

test('promotions require confirmation and expired ones cannot apply', async ({ page }) => {
  await page.route('**/data/promotions.json', async route => {
    const response = await route.fetch();
    const data = await response.json();
    data.futureGreen2.endsAt = '2000-01-01';
    await route.fulfill({json:data});
  });
  await page.goto('quote.html');
  await expect(page.locator('#quote-form')).toBeVisible();
  await page.locator('[name="modelPromotion"]').first().check();
  await expect(page.locator('#download-quote-image')).toBeDisabled();
  await expect(page.locator('.vehicle-cost')).not.toContainText('Ưu đãi dòng xe');
  await page.locator('#promotion-confirmed').check();
  await expect(page.locator('.vehicle-cost')).toContainText('Ưu đãi dòng xe');
  await page.locator('#customer-promotion').selectOption('future-green-2-owner');
  await page.locator('#promotion-confirmed').check();
  await expect(page.locator('.vehicle-cost')).not.toContainText('Ưu đãi khách hàng');
  await expect(page.locator('#download-quote-image')).toBeDisabled();
  await expect(page.locator('.quote-disclaimer')).toContainText('đã hết hạn');
});
