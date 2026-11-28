const read = (k, d) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v === null ? d : v;
  } catch (e) {
    return d;
  }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const money = n => '$' + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const themes = ['light', 'dark', 'sand'];

const getUser = () => read('user', null);
const getCart = () => read('cart', []);
const cartCount = () => getCart().reduce((n, i) => n + i.qty, 0);
const cartTotal = () => getCart().reduce((n, i) => n + i.qty * i.price, 0);
const soldOf = p => p.sold + (read('sold', {})[p.id] || 0);

const ago = t => {
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.floor(m / 60);
  return h < 24 ? h + ' hr ago' : Math.floor(h / 24) + ' d ago';
};

const toast = msg => {
  let box = document.getElementById('toast');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast';
    document.body.appendChild(box);
  }
  box.textContent = msg;
  box.className = 'show';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { box.className = ''; }, 2800);
};

const renderEvents = (ul, n) => {
  ul.innerHTML = '';
  read('events', []).slice(0, n).forEach(e => {
    const li = document.createElement('li');
    li.textContent = e.text;
    if (!e.read) li.className = 'unread';
    const s = document.createElement('span');
    s.className = 'small';
    s.textContent = ago(e.t);
    li.appendChild(s);
    ul.appendChild(li);
  });
};

const refreshHeader = () => {
  const n = cartCount();
  const cc = document.getElementById('cart-count');
  cc.textContent = n;
  cc.hidden = n === 0;
  const unread = read('events', []).filter(e => !e.read).length;
  const bc = document.getElementById('bell-count');
  bc.textContent = unread;
  bc.hidden = unread === 0;
  const u = getUser();
  document.getElementById('auth-link').textContent = u ? 'Log out (' + u.name + ')' : 'Log in';
  document.getElementById('theme-btn').textContent = 'Theme: ' + document.documentElement.dataset.theme;
  const items = document.getElementById('cart-items');
  if (items) items.textContent = n;
  const sum = document.getElementById('cart-sum');
  if (sum) sum.textContent = money(cartTotal());
};

const logEvent = (text, notify) => {
  const list = read('events', []);
  list.unshift({ text: text, t: Date.now(), read: !notify });
  save('events', list.slice(0, 30));
  refreshHeader();
  const home = document.getElementById('home-events');
  if (home) renderEvents(home, 8);
  if (notify) toast(text);
};

const setCart = list => {
  save('cart', list);
  refreshHeader();
};

const addToCart = item => {
  const list = getCart();
  const found = list.find(i => i.id === item.id);
  if (found) found.qty += 1;
  else list.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 });
  setCart(list);
  toast(item.name + ' added to cart');
  logEvent('You added ' + item.name + ' to your cart', false);
};

const requireLogin = () => {
  if (getUser()) return true;
  sessionStorage.setItem('next', location.pathname.split('/').pop() || 'index.html');
  toast('Please log in first');
  setTimeout(() => { location.href = 'login.html'; }, 900);
  return false;
};

const logout = () => {
  localStorage.removeItem('user');
  logEvent('You logged out', false);
  toast('You are logged out');
  refreshHeader();
  document.dispatchEvent(new Event('authchange'));
};

const productCard = p => `<div class="item">
  <img src="images/${p.img}" alt="${p.name}" />
  <h3>${p.name}</h3>
  <p class="small">${p.cat} &middot; Sold: <span data-sold="${p.id}">${soldOf(p)}</span></p>
  <p>${money(p.price)}</p>
  <button class="button" type="button" data-add="${p.id}">Add to Cart</button>
</div>`;

const bindAdd = root => {
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const p = PRODUCTS.find(x => x.id === b.dataset.add);
    addToCart({ id: p.id, name: p.name, price: p.price, img: p.img });
  });
};

if (read('events', null) === null) {
  const now = Date.now();
  save('events', [
    { text: 'MakerMia posted a trade for a Microcontroller Board', t: now - 5 * 60000, read: false },
    { text: 'Rare Vacuum Tube just received a new bid', t: now - 14 * 60000, read: false },
    { text: 'New tutorial: Build Your First Circuit', t: now - 3600000, read: false },
    { text: 'Welcome to Skrapyard', t: now - 7200000, read: true }
  ]);
}

const bellBtn = document.getElementById('bell');
const eventsBox = document.getElementById('events-box');

bellBtn.addEventListener('click', e => {
  e.stopPropagation();
  eventsBox.hidden = !eventsBox.hidden;
  if (eventsBox.hidden) return;
  renderEvents(document.getElementById('bell-list'), 8);
  const list = read('events', []);
  list.forEach(x => { x.read = true; });
  save('events', list);
  refreshHeader();
});

document.addEventListener('click', e => {
  if (!eventsBox.contains(e.target)) eventsBox.hidden = true;
});

document.getElementById('theme-btn').addEventListener('click', () => {
  const now = document.documentElement.dataset.theme;
  const next = themes[(themes.indexOf(now) + 1) % themes.length];
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  refreshHeader();
});

document.getElementById('auth-link').addEventListener('click', e => {
  if (!getUser()) return;
  e.preventDefault();
  logout();
});

refreshHeader();
