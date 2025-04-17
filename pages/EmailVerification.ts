import {Page, Locator, expect} from '@playwright/test';

export default class EmailVerification {
  readonly page: Page;
  readonly inputCodigoVerificacion: Locator;
  readonly buttonVerificar: Locator;
  readonly alertSuccessful: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputCodigoVerificacion = page.getByTestId('input-verification-code');
    this.buttonVerificar = page.getByTestId('btn-verify-email');
    this.alertSuccessful = page.getByText('¡Correo verificado exitosamente!');
  }

  async goto() {
    await this.page.goto('/verify-email');
  }

  async fillVerificationCode(code: string) {
    await this.inputCodigoVerificacion.fill(code);
    await this.buttonVerificar.click();
    await expect(this.alertSuccessful).toBeVisible({
      timeout: 7000,
     });
  }
}   