import { test, expect } from '@playwright/test';

const appUrl = 'http://localhost:4200/heroes';
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
    await expect(page.getByRole('heading', { name: 'My Heroes' })).toBeVisible();
    await expect(page.getByText('Hero name: Add hero')).toBeVisible();
    await expect(page.getByText('Hero name:')).toBeVisible();
    await expect(page.getByLabel('Hero name:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add hero' })).toBeVisible();
    for (const hero of heroesMockup) {
        await expect(page.getByRole('link', { name: hero.name })).toBeVisible();
        await expect(page.locator('li').filter({ hasText: `${hero.name} x` }).getByRole('button')).toBeVisible();
    }
});
