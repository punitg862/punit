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

// TESTIMONIALS CAROUSEL
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonial-track');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!track || !dotsContainer) return;

  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const totalSlides = testimonialCards.length;

  let currentSlide = 0;

  const dots = [];
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
  }
});
