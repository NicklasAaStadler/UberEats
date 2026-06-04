(function () {
  var dn = localStorage.getItem('displayName'),
      role = localStorage.getItem('role'),
      ul = document.querySelector('.navbar-venstre ul');

  if (dn && ul) {
    ul.dataset.synced = '1';
    var anchor = document.getElementById('nav-studierabat') || ul.querySelector('a[href="studierabat.html"]'),
        sli = anchor && anchor.closest('li'),
        lf = document.createElement('li'),
        lp = document.createElement('li');
    lf.innerHTML = '<a href="profil.html?sektion=favoritter">Favoritter</a>';
    lp.innerHTML = '<a href="profil.html">Profil</a>';
    if (sli) { ul.insertBefore(lf, sli); ul.insertBefore(lp, sli); }
    else { ul.appendChild(lf); ul.appendChild(lp); }

    var na = document.getElementById('nav-auth');
    if (na) {
      var i = dn.split(' ').map(function (w) { return w[0] || ''; }).join('').toUpperCase().slice(0, 2);
      na.style.listStyle = 'none';
      na.style.visibility = 'visible';
      na.innerHTML = '<div class="nav-bruger">' +
        (role === 'student' ? '<span class="nav-student-badge">Studerende</span>' : '') +
        '<a href="profil.html" class="nav-avatar">' + i + '</a></div>';
    }
  }

  var city = localStorage.getItem('ue-city'), loc = document.getElementById('nav-location');
  if (loc && city) { loc.textContent = city; loc.style.opacity = '1'; }
})();
