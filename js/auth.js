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
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('displayName');
  }

  const role        = localStorage.getItem('role');
  const displayName = localStorage.getItem('displayName');

  const navAuth = document.getElementById('nav-auth');
  if (navAuth && role && displayName) {
    const initials = displayName
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const leftNav = document.querySelector('.navbar-venstre ul');
    if (leftNav) {
      const li = document.createElement('li');
      const onProfilPage = window.location.pathname.includes('profil.html');
      li.innerHTML = `<a href="profil.html" class="nav-profil-knap${onProfilPage ? ' aktiv' : ''}">Profil</a>`;
      leftNav.appendChild(li);
    }

    navAuth.style.listStyle = 'none';
    navAuth.innerHTML = `
      <div class="nav-bruger">
        ${role === 'student' ? '<span class="nav-student-badge">Studerende</span>' : ''}
        <a href="profil.html" class="nav-avatar" aria-label="Gå til profil">${initials}</a>
      </div>
    `;
  }

  const locationEl = document.getElementById('nav-location');
  if (locationEl) {
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
          if (city) { locationEl.textContent = city; return; }
        } catch {}
      }
      locationEl.textContent = 'Location';
    })();
  }

  if (role === 'student') {
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';

    const studentSektion = document.getElementById('student-sektion');
    if (studentSektion) studentSektion.style.display = 'block';

    const titel = document.querySelector('.restauranter-titel');
    if (titel) titel.textContent = 'Eksklusivt for studerende';
  }

  if (navAuth) navAuth.style.visibility = 'visible';
})();

async function logout() {
  await sbSignOut();
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('displayName');
  window.location.href = 'index.html';
}
