(async function () {
  const session = await sbGetSession();

  if (session) {
    let displayName = localStorage.getItem('displayName');
    let role        = localStorage.getItem('role');

    if (!displayName) {
      const profile = await sbGetProfile();
      if (profile) {
        displayName = profile.display_name;
        role        = profile.role;
        localStorage.setItem('displayName', displayName);
        localStorage.setItem('role',        role);
      }
    }
  } else {
    // Session gone — clear all user-specific state
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('displayName');
    localStorage.removeItem('ue-favorites');
    localStorage.removeItem('ue-favorites-ts');
  }

  const role        = localStorage.getItem('role');
  const displayName = localStorage.getItem('displayName');
  const navAuth     = document.getElementById('nav-auth');
  const leftNav     = document.querySelector('.navbar-venstre ul');

  // Only set up nav if the inline sync script didn't already handle it
  if (navAuth && role && displayName && leftNav && !leftNav.dataset.synced) {
    const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const liFav    = document.createElement('li');
    liFav.innerHTML = `<a href="profil.html?sektion=favoritter">Favoritter</a>`;
    const liProfil  = document.createElement('li');
    liProfil.innerHTML = `<a href="profil.html">Profil</a>`;

    const studierabatLi = document.getElementById('nav-studierabat')?.closest('li');
    if (studierabatLi) {
      leftNav.insertBefore(liFav, studierabatLi);
      leftNav.insertBefore(liProfil, studierabatLi);
    } else {
      leftNav.appendChild(liFav);
      leftNav.appendChild(liProfil);
    }

    const studierabatLink = document.getElementById('nav-studierabat');
    if (studierabatLink) studierabatLink.href = 'profil.html?verif=1';

    navAuth.style.listStyle = 'none';
    navAuth.innerHTML = `
      <div class="nav-bruger">
        ${role === 'student' ? '<span class="nav-student-badge">Studerende</span>' : ''}
        <a href="profil.html" class="nav-avatar" aria-label="Gå til profil">${initials}</a>
      </div>
    `;
    navAuth.style.visibility = 'visible';
  }

  // Location — use localStorage cache, only hit APIs on first visit
  const locationEl = document.getElementById('nav-location');
  if (locationEl && !locationEl.textContent) {
    const cachedCity = localStorage.getItem('ue-city');
    if (cachedCity) {
      locationEl.textContent = cachedCity;
      locationEl.style.opacity = '1';
    } else {
      const apis = [
        { url: 'https://ipinfo.io/json',  get: d => d.city },
        { url: 'https://ipapi.co/json/',  get: d => d.city },
        { url: 'https://ip-api.com/json', get: d => d.city },
      ];
      (async () => {
        for (const api of apis) {
          try {
            const d = await fetch(api.url).then(r => r.json());
            const city = api.get(d);
            if (city) {
              locationEl.textContent = city;
              locationEl.style.opacity = '1';
              localStorage.setItem('ue-city', city);
              return;
            }
          } catch {}
        }
      })();
    }
  }

  if (role === 'student') {
    const studentSektion = document.getElementById('student-sektion');
    if (studentSektion) {
      studentSektion.style.display = 'block';

      const orders  = await sbGetOrders();
      const now     = new Date();
      const mål     = 5;
      const fremgang = Math.min(
        orders.filter(o => new Date(o.created_at).getMonth() === now.getMonth()).length,
        mål
      );
      const måneder  = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
      const næste    = måneder[(now.getMonth() + 1) % 12];
      const mangler  = mål - fremgang;

      const titelEl = document.getElementById('srb-titel');
      const subEl   = document.getElementById('srb-sub');
      const dotsEl  = document.getElementById('srb-dots');
      const tekstEl = document.getElementById('srb-progress-tekst');
      const footerEl = document.getElementById('srb-footer-tekst');

      if (titelEl) titelEl.textContent = `${fremgang}/${mål} ordrer denne måned`;
      if (subEl)   subEl.textContent   = fremgang >= mål
        ? 'Du har opnået en voucher på 100kr!'
        : `Bestil ${mangler} gang${mangler !== 1 ? 'e' : ''} mere og få en voucher på 100kr!`;
      if (dotsEl)  dotsEl.innerHTML = Array.from({length: mål}, (_, i) =>
        `<div class="srb-dot${i < fremgang ? ' faerdig' : ''}"></div>`).join('');
      if (tekstEl) tekstEl.textContent = `${fremgang} ud af ${mål} ordrer`;
      if (footerEl) footerEl.textContent = `Ny måned, nye muligheder! Tællingen nulstilles 1. ${næste}`;
    }

    const titel = document.querySelector('.restauranter-titel');
    if (titel) titel.textContent = 'Populært i dit område';
  }

  if (navAuth) navAuth.style.visibility = 'visible';

  updateActiveNavLink();
})();

function updateActiveNavLink() {
  const path    = window.location.pathname;
  const sektion = new URLSearchParams(window.location.search).get('sektion');

  document.querySelectorAll('.navbar-venstre ul li a').forEach(a => a.classList.remove('aktiv'));

  let activeHref;
  if (path.includes('profil.html') && sektion === 'favoritter') {
    activeHref = 'profil.html?sektion=favoritter';
  } else if (path.includes('profil.html')) {
    activeHref = 'profil.html';
  } else if (path.includes('index.html') || path.endsWith('/')) {
    activeHref = 'index.html';
  }

  if (activeHref) {
    const link = document.querySelector(`.navbar-venstre ul li a[href="${activeHref}"]`);
    if (link) link.classList.add('aktiv');
  }
}

async function logout() {
  await sbSignOut();
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('displayName');
  localStorage.removeItem('ue-favorites');
  localStorage.removeItem('ue-favorites-ts');
  localStorage.removeItem('ue-free-delivery');
  window.location.href = 'index.html';
}
