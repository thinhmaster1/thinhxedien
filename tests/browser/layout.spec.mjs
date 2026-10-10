import { test, expect } from '@playwright/test';

const routes = ['index.html','detail.html?xe=vf-wild-comfort','vf-wild-comfort.html','vf-7.html','data.html','compare.html?xe=vf-3,vf-7,vf-9','policies.html','quote.html','loan.html','vinfast-thu-dau-mot-binh-duong.html'];

async function checkLayout(page) {
  const issues = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('Page overflows horizontally');
    // Scroll containers for tables are allowed. Critical controls and currency must fit their own box.
    for (const el of document.querySelectorAll('button, .subtotal b, .fee-breakdown b, .payment-card h3, .loan-note b')) {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) issues.push(`Clipped: ${el.textContent.trim()}`);
    }
    for (const row of document.querySelectorAll('.subtotal, .fee-breakdown > div:not(.fee-divider)')) {
      const label = row.querySelector('span');
      const value = row.querySelector('b');
      if (!label || !value || !row.getBoundingClientRect().height) continue;
      const a = label.getBoundingClientRect(), b = value.getBoundingClientRect();
      if (a.right > b.left + 1 && a.top < b.bottom && b.top < a.bottom) issues.push(`Overlapping amount: ${row.textContent.trim()}`);
    }
    return issues;
  });
  expect(issues).toEqual([]);
}

for (const route of routes) {
  test(`layout ${route}`, async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror',error => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    await expect(page.locator('.loading')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await checkLayout(page);
    expect(errors).toEqual([]);
    expect(await page.locator('main img').evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src))).toEqual([]);
    await testInfo.attach('layout', { body: await page.screenshot({ fullPage:true }), contentType:'image/png' });
  });
}

test('quote fees, loan presets and long customer name', async ({ page }) => {
  await page.goto('quote.html');
  await expect(page.locator('#quote-form')).toBeVisible();
  await page.locator('#customer-name').fill('Nguyễn Thị Khách Hàng Có Họ Và Tên Rất Dài Để Kiểm Tra Bố Cục');
  for (const [fee,total] of [['0','190,325,000'],['3000000','193,325,000'],['5000000','195,325,000']]) {
    await page.locator(`[name="registrationService"][value="${fee}"]`).check();
    await expect(page.locator('.payment-card.cash h3')).toContainText(total);
    await checkLayout(page);
  }
  await page.getByRole('tab',{ name:'Trả góp',exact:true }).click();
  for (const [percentage,down] of [[75,'47,000,000'],[80,'37,600,000'],[85,'28,200,000']]) {
    await page.locator(`[data-loan-percentage="${percentage}"]`).click();
    await expect(page.locator('#loan-down-payment')).toHaveValue(down);
    await checkLayout(page);
  }
  await page.locator('#discount').fill('7000000');
  await expect(page.locator('#discount-note')).toContainText('không được vượt quá');
  await checkLayout(page);
  await page.locator('#discount').fill('');
  await page.locator('#loan-down-payment').fill('188000000');
  await expect(page.locator('.loan-paid-off')).toBeVisible();
  await checkLayout(page);
});

test('mobile navigation opens and closes', async ({ page }) => {
  test.skip(page.viewportSize().width > 780,'Mobile only');
  await page.goto('index.html');
  const toggle = page.locator('.nav-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await checkLayout(page);
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});
