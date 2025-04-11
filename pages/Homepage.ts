import {Page, Locator, expect} from '@playwright/test';

export default class Homepage {
  readonly page: Page;
  readonly buttonRegistrarse: Locator;
  readonly subtitle: Locator;
  readonly button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonRegistrarse = page.getByRole('link', { name: 'Registrarse' }).first();
    this.subtitle = page.locator('h2');
    this.button = page.locator('button');
  }

  async goToRegistrarse() {
    await this.buttonRegistrarse.click({force: true});
    await expect(this.page).toHaveURL(/.*\/signup/);
  }


}