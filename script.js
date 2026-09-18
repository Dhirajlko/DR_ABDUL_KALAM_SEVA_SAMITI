/**
 * DR. ABDUL KALAM SEVA SAMITI - OFFICIAL SCRIPT
 * Interactive functionality & UI enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileNav() {
    navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileNav);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Stat Counter Animation on Scroll
  const statNumbers = document.querySelectorAll('.stat-num');
  let animated = false;

  function runCounterAnimation() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      const duration = 1800; // ms
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.innerHTML = target + '<span>+</span>';
          clearInterval(timer);
        } else {
          stat.innerHTML = Math.floor(current) + '<span>+</span>';
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(statsSection);
  }

  // 4. Toast Notification Utility
  const toast = document.getElementById('toast');
  let toastTimeout;

  window.showToast = function(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // 5. Copy to Clipboard Functionality
  window.copyText = function(text, label = 'विवरण') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`✓ ${label} कॉपी हो गया: ${text}`);
      }).catch(() => {
        fallbackCopyText(text, label);
      });
    } else {
      fallbackCopyText(text, label);
    }
  };

  function fallbackCopyText(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`✓ ${label} कॉपी हो गया: ${text}`);
    } catch (err) {
      showToast(`कॉपी करने में असमर्थ, कृपया मैन्युअली चुनें।`);
    }
    document.body.removeChild(textArea);
  }

  // 6. Donation Tier Buttons & Custom Amount
  const tierBtns = document.querySelectorAll('.tier-btn');
  const customAmountInput = document.getElementById('customAmount');
  const selectedAmountDisplay = document.getElementById('selectedAmountDisplay');

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const amt = btn.getAttribute('data-amount');
      if (customAmountInput) customAmountInput.value = amt;
      if (selectedAmountDisplay) selectedAmountDisplay.textContent = '₹ ' + Number(amt).toLocaleString('en-IN');
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      tierBtns.forEach(b => b.classList.remove('selected'));
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      if (selectedAmountDisplay) {
        selectedAmountDisplay.textContent = val ? '₹ ' + Number(val).toLocaleString('en-IN') : '₹ 0';
      }
    });
  }

  // 7. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 8. Gallery Lightbox Modal
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('open');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
      }
    });
  }

  // 9. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open faqs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // 10. Contact & Volunteer Form Submission Simulation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'संदेश भेजा जा रहा है...';

      setTimeout(() => {
        showToast('✓ धन्यवाद! आपका संदेश डॉ. अब्दुल कलाम सेवा समिति को प्राप्त हो गया है। हम शीघ्र आपसे संपर्क करेंगे।');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 900);
    });
  }
});
