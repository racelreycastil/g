const track = document.getElementById('track');
track.innerHTML = PRODUCTS.slice(0, 6).map(productCard).join('');
bindAdd(track);
document.getElementById('prev').onclick = () => track.scrollBy({ left: -192 });
document.getElementById('next').onclick = () => track.scrollBy({ left: 192 });

const list = document.getElementById('home-events');
renderEvents(list, 8);

const pool = [
  'VoltVince accepted a trade offer',
  'A Surplus Servo Motor just received a new bid',
  'SparkySue posted a Wire Spool for trade',
  'Someone just bought a Breadboard',
  'New tip: Soldering Safety'
];

setInterval(() => {
  logEvent(pool[Math.floor(Math.random() * pool.length)], true);
}, 20000);

setInterval(() => renderEvents(list, 8), 30000);
