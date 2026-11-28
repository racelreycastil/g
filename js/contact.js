const form = document.getElementById('contact-form');
const byId = id => document.getElementById(id);
const setErr = (id, msg) => {
  byId(id + '-err').textContent = msg;
  return !msg;
};

const drawSent = () => {
  const list = read('messages', []);
  byId('sent-panel').hidden = list.length === 0;
  byId('sent-list').innerHTML = list.slice(0, 5).map(m => `<li>
    <strong>${esc(m.ref)}</strong> &middot; ${esc(m.topic)}
    <span class="small">${new Date(m.t).toLocaleString()}</span>
    <span class="small">${esc(m.text.slice(0, 90))}</span>
  </li>`).join('');
};

const validate = () => {
  const name = byId('c-name').value.trim();
  const email = byId('c-email').value.trim();
  const order = byId('c-order').value.trim();
  const text = byId('c-message').value.trim();
  let ok = true;
  ok = setErr('c-name', name.length < 2 ? 'Enter your name.' : '') && ok;
  ok = setErr('c-email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Enter a valid email like name@example.com.') && ok;
  ok = setErr('c-order', order && !/^SK-\d{6}$/.test(order) ? 'Order numbers look like SK-123456.' : '') && ok;
  ok = setErr('c-message', text.length < 10 ? 'Write at least 10 characters.' : '') && ok;
  return ok;
};

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;
  const ref = 'MSG-' + Math.floor(100000 + Math.random() * 900000);
  const list = read('messages', []);
  list.unshift({
    ref: ref,
    name: byId('c-name').value.trim(),
    email: byId('c-email').value.trim(),
    topic: byId('c-topic').value,
    text: byId('c-message').value.trim(),
    t: Date.now()
  });
  save('messages', list);
  byId('sent-ref').textContent = ref;
  byId('sent-msg').hidden = false;
  logEvent('Message ' + ref + ' sent to support', true);
  form.reset();
  prefill();
  drawSent();
});

byId('clear-msgs').addEventListener('click', () => {
  localStorage.removeItem('messages');
  byId('sent-msg').hidden = true;
  drawSent();
  toast('Message history cleared');
});

const prefill = () => {
  const u = getUser();
  if (!u) return;
  byId('c-name').value = u.name;
  byId('c-email').value = u.email;
};

prefill();
drawSent();
