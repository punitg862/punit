document.getElementById('year').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const navLinkByHash = {};
navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
  navLinkByHash[link.getAttribute('href').slice(1)] = link;
});

const sections = Object.keys(navLinkByHash)
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveLink(id) {
  Object.values(navLinkByHash).forEach(link => link.classList.remove('active'));
  const activeLink = navLinkByHash[id];
  if (activeLink) activeLink.classList.add('active');
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveLink(entry.target.id);
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));
