import { test, expect } from '@playwright/test'

test('test1', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('Jako');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('jako');
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'zalogujzwykle'}).click();
  await page.waitForTimeout(1000);

  await page.getByRole('switch').click();

  await page.goto('http://localhost:3000/manage')
  await page.waitForTimeout(1000);

  await page.getByRole('textbox', { name: 'Nazwa projektu' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('textbox', { name: 'Nazwa projektu' }).fill('Test');
  await page.getByRole('textbox', { name: 'Opis projektu' }).click();
  await page.getByRole('textbox', { name: 'Opis projektu' }).fill('Test opis');
  await page.getByRole('button', { name: 'Dodaj' }).click();
  await page.getByRole('button', { name: 'Wybierz jako aktywny' }).click();
  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('textbox', { name: 'Opis projektu' }).click();
  await page.getByRole('textbox', { name: 'Opis projektu' }).fill('Test opis edytowany');
  await page.getByRole('button', { name: 'Aktualizuj' }).click();
  await page.getByRole('button', { name: 'Usuń' }).click();
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('link').filter({ hasText: /^$/ }).click();
});