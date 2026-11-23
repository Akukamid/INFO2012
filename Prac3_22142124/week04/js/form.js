'use strict';

// Script is loaded at the end of body, after all these elements exist.
const form = document.querySelector('#registration-form');
const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
const subjectCount = document.getElementById('subject-count');
const creditPoints = document.getElementById('credit-points');
const enrolmentFee = document.getElementById('enrolment-fee');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const showPassword = document.getElementById('show-password');
const notes = document.getElementById('notes');
const notesCount = document.getElementById('notes-count');
const notesLimit = 50;

function formatAUD(amount) {
  return amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
}

// TASK 1: Recompute from checked inputs rather than accumulating on each click.
function getSubjectTotals() {
  let count = 0;
  let points = 0;
  let fee = 0;
  subjectCheckboxes.forEach(subject => {
    if (subject.checked) {
      count += 1;
      // dataset values are strings; Number prevents accidental concatenation.
      points += Number(subject.dataset.cp);
      fee += Number(subject.dataset.cost);
    }
  });
  return { count, points, fee };
}

function updateFees() {
  const totals = getSubjectTotals();
  subjectCount.textContent = totals.count;
  creditPoints.textContent = totals.points;
  enrolmentFee.textContent = formatAUD(totals.fee);
}
subjectCheckboxes.forEach(subject => subject.addEventListener('change', updateFees));

// TASK 2: This masks/reveals characters; it is not password encryption.
function updatePasswordVisibility() {
  const type = showPassword.checked ? 'text' : 'password';
  password.type = type;
  confirmPassword.type = type;
}
showPassword.addEventListener('change', updatePasswordVisibility);

// TASK 3: An empty custom message clears this specific custom error.
function checkPasswordMatch() {
  confirmPassword.setCustomValidity(
    confirmPassword.value !== password.value ? 'Passwords do not match' : ''
  );
}
confirmPassword.addEventListener('input', checkPasswordMatch);
// Recheck both ways, including when the original password changes later.
password.addEventListener('input', checkPasswordMatch);

// TASK 4: Advisory counter; the task does not ask us to enforce maxlength.
function updateNotesCount() {
  const count = notes.value.length;
  notesCount.textContent = `${count} / ${notesLimit}`;
  notesCount.style.color = count >= notesLimit ? '#dc3545' : '#666666';
}
notes.addEventListener('input', updateNotesCount);

function clearSummary() {
  const previous = document.getElementById('registration-summary');
  if (previous) previous.remove();
}
// Editing after a preview removes it so stale data is not presented as current.
form.addEventListener('input', clearSummary);
form.addEventListener('change', clearSummary);

// TASK 5: Cancel navigation for BOTH invalid and valid submissions.
form.addEventListener('submit', event => {
  event.preventDefault();
  clearSummary();
  checkPasswordMatch();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const degree = document.getElementById('degree');
  const year = document.querySelector('input[name="year"]:checked');
  const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
    .map(skill => skill.value);
  const totals = getSubjectTotals();

  const panel = document.createElement('section');
  panel.id = 'registration-summary';
  panel.setAttribute('aria-labelledby', 'summary-heading');
  panel.setAttribute('tabindex', '-1');
  const heading = document.createElement('h2');
  heading.id = 'summary-heading';
  heading.textContent = 'Registration Summary';
  panel.appendChild(heading);
  const list = document.createElement('dl');

  // textContent treats user entries as text, rather than executable HTML.
  function addEntry(label, value) {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = value;
    list.appendChild(term);
    list.appendChild(description);
  }
  addEntry('Full name', document.getElementById('full-name').value);
  addEntry('Email', document.getElementById('email').value);
  addEntry('Degree program', degree.options[degree.selectedIndex].textContent);
  addEntry('Year of study', year.value === '4' ? 'Year 4+' : `Year ${year.value}`);
  addEntry('Skills', skills.length ? skills.join(', ') : 'None selected');
  addEntry('Password', '*'.repeat(password.value.length));
  addEntry('Subjects selected', String(totals.count));
  addEntry('Credit points', String(totals.points));
  addEntry('Enrolment fee', formatAUD(totals.fee));
  panel.appendChild(list);
  const message = document.createElement('p');
  message.textContent = 'Local review only. No account was created and no form data was sent.';
  panel.appendChild(message);
  form.insertAdjacentElement('afterend', panel);
  panel.focus();
});

// The reset event fires before native controls reset. Update afterwards.
form.addEventListener('reset', () => {
  clearSummary();
  queueMicrotask(() => {
    confirmPassword.setCustomValidity('');
    updatePasswordVisibility();
    updateFees();
    updateNotesCount();
  });
});

updateFees();
updatePasswordVisibility();
updateNotesCount();
// Enable submission only after the script has initialised successfully.
form.querySelector('button[type="submit"]').disabled = false;
