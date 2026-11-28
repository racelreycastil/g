const grid = document.getElementById('trade-grid');
const search = document.getElementById('trade-search');
const form = document.getElementById('post-form');
const mine = () => read('myTrades', []);
const offers = () => read('offers', {});

const card = t => {
  const o = offers()[t.id];
  let btn;
  if (t.mine) btn = '<button class="button" type="button" data-act="remove" data-id="' + t.id + '">Remove</button>';
  else if (o === 'sent') btn = '<button class="button" type="button" disabled>Offer Sent</button>';
  else if (o === 'accepted') btn = '<button class="button" type="button" disabled>Accepted</button>';
  else btn = '<button class="button" type="button" data-act="offer" data-id="' + t.id + '">' + (o === 'declined' ? 'Offer Again' : 'Offer Trade') + '</button>';
  return `<div class="item">
    <img src="images/${t.img}" alt="${esc(t.item)}" />
    <h3>${esc(t.item)}</h3>
    <p class="small">${t.mine ? 'Your listing' : 'Offered by ' + esc(t.user)}</p>
    <p>Wants: ${esc(t.wants)}</p>
    <p class="${t.trust >= 85 ? 'up' : 'down'}">Trust ${t.trust}% &middot; ${t.trades} trades</p>
    ${btn}
  </div>`;
};

const draw = () => {
  const q = search.value.trim().toLowerCase();
  const list = mine().concat(TRADES).filter(t => (t.item + ' ' + t.wants + ' ' + t.user).toLowerCase().includes(q));
  grid.innerHTML = list.map(card).join('') || '<p>No trades match your search.</p>';
};

const reply = t => {
  setTimeout(() => {
    const o = offers();
    if (o[t.id] !== 'sent') return;
    const yes = Math.random() < t.trust / 100;
    o[t.id] = yes ? 'accepted' : 'declined';
    save('offers', o);
    logEvent(t.user + (yes ? ' accepted' : ' declined') + ' your offer for ' + t.item, true);
    draw();
  }, 5000 + Math.random() * 6000);
};

grid.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  if (b.dataset.act === 'remove') {
    save('myTrades', mine().filter(t => t.id !== b.dataset.id));
    toast('Listing removed');
    draw();
    return;
  }
  if (!requireLogin()) return;
  const t = TRADES.find(x => x.id === b.dataset.id);
  const o = offers();
  o[t.id] = 'sent';
  save('offers', o);
  logEvent('You sent a trade offer to ' + t.user + ' for ' + t.item, false);
  toast('Offer sent to ' + t.user);
  draw();
  reply(t);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const have = document.getElementById('post-have').value.trim();
  const want = document.getElementById('post-want').value.trim();
  const err = document.getElementById('post-err');
  if (have.length < 2 || want.length < 2) {
    err.textContent = 'Fill in both fields with at least 2 characters.';
    return;
  }
  err.textContent = '';
  if (!requireLogin()) return;
  const list = mine();
  list.unshift({ id: 'm' + Date.now(), item: have, wants: want, user: getUser().name, trust: 100, trades: 0, img: 'learn-2.png', mine: true });
  save('myTrades', list);
  logEvent('You posted a trade: ' + have + ' for ' + want, false);
  toast('Trade posted');
  form.reset();
  draw();
});

search.addEventListener('input', draw);

Object.keys(offers()).forEach(id => {
  const t = TRADES.find(x => x.id === id);
  if (t && offers()[id] === 'sent') reply(t);
});

draw();
