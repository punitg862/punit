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

// Contact Modals
function initModals() {
  const indiaModal = document.getElementById('indiaModal');
  const uaeModal = document.getElementById('uaeModal');
  const indiaOverlay = document.getElementById('indiaOverlay');
  const uaeOverlay = document.getElementById('uaeOverlay');
  const indiaClose = document.getElementById('indiaClose');
  const uaeClose = document.getElementById('uaeClose');
  const contactBtns = document.querySelectorAll('.contact-btn');

  if (!indiaModal || !uaeModal) return;

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  contactBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalType = btn.getAttribute('data-modal');
      if (modalType === 'india') openModal(indiaModal);
      if (modalType === 'uae') openModal(uaeModal);
    });
  });

  if (indiaClose) indiaClose.addEventListener('click', () => closeModal(indiaModal));
  if (uaeClose) uaeClose.addEventListener('click', () => closeModal(uaeModal));
  if (indiaOverlay) indiaOverlay.addEventListener('click', () => closeModal(indiaModal));
  if (uaeOverlay) uaeOverlay.addEventListener('click', () => closeModal(uaeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(indiaModal);
      closeModal(uaeModal);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModals);
} else {
  initModals();
}

// Botim app opening - Only open Botim, no fallback
function openBotim(event) {
    event.preventDefault();

    const phoneNumber = "+971522018157";

    navigator.clipboard.writeText(phoneNumber).finally(() => {
        alert("Phone number copied to clipboard. Paste it in BOTIM.");
        window.location.href = "botim://";
    });
}
