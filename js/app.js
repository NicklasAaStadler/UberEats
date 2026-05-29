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

let activeTag   = null;
let activeSort  = null;
let searchQuery = '';

function sortList(list) {
  if (activeSort === 'rating' || activeSort === 'populært') return [...list].sort((a, b) => b.rating - a.rating);
  if (activeSort === 'pris') return [...list].sort((a, b) => a.price.length - b.price.length);
  return list;
}

function renderHomepage() {
  const grid = document.getElementById('restauranter-grid');
  if (!grid) return;

  const q = searchQuery.toLowerCase().trim();

  const filtered = restaurants.filter(r => {
    const matchTag    = !activeTag || r.tags.includes(activeTag);
    const matchSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      (r.tags || []).some(t => t.toLowerCase().includes(q));
    const matchTilbud = activeSort !== 'tilbud' || r.studierabat > 0 || r.free_delivery;
    return matchTag && matchSearch && matchTilbud;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="ingen-resultater">Ingen restauranter matcher din søgning.</p>';
    return;
  }

  const isStudent = localStorage.getItem('role') === 'student';

  grid.innerHTML = sortList(filtered).map(r => `
    <a href="restaurant.html?id=${r.id}" class="restaurant-kort">
      <div class="kort-billede-wrapper">
        <img src="${r.image}" alt="${r.name}" loading="lazy">
        <div class="kort-badges">
          ${r.rabat ? `<span class="spar-badge">Spar ${r.rabat}%</span>` : ''}
          ${isStudent && r.studierabat ? `<span class="spar-badge studierabat-badge">🎓 ${r.studierabat}% Studierabat</span>` : ''}
          ${r.free_delivery ? `<span class="spar-badge gratis-levering-badge"><i class="fa-solid fa-truck"></i> Gratis levering</span>` : ''}
        </div>
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
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.dataset.sort;

      if (activeSort === key) {
        activeSort = null;
        pill.classList.remove('aktiv');
      } else {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('aktiv'));
        activeSort = key;
        pill.classList.add('aktiv');
      }
      renderHomepage();
    });
  });
}

function initSearchFilter() {
  const input = document.getElementById('søge-input');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value;
    renderHomepage();
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

async function toggleFavorit(event, id) {
  event.preventDefault();
  const result = await sbToggleFavorite(id);
  if (result === null) { window.location.href = 'login.html'; return; }
  const r = restaurants.find(r => r.id === id);
  if (r) r.favorite = result;
  renderHomepage();
}


// ===== RESTAURANT PAGE =====

let currentRestaurant = null;

function getStudierabat() {
  if (localStorage.getItem('role') !== 'student') return 0;
  return parseInt(localStorage.getItem('ue-studierabat') || '0', 10);
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function renderRestaurantPage() {
  const params = new URLSearchParams(window.location.search);
  currentRestaurant = await sbGetRestaurantWithMenu(params.get('id'));
  if (currentRestaurant) localStorage.setItem('ue-restaurant-id', currentRestaurant.id);

  const content = document.getElementById('restaurant-content');
  if (!currentRestaurant) {
    content.innerHTML = '<p style="padding:2rem">Restaurant ikke fundet.</p>';
    return;
  }

  document.title = `${currentRestaurant.name} – UberEats`;
  document.getElementById('restaurant-hero-img').src           = currentRestaurant.image;
  document.getElementById('restaurant-hero-img').alt            = currentRestaurant.name;
  document.getElementById('restaurant-navn').textContent        = currentRestaurant.name;
  document.getElementById('restaurant-kategori').textContent    = currentRestaurant.category;
  document.getElementById('restaurant-rating').textContent      = currentRestaurant.rating;
  document.getElementById('restaurant-delivery').textContent    = currentRestaurant.delivery;
  document.getElementById('restaurant-price').textContent       = currentRestaurant.price;
  document.getElementById('restaurant-description').textContent = currentRestaurant.description;

  localStorage.setItem('ue-studierabat', currentRestaurant.studierabat || 0);
  localStorage.setItem('ue-free-delivery', currentRestaurant.free_delivery ? 'true' : 'false');

  const studierabatWrapper = document.getElementById('restaurant-studierabat-wrapper');
  const isStudentUser = localStorage.getItem('role') === 'student';
  if (studierabatWrapper && currentRestaurant.studierabat && isStudentUser) {
    document.getElementById('restaurant-studierabat-pct').textContent = currentRestaurant.studierabat;
    studierabatWrapper.style.display = '';
  }

  const adresseEl = document.getElementById('restaurant-adresse');
  if (adresseEl && currentRestaurant.address) {
    adresseEl.textContent = currentRestaurant.address;
    document.getElementById('restaurant-adresse-wrapper').style.display = 'flex';
  }

  const hoursEl = document.getElementById('restaurant-hours');
  if (hoursEl && currentRestaurant.opening_hours) {
    const hours = Array.isArray(currentRestaurant.opening_hours) ? currentRestaurant.opening_hours : [];
    hoursEl.innerHTML = hours.map(h => `<span>${h.days}: <strong>${h.hours}</strong></span>`).join('<span class="dot">·</span>');
    document.getElementById('restaurant-hours-wrapper').style.display = 'flex';
  }

  // ── Kategorifaner (vandret) ───────────────────────────
  const navEl = document.getElementById('menu-nav');
  if (navEl) {
    navEl.innerHTML = currentRestaurant.menu.map(section => `
      <a href="#sektion-${slugify(section.category)}" class="menu-nav-item">
        ${section.category}
      </a>
    `).join('');
  }

  // ── Levering/Afhentning toggle ────────────────────────
  const toggleEl = document.getElementById('levering-toggle');
  if (toggleEl) {
    toggleEl.innerHTML = `
      <button class="levering-toggle-knap${leveringsmode === 'levering' ? ' aktiv' : ''}"
              data-mode="levering" onclick="skiftLeveringsmode('levering')">
        <i class="fa-solid fa-motorcycle"></i> Levering
      </button>
      <button class="levering-toggle-knap${leveringsmode === 'afhentning' ? ' aktiv' : ''}"
              data-mode="afhentning" onclick="skiftLeveringsmode('afhentning')">
        <i class="fa-solid fa-store"></i> Afhentning
      </button>`;
  }

  // ── Menusektioner ─────────────────────────────────────
  document.getElementById('restaurant-menu').innerHTML = currentRestaurant.menu.map(section => {
    const id = `sektion-${slugify(section.category)}`;
    const erPopulær = section.category.toLowerCase().includes('populær');

    if (erPopulær) {
      return `
        <div class="menu-sektion" id="${id}">
          <h3 class="menu-sektion-titel">${section.category}</h3>
          <div class="menu-populær-grid">
            ${section.items.map(item => `
              <div class="menu-populær-kort">
                <div class="menu-populær-billede"${item.image ? ` style="background-image:url('${item.image}')"` : ''}>
                  ${!item.image ? '<i class="fa-solid fa-utensils menu-populær-placeholder"></i>' : ''}
                </div>
                <div class="menu-populær-info">
                  <h4>${item.name}</h4>
                  ${item.description ? `<p>${item.description}</p>` : ''}
                  <div class="menu-populær-bund">
                    <span class="menu-item-pris">${item.price} kr.</span>
                    <button class="menu-tilføj-knap" aria-label="Tilføj ${item.name}"
                            onclick="addToCart('${item.id}')">+</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    return `
      <div class="menu-sektion" id="${id}">
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
                <button class="menu-tilføj-knap" aria-label="Tilføj ${item.name}"
                        onclick="addToCart('${item.id}')">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  // ── Scroll-spy: fremhæv aktiv kategori ───────────────
  if (navEl) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navEl.querySelectorAll('.menu-nav-item').forEach(a => {
            const isActive = a.getAttribute('href') === `#${entry.target.id}`;
            a.classList.toggle('aktiv', isActive);
            if (isActive) a.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          });
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    document.querySelectorAll('.menu-sektion').forEach(el => observer.observe(el));

    const første = navEl.querySelector('.menu-nav-item');
    if (første) første.classList.add('aktiv');
  }

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
    existing.quantity++;
    saveCart(); updateNavbarBadge();
    if (document.getElementById('kurv-indhold')) renderKurvPage();
    else renderSidebarCart();
    return;
  }

  if (!currentRestaurant) return;
  const item = findItem(itemId);
  if (!item) return;

  const nyVare = {
    id: itemId, name: item.name, price: item.price, quantity: 1,
    restaurantId: currentRestaurant.id, restaurantName: currentRestaurant.name,
  };

  if (cart.length > 0 && cart[0].restaurantId !== currentRestaurant.id) {
    visKurvKonflikt(cart[0].restaurantName, currentRestaurant.name, () => {
      cart = [nyVare];
      saveCart(); updateNavbarBadge(); renderSidebarCart();
    });
    return;
  }

  cart.push(nyVare);
  saveCart(); updateNavbarBadge();
  if (document.getElementById('kurv-indhold')) renderKurvPage();
  else renderSidebarCart();
}

function visLoginModal(redirectUrl = 'checkout.html') {
  document.getElementById('login-påkrævet-modal')?.remove();
  const el = document.createElement('div');
  el.id = 'login-påkrævet-modal';
  el.className = 'kurv-konflikt-overlay';
  el.innerHTML = `
    <div class="kurv-konflikt-boks">
      <h3>Log ind for at fortsætte</h3>
      <p>Du skal være logget ind for at gå til betaling.</p>
      <div class="kurv-konflikt-knapper">
        <button class="kurv-konflikt-annuller">Annuller</button>
        <button class="kurv-konflikt-bekræft">Log ind</button>
      </div>
    </div>`;
  el.querySelector('.kurv-konflikt-annuller').onclick = () => el.remove();
  el.querySelector('.kurv-konflikt-bekræft').onclick = () => {
    window.location.href = `login.html?next=${encodeURIComponent(redirectUrl)}`;
  };
  el.onclick = e => { if (e.target === el) el.remove(); };
  document.body.appendChild(el);
}

function gåTilBetaling() {
  if (!localStorage.getItem('displayName')) {
    visLoginModal('checkout.html');
    return;
  }
  window.location.href = 'checkout.html';
}

function visKurvKonflikt(fraRest, tilRest, onBekræft) {
  document.getElementById('kurv-konflikt-modal')?.remove();
  const el = document.createElement('div');
  el.id = 'kurv-konflikt-modal';
  el.className = 'kurv-konflikt-overlay';
  el.innerHTML = `
    <div class="kurv-konflikt-boks">
      <h3>Start ny ordre?</h3>
      <p>Din kurv indeholder allerede varer fra <strong>${fraRest}</strong>.<br>
         Vil du tømme kurven og starte en ny ordre fra <strong>${tilRest}</strong>?</p>
      <div class="kurv-konflikt-knapper">
        <button class="kurv-konflikt-annuller">Behold kurven</button>
        <button class="kurv-konflikt-bekræft">Tøm og start forfra</button>
      </div>
    </div>`;
  el.querySelector('.kurv-konflikt-annuller').onclick = () => el.remove();
  el.querySelector('.kurv-konflikt-bekræft').onclick  = () => { el.remove(); onBekræft(); };
  el.onclick = e => { if (e.target === el) el.remove(); };
  document.body.appendChild(el);
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
    updateMobilKurvKnap();
    return;
  }

  tomEl.style.display    = 'none';
  footerEl.style.display = 'block';

  const subtotal  = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const rabatPct  = getStudierabat();
  const rabat     = Math.round(subtotal * rabatPct / 100);
  const total     = subtotal - rabat;

  const rabatLinjeEl = document.getElementById('cart-rabat-linje');
  if (rabatLinjeEl) {
    rabatLinjeEl.style.display = rabat > 0 ? 'flex' : 'none';
    document.getElementById('cart-rabat-beloeb').textContent = `-${rabat} kr.`;
  }
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

  updateMobilKurvKnap();
}

function updateMobilKurvKnap() {
  const knap = document.getElementById('mobil-kurv-knap');
  if (!knap) return;
  if (cart.length === 0) { knap.classList.remove('kurv-fyldt'); return; }
  const subtotal    = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const rabatPct    = getStudierabat();
  const rabat       = Math.round(subtotal * rabatPct / 100);
  const total       = subtotal - rabat;
  const antalVarer  = cart.reduce((sum, c) => sum + c.quantity, 0);
  document.getElementById('mobil-kurv-info').textContent =
    `${antalVarer} vare${antalVarer !== 1 ? 'r' : ''} · ${total} kr.`;
  knap.classList.add('kurv-fyldt');
}


// ===== KURV PAGE =====

function getLevering() {
  if (localStorage.getItem('ue-pickup') === 'true') return 0;
  return localStorage.getItem('ue-free-delivery') === 'true' ? 0 : 29;
}

let leveringsmode = localStorage.getItem('ue-pickup') === 'true' ? 'afhentning' : 'levering';

function skiftLeveringsmode(mode) {
  leveringsmode = mode;
  localStorage.setItem('ue-pickup', mode === 'afhentning' ? 'true' : 'false');
  document.querySelectorAll('.levering-toggle-knap').forEach(btn => {
    btn.classList.toggle('aktiv', btn.dataset.mode === mode);
  });
  renderSidebarCart();
}

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
  const rabatPct = getStudierabat();
  const rabat    = Math.round(subtotal * rabatPct / 100);
  const levering = getLevering();
  const total    = subtotal + levering - rabat;

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
        ${rabat > 0 ? `
        <div class="kurv-linje" style="color:var(--student-color);font-weight:600">
          <span>Studierabat ( ${rabatPct}% ) 🎓</span>
          <span>-${rabat} kr.</span>
        </div>` : ''}
        <div class="kurv-linje${levering === 0 ? ' gratis-levering-linje' : ''}">
          <span>Levering</span>
          <span>${levering === 0 ? 'Gratis' : levering + ' kr.'}</span>
        </div>
        <div class="kurv-linje kurv-linje-total">
          <span>Total</span>
          <span>${total} kr.</span>
        </div>
        
        <button class="kurv-betaling-knap" onclick="gåTilBetaling()">
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
  const rabatPct = getStudierabat();
  const rabat    = Math.round(subtotal * rabatPct / 100);
  const tip      = Math.round(subtotal * tipProcent / 100);
  const levering = getLevering();
  const total    = subtotal + levering - rabat + tip;

  document.getElementById('checkout-subtotal').textContent = `${subtotal} kr.`;
  document.getElementById('checkout-levering').textContent = levering === 0 ? 'Gratis' : `${levering} kr.`;
  document.getElementById('checkout-tip').textContent      = `${tip} kr.`;
  document.getElementById('checkout-total').textContent    = `${total} kr.`;

  const rabatLinjeEl = document.getElementById('rabat-linje');
  if (rabatLinjeEl) {
    rabatLinjeEl.style.display = rabat > 0 ? 'flex' : 'none';
    document.getElementById('checkout-rabat-label').textContent = `Studierabat ( ${rabatPct}% ) 🎓`;
    document.getElementById('checkout-rabat').textContent = `-${rabat} kr.`;
  }
}

function renderCheckoutPage() {
  if (!localStorage.getItem('displayName')) {
    visLoginModal('checkout.html');
    return;
  }

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

async function renderBekræftelsePage() {
  const el = document.getElementById('bekræftelse-content');
  if (!el) return;

  // Save order snapshot (items + totals) before clearing cart
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const savedTip = parseInt(localStorage.getItem('ue-tip') || '0', 10);
  const rabatPct = getStudierabat();
  const tip      = Math.round(subtotal * savedTip / 100);
  const rabat    = Math.round(subtotal * rabatPct / 100);
  const levering = getLevering();
  const total    = subtotal + levering - rabat + tip;

  const order = {
    number:   Math.floor(100000 + Math.random() * 900000),
    items:    [...cart],
    subtotal,
    levering,
    rabat,
    tip,
    total,
    time:     Date.now(),
  };

  // Only save + clear cart on first load (not on refresh)
  if (!localStorage.getItem('ue-last-order')) {
    localStorage.setItem('ue-last-order', JSON.stringify(order));
    await sbSaveOrder(localStorage.getItem('ue-restaurant-id'), order.items, total);
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
        <span>Levering</span><span>${saved.levering === 0 ? 'Gratis' : saved.levering + ' kr.'}</span>
      </div>
      ${saved.rabat > 0 ? `
      <div class="bekræftelse-recap-linje" style="color:var(--student-color);font-weight:600">
        <span>Studierabat 🎓</span><span>-${saved.rabat} kr.</span>
      </div>` : ''}
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


// ===== LEVERING PAGE =====

function visBeskedModal(navn) {
  const overlay = document.createElement('div');
  overlay.className = 'levering-besked-overlay';
  overlay.innerHTML = `
    <div class="levering-besked-boks">
      <h3>Besked til ${navn}</h3>
      <textarea placeholder="Fx: Ring på dørklokken..."></textarea>
      <div class="levering-besked-knapper">
        <button class="levering-besked-luk">Annuller</button>
        <button class="levering-besked-send">Send</button>
      </div>
    </div>`;
  overlay.querySelector('.levering-besked-luk').onclick = () => overlay.remove();
  overlay.querySelector('.levering-besked-send').onclick = () => overlay.remove();
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}

function renderLeveringPage() {
  const el = document.getElementById('levering-content');
  if (!el) return;

  const saved = JSON.parse(localStorage.getItem('ue-last-order'));
  if (!saved) {
    el.innerHTML = '<p style="text-align:center;padding:3rem;color:#888">Ingen aktiv ordre. <a href="index.html" style="color:var(--brand-color)">Gå til forsiden →</a></p>';
    return;
  }

  const budbringere = [
    { navn: 'Ahmed K.',  rating: '4.8' },
    { navn: 'Lars M.',   rating: '4.9' },
    { navn: 'Sofia R.',  rating: '5.0' },
    { navn: 'Mikkel S.', rating: '4.9' },
    { navn: 'Fatima O.', rating: '4.7' },
    { navn: 'Jonas H.',  rating: '4.8' },
    { navn: 'Amira S.',  rating: '4.9' },
  ];
  const bud      = budbringere[saved.number % budbringere.length];
  const initialer = bud.navn.split(' ').map(w => w[0]).join('').toUpperCase();

  const eta    = new Date(saved.time + 30 * 60 * 1000);
  const etaStr = eta.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  const restNavn = saved.items?.[0]?.restaurantName || '';

  function minutter() {
    return Math.max(0, Math.round((eta - Date.now()) / 60000));
  }

  el.innerHTML = `
    <div class="levering-layout">

      <div class="levering-map-kort">
        <div class="levering-map-header">
          <span class="levering-ordre-ref">Ordre #${saved.number}${restNavn ? ' · ' + restNavn : ''}</span>
          <h1 class="levering-map-titel">Levering på vej 🛵</h1>
        </div>
        <div class="levering-kort-map">
          <svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
            <rect width="760" height="260" fill="#f5f5f5"/>
            <path d="M 100 210 C 300 190, 460 100, 660 50" stroke="#06c167" stroke-width="3" stroke-dasharray="10,7" fill="none" stroke-linecap="round"/>
            <circle cx="100" cy="210" r="10" fill="#06c167"/>
            <text x="100" y="232" text-anchor="middle" font-size="11" fill="#666" font-family="system-ui,sans-serif">Restaurant</text>
            <circle cx="660" cy="50" r="10" fill="#e53935"/>
            <text x="660" y="72" text-anchor="middle" font-size="11" fill="#666" font-family="system-ui,sans-serif">Dig</text>
            <text x="390" y="148" font-size="28" text-anchor="middle" dominant-baseline="middle">🛵</text>
          </svg>
        </div>
      </div>

      <div class="levering-info-kolonne">

        <div class="levering-eta-kort">
          <span class="levering-eta-label">ANSLÅET ANKOMST</span>
          <div class="levering-eta-minutter" id="lev-countdown">${minutter() > 0 ? minutter() + ' min' : 'Ankommer nu'}</div>
          <span class="levering-eta-kl">Ankommer ca. kl. ${etaStr}</span>
        </div>

        <div class="levering-status-kort">
          <span class="levering-status-overskrift">STATUS</span>
          <div class="levering-status-rad done"><div class="levering-status-ikon"><i class="fa-solid fa-circle-check"></i></div><span class="levering-status-tekst">Ordre modtaget</span></div>
          <div class="levering-status-rad done"><div class="levering-status-ikon"><i class="fa-solid fa-circle-check"></i></div><span class="levering-status-tekst">Maden tilberedes</span></div>
          <div class="levering-status-rad done"><div class="levering-status-ikon"><i class="fa-solid fa-circle-check"></i></div><span class="levering-status-tekst">Bud på vej</span></div>
          <div class="levering-status-rad"><div class="levering-status-ikon"><span class="lev-ikon-tom"></span></div><span class="levering-status-tekst">Leveret</span><span class="levering-status-tid">~${etaStr}</span></div>
        </div>

        <div class="levering-bud-kort">
          <div class="levering-bud-avatar">${initialer}</div>
          <div class="levering-bud-info">
            <strong>${bud.navn}</strong>
            <span>Dit bud · ★ ${bud.rating}</span>
          </div>
          <button class="levering-bud-besked-knap" onclick="visBeskedModal('${bud.navn}')">Besked</button>
        </div>

      </div>
    </div>`;

  setInterval(() => {
    const el = document.getElementById('lev-countdown');
    if (el) el.textContent = minutter() > 0 ? minutter() + ' min' : 'Ankommer nu';
  }, 30000);
}


// ===== INIT =====

updateNavbarBadge();

(async () => {
  const [rawRestaurants, favIds] = await Promise.all([
    sbGetRestaurants(),
    sbGetFavorites(),
  ]);
  restaurants = rawRestaurants.map(r => ({ ...r, favorite: favIds.includes(r.id) }));

  if (document.getElementById('restauranter-grid')) {
    renderHomepage();
    initCategoryFilters();
    initPillFilters();
    initSearchFilter();
  } else if (document.getElementById('restaurant-menu')) {
    await renderRestaurantPage();
  } else if (document.getElementById('kurv-indhold')) {
    renderKurvPage();
  } else if (document.getElementById('checkout-items')) {
    renderCheckoutPage();
  } else if (document.getElementById('bekræftelse-content')) {
    await renderBekræftelsePage();
  } else if (document.getElementById('levering-content')) {
    renderLeveringPage();
  }
})();
