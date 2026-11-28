const box = document.getElementById('cart-box');
const done = document.getElementById('order-done');
const shipping = sub => (sub === 0 || sub >= 50 ? 0 : 3.99);

const draw = () => {
  const list = getCart();
  if (!list.length) {
    box.innerHTML = '<p>Your cart is empty.</p><a class="button" href="shop.html">Browse the Shop</a>';
    return;
  }
  const sub = cartTotal();
  const ship = shipping(sub);
  box.innerHTML = list.map(i => `<div class="cart-row">
    <img src="images/${i.img}" alt="${esc(i.name)}" />
    <div>
      <h3>${esc(i.name)}</h3>
      <p class="small">${money(i.price)} each</p>
    </div>
    <div class="qty">
      <button class="mini" type="button" data-act="dec" data-id="${i.id}">-</button>
      <span>${i.qty}</span>
      <button class="mini" type="button" data-act="inc" data-id="${i.id}">+</button>
    </div>
    <strong>${money(i.price * i.qty)}</strong>
    <button class="mini" type="button" data-act="del" data-id="${i.id}">Remove</button>
  </div>`).join('') + `<div class="totals">
    <p><span>Subtotal</span><span>${money(sub)}</span></p>
    <p><span>Shipping</span><span>${ship ? money(ship) : 'Free'}</span></p>
    <p class="grand"><span>Total</span><span>${money(sub + ship)}</span></p>
    <p class="small">Free shipping on orders of $50 or more.</p>
  </div>
  <button class="button" type="button" data-act="checkout">Checkout</button>
  <button class="button" type="button" data-act="clear">Clear Cart</button>`;
};

const checkout = () => {
  if (!requireLogin()) return;
  const list = getCart();
  const sub = cartTotal();
  const total = sub + shipping(sub);
  const ref = 'SK-' + Math.floor(100000 + Math.random() * 900000);
  const sold = read('sold', {});
  list.forEach(i => { sold[i.id] = (sold[i.id] || 0) + i.qty; });
  save('sold', sold);
  setCart([]);
  document.getElementById('order-ref').textContent = ref;
  document.getElementById('order-total').textContent = money(total);
  done.hidden = false;
  logEvent('Order ' + ref + ' placed for ' + money(total), true);
  draw();
};

box.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'checkout') {
    checkout();
    return;
  }
  if (act === 'clear') {
    setCart([]);
    toast('Cart cleared');
    draw();
    return;
  }
  let list = getCart();
  const item = list.find(i => i.id === b.dataset.id);
  if (act === 'inc') item.qty += 1;
  if (act === 'dec') item.qty -= 1;
  if (act === 'del') item.qty = 0;
  list = list.filter(i => i.qty > 0);
  setCart(list);
  draw();
});

draw();
