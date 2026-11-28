const PRODUCTS = [
  { id: 'p1', name: 'LED Assortment', cat: 'Components', price: 4.99, img: 'catalog-1.png', sold: 212 },
  { id: 'p2', name: 'Jumper Cables', cat: 'Cables', price: 3.49, img: 'catalog-2.png', sold: 340 },
  { id: 'p3', name: 'Soldering Iron Kit', cat: 'Tools', price: 18.0, img: 'catalog-3.png', sold: 96 },
  { id: 'p4', name: 'Microchips', cat: 'Components', price: 6.75, img: 'catalog-4.png', sold: 158 },
  { id: 'p5', name: 'Transistor Set', cat: 'Components', price: 5.25, img: 'catalog-5.png', sold: 187 },
  { id: 'p6', name: 'Breadboard', cat: 'Boards', price: 7.5, img: 'catalog-6.png', sold: 264 },
  { id: 'p7', name: 'Resistor Kit', cat: 'Components', price: 6.25, img: 'catalog-7.png', sold: 301 },
  { id: 'p8', name: 'Push Buttons', cat: 'Components', price: 2.99, img: 'catalog-8.png', sold: 143 },
  { id: 'p9', name: 'Potentiometer', cat: 'Components', price: 3.75, img: 'catalog-9.png', sold: 119 },
  { id: 'p10', name: 'Piezo Buzzer', cat: 'Components', price: 2.5, img: 'catalog-10.png', sold: 88 },
  { id: 'p11', name: 'LCD Display', cat: 'Displays', price: 9.99, img: 'catalog-11.png', sold: 74 },
  { id: 'p12', name: 'Cooling Fan', cat: 'Tools', price: 8.25, img: 'catalog-12.png', sold: 61 }
];

const AUCTIONS = [
  { id: 'a1', name: 'Vintage Capacitor Set', brand: 'Voltrix Labs', price: 42.0, inc: 2.0, seconds: 5400, trend: 'up', img: 'auction-1.png' },
  { id: 'a2', name: 'Rare Vacuum Tube', brand: 'Ohmcraft Pro', price: 28.5, inc: 1.5, seconds: 1800, trend: 'down', img: 'auction-2.png' },
  { id: 'a3', name: 'Surplus Servo Motor', brand: 'Zenith Dynamics', price: 65.0, inc: 5.0, seconds: 12600, trend: 'up', img: 'auction-3.png' },
  { id: 'a4', name: 'Audio Transformer', brand: 'Voltrix Labs', price: 54.0, inc: 3.0, seconds: 9000, trend: 'up', img: 'auction-4.png' },
  { id: 'a5', name: 'Crystal Oscillator', brand: 'Quartzline', price: 19.0, inc: 1.0, seconds: 3600, trend: 'down', img: 'auction-5.png' },
  { id: 'a6', name: 'Reed Relay Pack', brand: 'Ohmcraft Pro', price: 33.0, inc: 2.0, seconds: 7200, trend: 'up', img: 'auction-6.png' }
];

const TRADES = [
  { id: 't1', item: 'Microcontroller Board', user: 'MakerMia', wants: 'Soldering Iron Kit', trust: 96, trades: 48, img: 'trading-1.png' },
  { id: 't2', item: 'Battery Pack', user: 'VoltVince', wants: 'Breadboard', trust: 88, trades: 21, img: 'trading-2.png' },
  { id: 't3', item: 'Multimeter', user: 'CircuitSam', wants: 'Microchips', trust: 100, trades: 9, img: 'trading-3.png' },
  { id: 't4', item: 'Wire Spool', user: 'SparkySue', wants: 'Jumper Cables', trust: 92, trades: 33, img: 'trading-4.png' },
  { id: 't5', item: 'Solar Panel', user: 'GridGuy', wants: 'Battery Pack', trust: 81, trades: 14, img: 'trading-5.png' },
  { id: 't6', item: 'USB Flash Drive', user: 'ByteBen', wants: 'Cooling Fan', trust: 94, trades: 27, img: 'trading-6.png' }
];

const LESSONS = [
  { id: 'l1', title: 'Build Your First Circuit', kind: 'Tutorial', score: 24, img: 'learn-1.png', text: 'Connect a battery, a resistor, and an LED in a single loop. The resistor protects the LED, and the long leg of the LED goes toward the positive side.' },
  { id: 'l2', title: 'Sort Parts by Type', kind: 'Tip', score: 18, img: 'learn-2.png', text: 'Keep resistors, capacitors, and chips in separate tray compartments and label each one. You will spend less time searching and more time building.' },
  { id: 'l3', title: 'Homemade Desk Robot', kind: 'Cool Invention', score: 31, img: 'learn-3.png', text: 'A student built a little desk robot from leftover servos, a microcontroller, and a buzzer. It nods when your phone gets a message.' },
  { id: 'l4', title: 'Read a Datasheet in 5 Minutes', kind: 'Tutorial', score: 12, img: 'learn-4.png', text: 'Start with the pinout, then the absolute maximum ratings, then the typical circuit. Skip the rest until you need it.' },
  { id: 'l5', title: 'Soldering Safety', kind: 'Tip', score: 40, img: 'learn-5.png', text: 'Work in a ventilated room, rest the iron in its stand, and never touch the tip. Let joints cool before you move the board.' },
  { id: 'l6', title: 'Solar Phone Charger', kind: 'Cool Invention', score: 15, img: 'learn-6.png', text: 'A small solar panel, a diode, and a voltage regulator can top up a phone on a sunny day. It is a great weekend project.' }
];
