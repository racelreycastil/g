const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const emailList = document.getElementById('email-rules');
const passList = document.getElementById('pass-rules');
const err = document.getElementById('login-err');
const loggedIn = document.getElementById('logged-in');

const emailRules = [
  ['Contains one @ sign', v => v.split('@').length === 2],
  ['Has a name before the @', v => /^[^\s@]+@/.test(v)],
  ['Has a domain such as example.com', v => /@[^\s@]+\.[^\s@]{2,}$/.test(v)],
  ['Has no spaces', v => v.length > 0 && !/\s/.test(v)]
];
const passRules = [['At least 6 characters', v => v.length >= 6]];

const check = (ul, rules, value) => {
  let ok = true;
  ul.innerHTML = '';
  rules.forEach(r => {
    const good = r[1](value);
    if (!good) ok = false;
    const li = document.createElement('li');
    li.textContent = r[0];
    li.className = good ? 'ok' : '';
    ul.appendChild(li);
  });
  return ok;
};

const view = () => {
  const u = getUser();
  form.hidden = !!u;
  loggedIn.hidden = !u;
  if (u) document.getElementById('who').textContent = u.email;
};

email.addEventListener('input', () => check(emailList, emailRules, email.value.trim()));
password.addEventListener('input', () => check(passList, passRules, password.value));

document.getElementById('show-pass').addEventListener('change', e => {
  password.type = e.target.checked ? 'text' : 'password';
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = email.value.trim();
  const a = check(emailList, emailRules, value);
  const b = check(passList, passRules, password.value);
  if (!a || !b) {
    err.textContent = 'Please meet every requirement in the lists above.';
    return;
  }
  err.textContent = '';
  const name = value.split('@')[0];
  save('user', { email: value, name: name });
  logEvent('You logged in as ' + value, false);
  toast('Welcome, ' + name);
  refreshHeader();
  const next = sessionStorage.getItem('next');
  sessionStorage.removeItem('next');
  setTimeout(() => { location.href = next || 'index.html'; }, 900);
});

document.getElementById('logout-btn').addEventListener('click', logout);
document.addEventListener('authchange', view);

check(emailList, emailRules, '');
check(passList, passRules, '');
view();
