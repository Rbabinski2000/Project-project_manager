import { test, expect } from '@playwright/test'

test('testAll', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('Jako');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('jako');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'zalogujzwykle' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Projects CRUD' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('textbox', { name: 'Nazwa projektu' }).click();
  await page.getByRole('textbox', { name: 'Nazwa projektu' }).fill('test');
  await page.getByRole('textbox', { name: 'Opis projektu' }).click();
  await page.getByRole('textbox', { name: 'Opis projektu' }).fill('testo');
  await page.getByRole('button', { name: 'Dodaj' }).click();
  await page.getByRole('button', { name: 'Wybierz jako aktywny' }).click();
  await page.getByRole('link', { name: 'Stories CRUD' }).click();
  await page.getByRole('textbox', { name: 'Nazwa' }).click();
  await page.getByRole('textbox', { name: 'Nazwa' }).fill('tests');
  await page.getByRole('textbox', { name: 'Opis' }).click();
  await page.getByRole('textbox', { name: 'Opis' }).fill('testos');
  await page.locator('select[name="priorytet"]').selectOption('1');
  await page.getByRole('button', { name: 'Dodaj' }).click();
  await page.getByRole('button', { name: 'Wybierz jako aktywny' }).click();
  await page.getByRole('link', { name: 'Task CRUD' }).click();
  await page.getByRole('textbox', { name: 'Nazwa' }).click();
  await page.getByRole('textbox', { name: 'Nazwa' }).fill('testt');
  await page.getByRole('textbox', { name: 'Opis' }).click();
  await page.getByRole('textbox', { name: 'Opis' }).fill('testot');
  await page.locator('select[name="priorytet"]').selectOption('1');
  await page.getByRole('button', { name: 'Dodaj' }).click();
  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.locator('select[name="przypisany_uzytkownik"]').selectOption('1');
  await page.getByRole('button', { name: 'Aktualizuj' }).click();
  await page.getByRole('button', { name: 'Usuń' }).click();
  await page.getByRole('link', { name: 'Stories CRUD' }).click();
  await page.getByRole('button', { name: 'Usuń' }).click();
  await page.getByRole('link', { name: 'Projects CRUD' }).click();
  await page.getByRole('button', { name: 'Usuń' }).click();
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('link').filter({ hasText: /^$/ }).click();
  await page.getByRole('switch').click();
});