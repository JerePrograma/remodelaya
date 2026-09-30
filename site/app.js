'use strict';
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  mobileNav.hidden = expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
const wideScreen = window.matchMedia('(min-width: 981px)');
wideScreen.addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelectorAll('[data-service]').forEach(link => {
  const service = link.dataset.service;
  const message = 'Hola, quisiera pedir un presupuesto para: ' + service + '. Mi zona es: ';
  link.href = 'https://wa.me/5491127792932?text=' + encodeURIComponent(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
if ('IntersectionObserver' in window) {
  const visibleSections = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visibleSections.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
    const active = Array.from(visibleSections.entries()).sort((a, b) => b[1] - a[1])[0];
    if (!active || active[1] === 0) return;
    navLinks.forEach(link => {
      const isActive = link.hash === '#' + active[0];
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-90px 0px -35% 0px', threshold: [0, .1, .25, .5]});
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
