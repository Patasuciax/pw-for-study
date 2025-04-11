import { test, expect } from '@playwright/test';
import Homepage from '../pages/Homepage';
import SignupPage from '../pages/Signuppage.ts';
import data from '../data/usuarios.json';

let homepage: Homepage;
let signuppage: SignupPage;

test('has title', async ({ page }) => {
  homepage = new Homepage(page);
  signuppage = new SignupPage(page);
  // Go to the website
  await page.goto('https://qa.biosafeapp.com/');
  await homepage.goToRegistrarse();
  await signuppage.fillRegistro(data.usuario.correcto);
  await page.waitForTimeout(5000);
});
