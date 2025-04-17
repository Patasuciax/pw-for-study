import { test, expect } from '@playwright/test';
import Homepage from '../pages/Homepage';
import SignupPage from '../pages/Signuppage.ts';
import data from '../data/usuarios.json';
import { getVerificationCode } from '../utils/gmailUtils.ts';
import EmailVerification from '../pages/EmailVerification.ts';
import Loginpage from '../pages/Loginpage.ts';

let homepage: Homepage;
let signuppage: SignupPage;
let emailverification: EmailVerification;
let loginpage: Loginpage;

test('Registro happy path', async ({ page }) => {
  homepage = new Homepage(page);
  signuppage = new SignupPage(page);
  emailverification = new EmailVerification(page);
  loginpage = new Loginpage(page);
  // Go to the website
  await page.goto('https://qa.biosafeapp.com/');
  await homepage.goToRegistrarse();
  const emailUnico = await signuppage.fillRegistro(data.usuario.correcto);
  await expect(page).toHaveURL('https://qa.biosafeapp.com/verify-email');
  const verificationCode = await getVerificationCode();
  await emailverification.fillVerificationCode(verificationCode);
  await expect(page).toHaveURL('https://qa.biosafeapp.com/login');
  await loginpage.fillLogin(emailUnico, data.usuario.correcto.contrasena);
  await expect(page).toHaveURL('https://qa.biosafeapp.com/dashboard');
  page.waitForTimeout(2000);
});
