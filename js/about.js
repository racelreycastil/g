const stats = [
  ['Items in your cart', cartCount()],
  ['Auctions you lead', Object.values(read('auctions', {})).filter(a => a.mine).length],
  ['Trade offers sent', Object.keys(read('offers', {})).length],
  ['Lessons you voted on', Object.values(read('votes', {})).filter(v => v !== 0).length],
  ['Messages sent to support', read('messages', []).length]
];
document.getElementById('stats').innerHTML = stats.map(s => '<li>' + s[0] + ': <strong>' + s[1] + '</strong></li>').join('');
