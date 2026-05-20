// ===== CART PERSISTENCE =====
// cart lives in localStorage so it survives page navigation

function saveCart() {
  localStorage.setItem('ue-cart', JSON.stringify(cart));
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem('ue-cart')) || []; }
  catch { return []; }
}

let cart = loadCart();


// ===== NAVBAR BADGE =====
// Called on every page to keep the icon count in sync

function updateNavbarBadge() {
  const badge = document.getElementById('kurv-badge');
  if (!badge) return;
  const count = cart.reduce((sum, c) => sum + c.quantity, 0);
  badge.textContent  = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}


// ===== HOMEPAGE =====

let activeTag  = null;
let activeSort = null;

function sortList(list) {
  if (activeSort === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
  if (activeSort === 'pris')   return [...list].sort((a, b) => a.price.length - b.price.length);
  return list;
}

function renderHomepage() {
  const grid = document.getElementById('restauranter-grid');
  if (!grid) return;

  const filtered = activeTag
    ? restaurants.filter(r => r.tags.includes(activeTag))
    : restaurants;

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="ingen-resultater">Ingen restauranter matcher denne kategori.</p>';
    return;
  }

  grid.innerHTML = sortList(filtered).map(r => `
    <a href="restaurant.html?id=${r.id}" class="restaurant-kort">
      <div class="kort-billede-wrapper">
        <img src="${r.image}" alt="${r.name}" loading="lazy">
        <button class="favorit-knap${r.favorite ? ' aktiv' : ''}"
                aria-label="Tilføj til favoritter"
                onclick="toggleFavorit(event, '${r.id}')">
          <i class="fa-${r.favorite ? 'solid' : 'regular'} fa-heart"></i>
        </button>
      </div>
      <div class="kort-info">
        <h3>${r.name}</h3>
        <p class="kort-kategori">${r.category}</p>
        <p class="kort-meta">
          <span><i class="fa-solid fa-star"></i> ${r.rating}</span>
          <span class="dot">·</span>
          <span>${r.delivery}</span>
          <span class="dot">·</span>
          <span>${r.price}</span>
        </p>
      </div>
    </a>
  `).join('');
}

function initPillFilters() {
  const sortMap = { 'rating': 'rating', 'pris': 'pris' };

  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.textContent.trim().toLowerCase();
      const sort = sortMap[key] ?? null;

      if (activeSort === sort) {
        activeSort = null;
        pill.classList.remove('aktiv');
      } else {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('aktiv'));
        activeSort = sort;
        pill.classList.add('aktiv');
      }
      renderHomepage();
    });
  });
}

function initCategoryFilters() {
  document.querySelectorAll('.kategori').forEach(el => {
    el.addEventListener('click', () => {
      const tag = el.querySelector('span').textContent.trim();
      if (activeTag === tag) {
        activeTag = null;
        el.classList.remove('aktiv');
      } else {
        document.querySelectorAll('.kategori').forEach(k => k.classList.remove('aktiv'));
        activeTag = tag;
        el.classList.add('aktiv');
      }
      renderHomepage();
    });
  });
}

function toggleFavorit(event, id) {
  event.preventDefault();
  const r = restaurants.find(r => r.id === id);
  r.favorite = !r.favorite;
  renderHomepage();
}


// ===== RESTAURANT PAGE =====

let currentRestaurant = null;

function renderRestaurantPage() {
  const params = new URLSearchParams(window.location.search);
  currentRestaurant = restaurants.find(r => r.id === params.get('id'));

  const content = document.getElementById('restaurant-content');
  if (!currentRestaurant) {
    content.innerHTML = '<p style="padding:2rem">Restaurant ikke fundet.</p>';
    return;
  }

  document.title = `${currentRestaurant.name} – UberEats`;
  document.getElementById('restaurant-hero-img').src        = currentRestaurant.image;
  document.getElementById('restaurant-hero-img').alt         = currentRestaurant.name;
  document.getElementById('restaurant-navn').textContent     = currentRestaurant.name;
  document.getElementById('restaurant-kategori').textContent = currentRestaurant.category;
  document.getElementById('restaurant-rating').textContent   = currentRestaurant.rating;
  document.getElementById('restaurant-delivery').textContent = currentRestaurant.delivery;
  document.getElementById('restaurant-price').textContent    = currentRestaurant.price;
  document.getElementById('restaurant-description').textContent = currentRestaurant.description;

  document.getElementById('restaurant-menu').innerHTML = currentRestaurant.menu.map(section => `
    <div class="menu-sektion">
      <h3 class="menu-sektion-titel">${section.category}</h3>
      <div class="menu-items">
        ${section.items.map(item => `
          <div class="menu-item">
            <div class="menu-item-info">
              <h4>${item.name}</h4>
              ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="menu-item-pris-knap">
              <span class="menu-item-pris">${item.price} kr.</span>
              <button class="menu-tilføj-knap"
                      aria-label="Tilføj ${item.name}"
                      onclick="addToCart('${item.id}')">+</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  renderSidebarCart();
}


// ===== CART LOGIC =====

function findItem(itemId) {
  for (const section of currentRestaurant.menu) {
    const item = section.items.find(i => i.id === itemId);
    if (item) return item;
  }
  return null;
}

function addToCart(itemId) {
  const existing = cart.find(c => c.id === itemId);

  if (existing) {
    // Item already in cart — just bump the count (works on both restaurant + kurv page)
    existing.quantity++;
  } else if (currentRestaurant) {
    // New item — look it up in the current restaurant data
    const item = findItem(itemId);
    if (!item) return;
    cart.push({ id: itemId, name: item.name, price: item.price, quantity: 1 });
  }

  saveCart();
  updateNavbarBadge();

  if (document.getElementById('kurv-indhold'))  renderKurvPage();
  else                                           renderSidebarCart();
}

function removeFromCart(itemId) {
  const existing = cart.find(c => c.id === itemId);
  if (!existing) return;

  if (existing.quantity > 1) {
    existing.quantity--;
  } else {
    cart = cart.filter(c => c.id !== itemId);
  }

  saveCart();
  updateNavbarBadge();

  if (document.getElementById('kurv-indhold'))  renderKurvPage();
  else                                           renderSidebarCart();
}


// ===== SIDEBAR CART (restaurant page) =====

function renderSidebarCart() {
  const tomEl    = document.getElementById('cart-tom');
  const itemsEl  = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const totalEl  = document.getElementById('cart-total');
  if (!itemsEl) return;

  if (cart.length === 0) {
    tomEl.style.display    = 'block';
    itemsEl.innerHTML      = '';
    footerEl.style.display = 'none';
    return;
  }

  tomEl.style.display    = 'none';
  footerEl.style.display = 'block';

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  totalEl.textContent = `${total} kr.`;

  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-antal">${c.quantity}×</span>
        <span class="cart-item-navn">${c.name}</span>
      </div>
      <div class="cart-item-højre">
        <span class="cart-item-pris">${c.price * c.quantity} kr.</span>
        <div class="cart-item-kontrol">
          <button onclick="removeFromCart('${c.id}')" aria-label="Fjern én">−</button>
          <button onclick="addToCart('${c.id}')"     aria-label="Tilføj én">+</button>
        </div>
      </div>
    </div>
  `).join('');
}


// ===== KURV PAGE =====

const LEVERING = 29;

function renderKurvPage() {
  const indhold = document.getElementById('kurv-indhold');
  if (!indhold) return;

  if (cart.length === 0) {
    indhold.innerHTML = `
      <div class="kurv-tom-side">
        <p>Din kurv er tom.</p>
        <a href="index.html" class="kurv-tom-knap">Se restauranter →</a>
      </div>`;
    return;
  }

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const total    = subtotal + LEVERING;

  indhold.innerHTML = `
    <div class="kurv-layout">

      <div class="kurv-items-wrapper">
        <h2 class="kurv-titel">Din kurv</h2>
        ${cart.map(c => `
          <div class="kurv-item">
            <div class="kurv-item-info">
              <span class="kurv-item-navn">${c.name}</span>
              <span class="kurv-item-enhedspris">${c.price} kr. pr. stk.</span>
            </div>
            <div class="kurv-item-kontrol">
              <button onclick="removeFromCart('${c.id}')" aria-label="Fjern én">−</button>
              <span class="kurv-item-antal">${c.quantity}</span>
              <button onclick="addToCart('${c.id}')" aria-label="Tilføj én">+</button>
            </div>
            <span class="kurv-item-total">${c.price * c.quantity} kr.</span>
          </div>
        `).join('')}
      </div>

      <div class="kurv-opsummering">
        <h3>Ordreopsummering</h3>
        <div class="kurv-linje">
          <span>Subtotal</span>
          <span>${subtotal} kr.</span>
        </div>
        <div class="kurv-linje">
          <span>Levering</span>
          <span>${LEVERING} kr.</span>
        </div>
        <div class="kurv-linje kurv-linje-total">
          <span>Total</span>
          <span>${total} kr.</span>
        </div>
        <button class="kurv-betaling-knap"
                onclick="window.location.href='checkout.html'">
          Gå til betaling →
        </button>
      </div>

    </div>`;
}


// ===== CHECKOUT PAGE =====

let tipProcent = 0;

function showPaymentTab(tab) {
  document.querySelectorAll('.betaling-tab-indhold').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.betaling-tab-knap').forEach(el => el.classList.remove('aktiv'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  document.querySelector(`.betaling-tab-knap[data-tab="${tab}"]`).classList.add('aktiv');
}

function vælgTip(pct) {
  tipProcent = pct;
  document.querySelectorAll('.tip-knap').forEach(btn => btn.classList.remove('aktiv'));
  document.querySelector(`.tip-knap[data-tip="${pct}"]`).classList.add('aktiv');
  document.getElementById('tip-linje').style.display = pct > 0 ? 'flex' : 'none';
  updateCheckoutTotals();
}

function updateCheckoutTotals() {
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const tip      = Math.round(subtotal * tipProcent / 100);
  const total    = subtotal + LEVERING + tip;

  document.getElementById('checkout-subtotal').textContent = `${subtotal} kr.`;
  document.getElementById('checkout-levering').textContent = `${LEVERING} kr.`;
  document.getElementById('checkout-tip').textContent      = `${tip} kr.`;
  document.getElementById('checkout-total').textContent    = `${total} kr.`;
}

function renderCheckoutPage() {
  const itemsEl = document.getElementById('checkout-items');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="color:#888;font-size:.9rem;padding:.5rem 0">Ingen varer i kurven.</p>';
  } else {
    itemsEl.innerHTML = cart.map(c => `
      <div class="checkout-item">
        <span>${c.quantity}× ${c.name}</span>
        <span>${c.price * c.quantity} kr.</span>
      </div>
    `).join('');
  }

  updateCheckoutTotals();
}


// ===== BEKRÆFTELSE PAGE =====

function renderBekræftelsePage() {
  const el = document.getElementById('bekræftelse-content');
  if (!el) return;

  // Save order snapshot (items + totals) before clearing cart
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const savedTip = parseInt(localStorage.getItem('ue-tip') || '0', 10);
  const tip      = Math.round(subtotal * savedTip / 100);
  const total    = subtotal + LEVERING + tip;

  const order = {
    number:   Math.floor(100000 + Math.random() * 900000),
    items:    [...cart],
    subtotal,
    levering: LEVERING,
    tip,
    total,
    time:     Date.now(),
  };

  // Only save + clear cart on first load (not on refresh)
  if (!localStorage.getItem('ue-last-order')) {
    localStorage.setItem('ue-last-order', JSON.stringify(order));
    cart = [];
    saveCart();
    updateNavbarBadge();
  }

  const saved = JSON.parse(localStorage.getItem('ue-last-order'));

  // Estimated delivery: order time + 30 min
  const eta = new Date(saved.time + 30 * 60 * 1000);
  const etaStr = eta.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });

  el.innerHTML = `
    <div class="bekræftelse-hero">
      <div class="bekræftelse-cirkel">
        <i class="fa-solid fa-check"></i>
      </div>
      <h1>Ordre bekræftet!</h1>
      <p>Tak for din bestilling. Vi er allerede i gang.</p>
    </div>

    <div class="bekræftelse-info-rad">
      <div class="bekræftelse-info-boks">
        <div class="info-label">Ordrenummer</div>
        <div class="info-value">#${saved.number}</div>
      </div>
      <div class="bekræftelse-info-boks">
        <div class="info-label">Forventet levering</div>
        <div class="info-value">~${etaStr}</div>
      </div>
    </div>

    <div class="bekræftelse-recap">
      <h3>Din ordre</h3>
      ${saved.items.map(c => `
        <div class="bekræftelse-recap-item">
          <span>${c.quantity}× ${c.name}</span>
          <span>${c.price * c.quantity} kr.</span>
        </div>
      `).join('')}
      <div class="bekræftelse-recap-linje">
        <span>Subtotal</span><span>${saved.subtotal} kr.</span>
      </div>
      <div class="bekræftelse-recap-linje">
        <span>Levering</span><span>${saved.levering} kr.</span>
      </div>
      ${saved.tip > 0 ? `
      <div class="bekræftelse-recap-linje">
        <span>Drikkepenge</span><span>${saved.tip} kr.</span>
      </div>` : ''}
      <div class="bekræftelse-recap-total">
        <span>Total</span><span>${saved.total} kr.</span>
      </div>
    </div>

    <a href="levering.html" class="bekræftelse-spor-knap">Spor din ordre →</a>
  `;
}


// ===== INIT =====

updateNavbarBadge();

if (document.getElementById('restauranter-grid')) {
  renderHomepage();
  initCategoryFilters();
  initPillFilters();
} else if (document.getElementById('restaurant-menu')) {
  renderRestaurantPage();
} else if (document.getElementById('kurv-indhold')) {
  renderKurvPage();
} else if (document.getElementById('checkout-items')) {
  renderCheckoutPage();
} else if (document.getElementById('bekræftelse-content')) {
  renderBekræftelsePage();
}
