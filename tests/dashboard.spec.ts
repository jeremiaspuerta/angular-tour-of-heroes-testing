import { test, expect } from '@playwright/test';

const appUrl = 'http://localhost:4200/dashboard';
const heroesMockup = [
    { id: 12, name: 'Batman' },
    { id: 13, name: 'Spiderman' },
    { id: 14, name: 'Wolverin' },
    { id: 15, name: 'Flash' },
    { id: 16, name: 'Robin' },
    { id: 17, name: 'Thor' },
    { id: 18, name: 'Iron Man' },
    { id: 19, name: 'Black Panther' }
];

test.beforeEach(async ({ page }) => {
    await page.route('**/api/heroes', async route => {
        await route.fulfill({
            status: 200,
            body: JSON.stringify(heroesMockup)
        });
    });
    await page.goto(appUrl);
});

test('Dashboard UI elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tour of Heroes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Heroes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Hero Search')).toBeVisible();
    await expect(page.getByLabel('Hero Search')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear messages' })).toBeVisible();
});

test('Click on heroe', async ({ page }) => {
    await page.getByRole('link', { name: 'Spiderman' }).click();
    await expect(page.url()).toContain(`detail/${13}`);
});

test('Click on heroes tab', async ({ page }) => {
    await page.getByRole('link', { name: 'Heroes' }).click();
    await expect(page.url()).toContain(`heroes`);
});