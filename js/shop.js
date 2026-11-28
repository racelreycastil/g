const grid = document.getElementById('product-grid');
const search = document.getElementById('search');
const cat = document.getElementById('category');
const sort = document.getElementById('sort');
const count = document.getElementById('result-count');

cat.innerHTML = ['All'].concat([...new Set(PRODUCTS.map(p => p.cat))]).map(c => '<option>' + c + '</option>').join('');

const draw = () => {
  const q = search.value.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (cat.value === 'All' || p.cat === cat.value) && p.name.toLowerCase().includes(q));
  if (sort.value === 'low') list.sort((a, b) => a.price - b.price);
  if (sort.value === 'high') list.sort((a, b) => b.price - a.price);
  if (sort.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  grid.innerHTML = list.map(productCard).join('') || '<p>No parts match your search.</p>';
  count.textContent = list.length + ' parts';
};

[search, cat, sort].forEach(el => el.addEventListener('input', draw));
bindAdd(grid);
draw();
refreshHeader();

setInterval(() => {
  const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const sold = read('sold', {});
  sold[p.id] = (sold[p.id] || 0) + 1;
  save('sold', sold);
  const el = document.querySelector('[data-sold="' + p.id + '"]');
  if (el) el.textContent = soldOf(p);
  logEvent('Someone just bought ' + p.name, true);
}, 20000);
