import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const checks = {
  web3forms: html.includes('https://api.web3forms.com/submit'),
  schoolLogin: html.includes('https://app.ilmvanta.com'),
  requiredFields: ['school', 'name', 'phone'].every((name) => html.includes(`name="${name}"`)),
  productTabs: (html.match(/id="tab-/g) ?? []).length === 6,
  mobileDevices: (html.match(/class="device device-/g) ?? []).length === 3,
  preservedPlans: ['Basic', 'Standard', 'Premium'].every((name) => html.includes(`>${name}<`)),
};

console.table(checks);
if (Object.values(checks).some((passed) => !passed)) process.exitCode = 1;
