import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const { cars } = JSON.parse(readFileSync(new URL('../../data/cars.json', import.meta.url), 'utf8'));
test('vehicle HTML is readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const car of cars) {
    await page.goto(`http://127.0.0.1:4173/${car.slug}.html`);
    await expect(page.locator('h1')).toHaveText(car.name);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://thinhmaster1.github.io/thinhxedien/${car.slug}.html`);
    const schema = JSON.parse(await page.locator('#vehicle-schema').textContent());
    expect(schema['@graph'][0].offers.lowPrice).toBe(Math.min(...car.versions.map(v=>v.price)));
    expect(schema['@graph'][0].offers.availability).toBeUndefined();
  }
  await context.close();
});
