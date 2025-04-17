import {Page, Locator, expect} from '@playwright/test';

export default class SignupPage {
  readonly page: Page;
  readonly inputNombre: Locator;
  readonly inputCorreoElectronico: Locator;
  readonly inputContrasena: Locator;
  readonly inputConfirmarContrasena: Locator;
  readonly buttonRegistrarse: Locator;
  readonly alertRegistroExitoso: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputNombre = page.getByTestId('nameInput');
    this.inputCorreoElectronico = page.getByTestId('emailInput');
    this.inputContrasena = page.getByTestId('passwordInput');
    this.inputConfirmarContrasena = page.getByTestId('confirmPasswordInput');
    this.buttonRegistrarse = page.getByTestId('botonRegistro');
    this.alertRegistroExitoso = page.getByText('¡Registro exitoso!');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickButtonRegistrarse() {
    return await this.buttonRegistrarse.click({force: true});
  }

  async fillRegistro(usuario: any): Promise<string> {
    const emailUnico = usuario.correoElectronico.replace('@', '+' + Date.now() + '@');
    await this.inputNombre.fill(usuario.nombre);
    await this.inputCorreoElectronico.fill(emailUnico);
    await this.inputContrasena.fill(usuario.contrasena);
    await this.inputConfirmarContrasena.fill(usuario.contrasena);
    await this.clickButtonRegistrarse();
    await expect(this.alertRegistroExitoso).toBeVisible({
      timeout: 7000,
    });
    await expect(this.alertRegistroExitoso).not.toBeVisible({
      timeout: 7000,
    });
    return emailUnico;
  }

}