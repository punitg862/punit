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

    window.location.href = "botim://";

    setTimeout(() => {
        navigator.clipboard.writeText("+971522018157").catch(() => {});
    }, 300);
}

// Contact Form Modal
function openContactModal() {
  document.getElementById('contactFormModal').classList.add('active');
}

function closeContactModal() {
  document.getElementById('contactFormModal').classList.remove('active');
  document.getElementById('contactForm').reset();
  clearAllErrors();
}

function clearAllErrors() {
  document.getElementById('subjectError').textContent = '';
  document.getElementById('contactError').textContent = '';
  document.getElementById('messageError').textContent = '';
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateMobile(phone) {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ''));
}

function isValidContact(contact) {
  // Check if it's a valid email or mobile number
  return validateEmail(contact) || validateMobile(contact);
}

// Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const contactFormModal = document.getElementById('contactFormModal');
  const contactFormOverlay = document.getElementById('contactFormOverlay');
  const contactFormClose = document.getElementById('contactFormClose');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors();

      const subject = document.getElementById('subject').value.trim();
      const contact = document.getElementById('contact').value.trim();
      const message = document.getElementById('message').value.trim();

      let isValid = true;

      // Validation
      if (!subject) {
        document.getElementById('subjectError').textContent = 'Subject is required';
        isValid = false;
      }

      if (!contact) {
        document.getElementById('contactError').textContent = 'Contact no. or Email is required';
        isValid = false;
      } else if (!isValidContact(contact)) {
        document.getElementById('contactError').textContent = 'Enter valid email or mobile number (10-15 digits)';
        isValid = false;
      }

      if (!message) {
        document.getElementById('messageError').textContent = 'Message is required';
        isValid = false;
      }

      if (!isValid) return;

      // Send email
      try {
        const emailData = {
          to: 'puneetg862@gmail.com',
          from: 'punitgenbd@gmail.com',
          subject: 'Portfolio: ' + subject,
          message: message,
          senderContact: contact
        };

        // Use FormSubmit.co
        const response = await fetch('https://formspree.io/f/xjkvrdld', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: contact,
            subject: 'Portfolio: ' + subject,
            message: message
          })
        });

        if (response.ok) {
          alert('Message sent successfully! I will get back to you soon.');
          closeContactModal();
        } else {
          alert('Failed to send message. Please try again or use email directly.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error sending message. Please try again.');
      }
    });
  }

  if (contactFormClose) {
    contactFormClose.addEventListener('click', closeContactModal);
  }

  if (contactFormOverlay) {
    contactFormOverlay.addEventListener('click', closeContactModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactFormModal?.classList.contains('active')) {
      closeContactModal();
    }
  });
});
