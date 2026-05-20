(function () {
  const role        = localStorage.getItem('role');
  const username    = localStorage.getItem('username');
  const displayName = localStorage.getItem('displayName');

  const navAuth = document.getElementById('nav-auth');
  if (navAuth && role && displayName) {
    const initials = displayName
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const studentTag = role === 'student'
      ? `<span style="
            display:inline-block;
            font-size:0.6rem;
            font-weight:700;
            letter-spacing:0.04em;
            text-transform:uppercase;
            background:#06c167;
            color:#fff;
            padding:2px 7px;
            border-radius:20px;
            margin-top:3px;
          ">Studerende</span>`
      : '';

    navAuth.style.listStyle = 'none';
    navAuth.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="
          width:38px;height:38px;border-radius:50%;
          background:#111;color:#fff;
          display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:0.95rem;flex-shrink:0;
        ">${initials}</div>
        <div style="line-height:1.3;">
          <div style="font-weight:600;font-size:0.88rem;">${displayName}</div>
          ${studentTag}
        </div>
        <a href="#" onclick="logout()" style="margin-left:6px;font-size:0.8rem;color:#999;white-space:nowrap;">Log ud</a>
      </div>
    `;
  }

  const locationEl = document.getElementById('nav-location');
  if (locationEl) {
    fetch('https://ip-api.com/json')
      .then(r => r.json())
      .then(d => { locationEl.textContent = d.city || 'Ukendt by'; })
      .catch(()  => { locationEl.textContent = 'Location'; });
  }

  if (role === 'student') {
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
  }
})();

function logout() {
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('displayName');
  window.location.reload();
}
