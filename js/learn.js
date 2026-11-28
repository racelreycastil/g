const grid = document.getElementById('lesson-grid');
const kind = document.getElementById('kind');
const order = document.getElementById('order');
const votes = () => read('votes', {});
const score = l => l.score + (votes()[l.id] || 0);

kind.innerHTML = ['All'].concat([...new Set(LESSONS.map(l => l.kind))]).map(k => '<option>' + k + '</option>').join('');

const card = l => {
  const v = votes()[l.id] || 0;
  return `<div class="item" id="lesson-${l.id}">
    <img src="images/${l.img}" alt="${l.title}" />
    <h3>${l.title}</h3>
    <p class="small">${l.kind}</p>
    <div class="votes">
      <button class="vote ${v === 1 ? 'on' : ''}" type="button" data-id="${l.id}" data-v="1">&#9650;</button>
      <strong>${score(l)}</strong>
      <button class="vote dn ${v === -1 ? 'on' : ''}" type="button" data-id="${l.id}" data-v="-1">&#9660;</button>
    </div>
    <details>
      <summary>Read</summary>
      <p class="small">${l.text}</p>
    </details>
  </div>`;
};

const draw = () => {
  const list = LESSONS.filter(l => kind.value === 'All' || l.kind === kind.value);
  if (order.value === 'top') list.sort((a, b) => score(b) - score(a));
  grid.innerHTML = list.map(card).join('');
};

const paint = l => {
  const box = document.getElementById('lesson-' + l.id);
  const v = votes()[l.id] || 0;
  box.querySelector('strong').textContent = score(l);
  box.querySelector('[data-v="1"]').classList.toggle('on', v === 1);
  box.querySelector('[data-v="-1"]').classList.toggle('on', v === -1);
};

grid.addEventListener('click', e => {
  const b = e.target.closest('.vote');
  if (!b) return;
  const l = LESSONS.find(x => x.id === b.dataset.id);
  const want = Number(b.dataset.v);
  const all = votes();
  all[l.id] = all[l.id] === want ? 0 : want;
  save('votes', all);
  paint(l);
  if (all[l.id] === 0) logEvent('You removed your vote on ' + l.title, false);
  else logEvent('You ' + (want === 1 ? 'upvoted ' : 'downvoted ') + l.title, false);
});

[kind, order].forEach(el => el.addEventListener('input', draw));
draw();
