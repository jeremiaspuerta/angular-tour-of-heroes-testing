import { test, expect } from '@playwright/test';

const heroesMockup = [
    { id: 12, name: 'Batman' },
    { id: 13, name: 'Spiderman Updated' },
    { id: 14, name: 'Wolverin' },
    { id: 15, name: 'Flash' },
    { id: 16, name: 'Robin' },
    { id: 17, name: 'Thor' },
    { id: 18, name: 'Iron Man' },
    { id: 19, name: 'Black Panther' }
];
const heroMockup = {
    id: 13,
    name: 'Spiderman'
}
const appUrl = `http://localhost:4200`;

test.beforeEach(async ({ page }) => {
    await page.route(`**/api/heroes/${heroMockup.id}`, async route => {
        await route.fulfill({
            status: 200,
            body: JSON.stringify(heroMockup)
        });
    });
    await page.goto(`${appUrl}/detail/${heroMockup.id}`);
});

test('UI elements Visibility', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Heroes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: `${heroMockup.name.toUpperCase()} Details` })).toBeVisible();
    await expect(page.getByText(`id: ${heroMockup.id}`)).toBeVisible();
    await expect(page.locator('label')).toContainText('Hero name:');
    await expect(page.getByPlaceholder('Hero name')).toHaveValue(heroMockup.name);
    await expect(page.getByRole('button', { name: 'go back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'save' })).toBeVisible();
    await expect(page.locator('app-hero-detail')).toContainText(`${heroMockup.name.toUpperCase()} Details`);
});

test('Edit hero name', async ({ page }) => {

    await page.getByPlaceholder('Hero name').fill('Spiderman Updated');
    await expect(page.getByRole('heading', { name: `Spiderman Updated Details` })).toBeVisible();

    await page.route('**/api/heroes', async route => {
        await route.fulfill({
            status: 200
        });
    });

    await page.getByRole('button', { name: 'save' }).click();

    await page.route('**/api/heroes', async route => {
        await route.fulfill({
            status: 200,
            body: JSON.stringify(heroesMockup)
        });
    });

});
