import { existsSync, readFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const page = (name) => readFileSync(new URL(name + '.html', dist), 'utf8');
const home = page('index');
const tour = page('tour');
const mobile = page('mobile-app');
const pricing = page('pricing');
const demo = page('demo');
const deletion = page('delete-data');
const publicPages = ['index', 'workflows', 'tour', 'mobile-app', 'pricing', 'faq', 'demo'];
const routes = ['workflows', 'tour', 'mobile-app', 'pricing', 'faq', 'demo'];
const checks = {
  brand: existsSync(new URL('ilm-vanta-logo.png', dist))
    && publicPages.every((name) => page(name).includes('src="/ilm-vanta-logo.png"')),
  separatePages: routes.every((route) => home.includes(`href="/${route}"`)),
  canonicalPages: publicPages.every((name) => page(name).includes('rel="canonical"')),
  schoolLogin: home.includes('https://app.ilmvanta.com'),
  demoForm: demo.includes('https://api.web3forms.com/submit') && demo.includes('name="access_key"')
    && ['school', 'name', 'phone', 'plan', 'billing'].every((name) => demo.includes(`name="${name}"`)),
  privacyAndTerms: ['/privacy', '/delete-data', '/terms'].every((path) => home.includes(`href="${path}"`)
    && existsSync(new URL(path.slice(1) + '.html', dist))),
  deletionForm: deletion.includes('https://api.web3forms.com/submit') && deletion.includes('id="deletionForm"'),
  productTabs: (tour.match(/id="tab-/g) ?? []).length === 7,
  mobileScreens: ['parent', 'urdu', 'teacher'].every((screen) => mobile.includes(`data-mobile="${screen}"`)),
  preservedPlans: ['Basic', 'Standard', 'Premium'].every((name) => pricing.includes(`>${name}<`)),
  domain: readFileSync(new URL('CNAME', dist), 'utf8').trim() === 'ilmvanta.com',
};

console.table(checks);
if (Object.values(checks).some((passed) => !passed)) process.exitCode = 1;
