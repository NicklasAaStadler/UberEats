function loadCart() {
  try { return JSON.parse(localStorage.getItem('ue-cart')) || []; }
  catch { return []; }
}

let cart = loadCart();

function cartTotals({ tipPct = 0, withLevering = true } = {}) {
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const rabatPct = getStudierabat();
  const rabat    = Math.round(subtotal * rabatPct / 100);
  const levering = withLevering ? getLevering() : 0;
  const tip      = Math.round(subtotal * tipPct / 100);
  return { subtotal, rabatPct, rabat, levering, tip, total: subtotal + levering - rabat + tip };
}