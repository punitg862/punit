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

// Botim app opening
function openBotim(event) {
  event.preventDefault();
  const number = '971522018157';
  const numberClean = number.replace(/\D/g, '');

  // Try multiple Botim deep link formats
  const botimUrls = [
    `botim://user/${numberClean}`,
    `botim://call/${numberClean}`,
    `botim://contact/${numberClean}`,
    `https://botim.me/user/${numberClean}` // Web fallback
  ];

  // Try first deep link
  if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
    // Mobile device - try app first
    window.location.href = botimUrls[0];

    // Fallback to WhatsApp after 2 seconds if Botim not installed
    const timeout = setTimeout(() => {
      window.location.href = `https://wa.me/${numberClean}`;
    }, 2000);

    // Clear timeout if user navigates (app was opened)
    window.addEventListener('blur', () => clearTimeout(timeout));
  } else {
    // Desktop - open WhatsApp directly
    window.open(`https://wa.me/${numberClean}`, '_blank');
  }
}
