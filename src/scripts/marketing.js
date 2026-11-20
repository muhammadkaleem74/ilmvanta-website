const screens = {
  overview: {
    label: 'Overview', topic: 'School overview', window: 'School dashboard', image: 'dashboard',
    alt: 'School dashboard showing student strength, attendance, fee collections and pending admissions',
    heading: 'See what needs your attention today.',
    description: 'Start with student strength, attendance, fee collection and new admissions in one operational view.',
    points: ['Check class attendance at a glance', 'Review fees and pending admissions'],
  },
  admissions: {
    label: 'Admissions', topic: 'Admissions', window: 'Student directory', image: 'students-list',
    alt: 'Student directory with class, guardian and enrolment information',
    heading: 'Keep one record from application to enrolment.',
    description: 'Organise enquiries, applications and admissions around the student record. Keep sibling and guardian details together.',
    points: ['Find students by class and status', 'Carry records forward into school operations'],
  },
  fees: {
    label: 'Fees', topic: 'Fee management', window: 'Fee challans', image: 'fee-challans',
    alt: 'Fee challans with paid, part-paid and overdue states',
    heading: 'See where every fee balance stands.',
    description: 'Issue monthly challans, apply sibling discounts, and record part payments and receipts in the same workflow.',
    points: ['Find overdue and part-paid challans', 'Track charges and collections in PKR'],
  },
  attendance: {
    label: 'Attendance', topic: 'Daily attendance', window: 'Class register', image: 'attendance-sheet',
    alt: 'Class attendance sheet with student names and marks by day',
    heading: 'The daily register, with the whole class in view.',
    description: 'Follow attendance by section and day. Teachers can mark attendance offline, and the school calendar handles weekends and holidays.',
    points: ['Review recorded attendance by class', 'Keep office and teacher views aligned'],
  },
  exams: {
    label: 'Exams', topic: 'Exams and results', window: 'Report cards', image: 'report-cards-list',
    alt: 'Exam report cards with marks, percentages and positions',
    heading: 'Turn subject marks into report cards.',
    description: 'Bring totals, grades, positions and teacher remarks together so parents can read the result in one place.',
    points: ['Use your school’s grading scale', 'Review results by class before sharing'],
  },
  timetable: {
    label: 'Timetable', topic: 'Timetables and covers', window: 'Weekly timetable', image: 'timetable',
    alt: 'Weekly timetable grid with subjects, periods and teachers',
    heading: 'Plan the week around every class.',
    description: 'Coordinate sections, rooms and teacher availability around each campus’s bell schedule.',
    points: ['See classes and teachers by period', 'Identify periods that need a cover'],
  },
  payroll: {
    label: 'Payroll', topic: 'Staff and payroll', window: 'Payroll run', image: 'payroll-run',
    alt: 'Completed payroll run with salaries, deductions and payment status',
    heading: 'Run salaries with staff details in place.',
    description: 'Bring salary structures, allowances and attendance deductions into each payroll run, then generate payslips.',
    points: ['Review take-home salary and deductions', 'Account for EOBI and provident fund'],
  },
};

const mobileScreens = {
  parent: { image: 'parent-home-en', alt: 'Ilm Vanta parent app home screen in English', note: 'See attendance, upcoming fees and notices for your child.' },
  urdu: { image: 'parent-home-ur', alt: 'Ilm Vanta parent app home screen in Urdu', note: 'Preview the same parent workspace in Urdu with a right-to-left layout.' },
  teacher: { image: 'teacher-today', alt: 'Ilm Vanta teacher app showing today’s classes', note: 'Review today’s timetable, see assigned covers and open the class register.' },
};

const byId = (id) => document.getElementById(id);
const pageParams = new URLSearchParams(location.search);

const menu = byId('menu-button');
const nav = byId('main-nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menu.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('click', (event) => {
  if (menu.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setMenu(false);
});
window.matchMedia('(max-width: 890px)').addEventListener('change', () => setMenu(false));

function selectOption(buttons, selected) {
  for (const button of buttons) button.setAttribute('aria-pressed', String(button === selected));
}

function initTour() {
  const images = JSON.parse(byId('tour').dataset.images);
  const screenTabs = [...document.querySelectorAll('[data-screen]')];
  const tourImage = byId('tour-image');
  const tourPrev = byId('tour-prev');
  const tourNext = byId('tour-next');
  const dialog = byId('screen-dialog');
  const zoom = byId('zoom-screen');
  const dialogViewport = dialog.querySelector('.dialog-image');
  let currentScreen = 0;

  function setScreen(index, focusTab = false) {
    const tab = screenTabs[index];
    const screen = screens[tab.dataset.screen];
    currentScreen = index;
    for (const item of screenTabs) {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    }
    byId('tour-panel').setAttribute('aria-labelledby', tab.id);
    byId('tour-section-name').textContent = screen.topic;
    byId('tour-window-name').textContent = screen.window;
    byId('tour-heading').textContent = screen.heading;
    byId('tour-description').textContent = screen.description;
    byId('tour-points').replaceChildren(...screen.points.map((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      return li;
    }));
    tourImage.src = images[screen.image];
    tourImage.alt = screen.alt;
    byId('expand-screen').setAttribute('aria-label', 'Enlarge ' + screen.window.toLowerCase());
    byId('tour-progress').textContent = screen.label + ' · ' + (index + 1) + ' of ' + screenTabs.length;
    tourPrev.disabled = index === 0;
    tourNext.disabled = index === screenTabs.length - 1;
    const url = new URL(location.href);
    if (index === 0) url.searchParams.delete('screen');
    else url.searchParams.set('screen', tab.dataset.screen);
    if (url.href !== location.href) history.replaceState(history.state, '', url);
    if (focusTab) tab.focus({ preventScroll: true });
  }

  for (const [index, tab] of screenTabs.entries()) {
    tab.addEventListener('click', () => setScreen(index));
    tab.addEventListener('keydown', (event) => {
      const last = screenTabs.length - 1;
      const targets = {
        ArrowLeft: index > 0 ? index - 1 : last,
        ArrowRight: index < last ? index + 1 : 0,
        Home: 0, End: last,
      };
      if (event.key in targets) {
        event.preventDefault();
        setScreen(targets[event.key], true);
      }
    });
  }

  tourPrev.addEventListener('click', () => {
    setScreen(currentScreen - 1);
    if (tourPrev.disabled) tourNext.focus({ preventScroll: true });
  });
  tourNext.addEventListener('click', () => {
    setScreen(currentScreen + 1);
    if (tourNext.disabled) tourPrev.focus({ preventScroll: true });
  });

  function setZoom(isZoomed) {
    zoom.setAttribute('aria-pressed', String(isZoomed));
    zoom.textContent = isZoomed ? 'Fit screen' : 'Zoom in';
    dialogViewport.classList.toggle('is-zoomed', isZoomed);
    if (!isZoomed) dialogViewport.scrollTo(0, 0);
  }
  byId('expand-screen').addEventListener('click', () => {
    const screen = screens[screenTabs[currentScreen].dataset.screen];
    byId('screen-dialog-title').textContent = screen.window;
    const image = byId('dialog-image');
    image.src = images[screen.image];
    image.alt = screen.alt;
    setZoom(false);
    dialog.showModal();
  });
  zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));
  byId('close-screen').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const initialScreen = screenTabs.findIndex((tab) => tab.dataset.screen === pageParams.get('screen'));
  if (initialScreen > 0) setScreen(initialScreen);
}

function initMobilePreview() {
  const images = JSON.parse(byId('mobile-app').dataset.images);
  const mobileButtons = [...document.querySelectorAll('[data-mobile]')];
  for (const button of mobileButtons) {
    button.addEventListener('click', () => {
      const screen = mobileScreens[button.dataset.mobile];
      selectOption(mobileButtons, button);
      byId('phone-image').src = images[screen.image];
      byId('phone-image').alt = screen.alt;
      byId('mobile-note').textContent = screen.note;
    });
  }
}

function initPricing() {
  const pricing = byId('pricing');
  const billingButtons = [...pricing.querySelectorAll('[data-billing]')];
  const prices = pricing.querySelectorAll('[data-billing-price]');
  const quoteLinks = pricing.querySelectorAll('[data-plan]');
  for (const button of billingButtons) {
    button.addEventListener('click', () => {
      const billing = button.dataset.billing;
      selectOption(billingButtons, button);
      for (const price of prices) {
        price.hidden = price.dataset.billingPrice !== billing;
      }
      for (const link of quoteLinks) {
        link.search = new URLSearchParams({ plan: link.dataset.plan, billing }).toString();
      }
    });
  }
}

function initDemo() {
  const demoForm = byId('demo-form');
  const demoFields = byId('demo-fields');
  const demoReview = byId('demo-review');
  const demoSuccess = byId('demo-success');
  const fields = demoForm.elements;
  const person = fields.namedItem('name');
  const offer = fields.namedItem('offer');
  const pilotNote = byId('demo-pilot');
  const billingLabel = byId('demo-billing');
  let pilotRequested = pageParams.get('offer') === 'school-pilot';
  const send = byId('send-demo');
  const edit = byId('edit-demo');
  const error = byId('demo-error');
  let demoStep = 'details';

  function setDemoStep(step) {
    demoStep = step;
    error.hidden = true;
    demoFields.hidden = step !== 'details';
    demoReview.hidden = step !== 'review';
    demoSuccess.hidden = step !== 'success';
    demoForm.querySelectorAll('.form-progress span')[1].classList.toggle('current', step !== 'details');
    const heading = { details: 'details-title', review: 'review-title', success: 'success-title' }[step];
    byId(heading).focus({ preventScroll: true });
    byId(heading).scrollIntoView({ block: 'nearest' });
  }

  function updatePilot() {
    const eligiblePlan = fields.plan.value === 'Basic' || fields.plan.value === 'Standard';
    const pilot = pilotRequested && eligiblePlan;
    offer.disabled = !pilot;
    pilotNote.hidden = !pilot;
    billingLabel.hidden = pilot;
    if (pilot) fields.billing.value = 'Monthly';
  }

  function drawReview() {
    const summary = [
      ['School', fields.school.value.trim()],
      ['Your name', person.value.trim()],
      ['Role', fields.role.value],
      ['City', fields.city.value.trim()],
      ['Student count', fields.students.value],
      ['Phone / WhatsApp', fields.phone.value.trim()],
      ['Email', fields.email.value.trim()],
      ['Plan', fields.plan.value || 'Help me choose'],
      ['Billing', fields.billing.value],
      ['Offer', offer.disabled ? '' : offer.value],
      ['Demo topics', fields.message.value.trim()],
    ];
    byId('review-list').replaceChildren(...summary.filter(([, value]) => value).map(([name, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = name;
      detail.textContent = value;
      row.append(term, detail);
      return row;
    }));
  }

  for (const field of [fields.school, person, fields.phone]) {
    field.addEventListener('input', () => field.setCustomValidity(''));
  }
  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (demoStep === 'details') {
      fields.school.setCustomValidity(fields.school.value.trim() ? '' : 'Enter your school name.');
      person.setCustomValidity(person.value.trim() ? '' : 'Enter your name.');
      const phone = fields.phone.value.trim();
      const phoneDigits = phone.replace(/\D/g, '');
      fields.phone.setCustomValidity(/^[+\d\s()-]+$/.test(phone) && phoneDigits.length >= 10 && phoneDigits.length <= 15 ? '' : 'Enter a phone number with 10 to 15 digits.');
      if (!demoForm.reportValidity()) return;
      drawReview();
      setDemoStep('review');
      return;
    }
    if (demoStep !== 'review' || send.disabled) return;

    const data = Object.fromEntries(new FormData(demoForm));
    send.disabled = true;
    edit.disabled = true;
    send.textContent = 'Sending…';
    error.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(demoForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Demo request was not accepted');
      byId('review-list').replaceChildren();
      demoForm.reset();
      setDemoStep('success');
    } catch {
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
      send.disabled = false;
      edit.disabled = false;
      send.textContent = 'Request a demo';
    }
  });
  edit.addEventListener('click', () => setDemoStep('details'));
  byId('reset-demo').addEventListener('click', () => {
    history.replaceState(history.state, '', location.pathname);
    pilotRequested = false;
    updatePilot();
    setDemoStep('details');
  });
  for (const name of ['plan', 'billing']) {
    const selection = pageParams.get(name);
    const select = fields.namedItem(name);
    if (Array.from(select.options).some((option) => option.value === selection)) {
      select.value = selection;
    }
  }
  fields.plan.addEventListener('change', updatePilot);
  updatePilot();
  demoForm.querySelector('fieldset').disabled = false;
  demoForm.querySelector('.form-cta').disabled = false;
}

const legacyPages = new Map([
  ['features', '/workflows'], ['solutions', '/workflows'], ['workflows', '/workflows'],
  ['product', '/tour'], ['tour', '/tour'], ['mobile', '/mobile-app'], ['mobile-app', '/mobile-app'],
  ['pricing', '/pricing'], ['faq', '/faq'], ['demo', '/demo'],
]);
const legacyPage = legacyPages.get(location.hash.slice(1));
if (location.pathname === '/' && legacyPage) location.replace(legacyPage + location.search);

if (byId('tour-panel')) initTour();
if (byId('phone-image')) initMobilePreview();
if (byId('pricing')) initPricing();
if (byId('demo-form')) initDemo();
