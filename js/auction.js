const grid = document.getElementById('auction-grid');
const load = () => read('auctions', {});

const start = () => {
  const s = load();
  AUCTIONS.forEach(a => {
    if (!s[a.id]) s[a.id] = { price: a.price, bids: 0, mine: false, trend: a.trend, ends: Date.now() + a.seconds * 1000, done: false, claimed: false };
  });
  save('auctions', s);
};

const clock = n => {
  const h = String(Math.floor(n / 3600)).padStart(2, '0');
  const m = String(Math.floor((n % 3600) / 60)).padStart(2, '0');
  const s = String(n % 60).padStart(2, '0');
  return h + ':' + m + ':' + s;
};

const draw = () => {
  grid.innerHTML = AUCTIONS.map(a => `<div class="item" id="${a.id}">
    <img src="images/${a.img}" alt="${a.name}" />
    <h3>${a.name}</h3>
    <p class="small">by ${a.brand}</p>
    <p class="price"></p>
    <p class="small bids"></p>
    <p class="timer"></p>
    <button class="button" type="button" data-id="${a.id}"></button>
  </div>`).join('');
};

const paint = (a, st, left) => {
  const box = document.getElementById(a.id);
  const price = box.querySelector('.price');
  price.className = 'price ' + st.trend;
  price.textContent = (st.trend === 'up' ? '\u25B2 ' : '\u25BC ') + money(st.price);
  box.querySelector('.bids').textContent = st.bids + (st.bids === 1 ? ' bid' : ' bids') + (st.mine ? ' \u00B7 you lead' : '');
  box.querySelector('.timer').textContent = left > 0 ? 'Ends in ' + clock(left) : 'Auction ended';
  const btn = box.querySelector('button');
  btn.disabled = false;
  if (left > 0) {
    btn.dataset.mode = 'bid';
    btn.textContent = 'Bid ' + money(st.price + a.inc);
  } else if (st.mine && !st.claimed) {
    btn.dataset.mode = 'win';
    btn.textContent = 'You Won - Add to Cart';
  } else {
    btn.dataset.mode = 'none';
    btn.disabled = true;
    btn.textContent = st.claimed ? 'In Your Cart' : 'Ended';
  }
};

const tick = () => {
  const s = load();
  AUCTIONS.forEach(a => {
    const st = s[a.id];
    const left = Math.max(0, Math.floor((st.ends - Date.now()) / 1000));
    if (left === 0 && !st.done) {
      st.done = true;
      if (st.mine) logEvent('You won ' + a.name + ' for ' + money(st.price) + '. Add it to your cart.', true);
    }
    paint(a, st, left);
  });
  save('auctions', s);
};

grid.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b || b.dataset.mode === 'none') return;
  const a = AUCTIONS.find(x => x.id === b.dataset.id);
  const s = load();
  const st = s[a.id];
  if (b.dataset.mode === 'win') {
    addToCart({ id: a.id, name: a.name, price: st.price, img: a.img });
    st.claimed = true;
    save('auctions', s);
    tick();
    return;
  }
  if (!requireLogin()) return;
  if (st.mine) {
    toast('You already lead this auction');
    return;
  }
  st.price = Math.round((st.price + a.inc) * 100) / 100;
  st.bids += 1;
  st.mine = true;
  st.trend = 'up';
  save('auctions', s);
  logEvent('You bid ' + money(st.price) + ' on ' + a.name, false);
  toast('Bid placed: ' + money(st.price));
  tick();
});

document.getElementById('reset').addEventListener('click', () => {
  localStorage.removeItem('auctions');
  start();
  tick();
  toast('Auctions reset');
});

setInterval(() => {
  const s = load();
  const live = AUCTIONS.filter(a => s[a.id].ends > Date.now());
  if (!live.length) return;
  const a = live[Math.floor(Math.random() * live.length)];
  const st = s[a.id];
  const wasMine = st.mine;
  st.price = Math.round((st.price + a.inc) * 100) / 100;
  st.bids += 1;
  st.mine = false;
  st.trend = 'up';
  live.forEach(o => {
    if (o.id !== a.id && Math.random() < 0.3) s[o.id].trend = 'down';
  });
  save('auctions', s);
  if (wasMine) logEvent('You were outbid on ' + a.name + ' at ' + money(st.price), true);
  else logEvent('New bid on ' + a.name + ': ' + money(st.price), false);
  tick();
}, 14000);

start();
draw();
tick();
setInterval(tick, 1000);
