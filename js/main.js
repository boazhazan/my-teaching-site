// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ===== Header Scroll Effect =====
const header = document.getElementById('header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ===== Materials Tabs =====
const tabs = document.querySelectorAll('.materials-tab');
const contents = document.querySelectorAll('.materials-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.remove('active'));
    const targetEl = document.getElementById('tab-' + target);
    if (targetEl) targetEl.classList.add('active');
  });
});

// ===== Scroll Reveal Animations =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

// ===== Dynamic Testimonials from Google Sheets =====
(function loadTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIDsKpFfB9kO38JwZ6MuG678gcdRz5Lvs2MmNy5ckx5vk8VyeJtofb53vVw3fxTD9a1Qd9wTS-AjZ9/pub?output=csv';

  fetch(CSV_URL)
    .then(res => res.text())
    .then(csv => {
      const rows = parseCSV(csv);
      if (rows.length === 0) {
        grid.innerHTML = '<p class="testimonials-loading">אין המלצות עדיין</p>';
        return;
      }
      const headers = rows[0].map(h => h.replace(/[\u200F\u200E\uFEFF]/g, '').trim().replace(/:$/g, '').trim());
      const nameIdx = headers.findIndex(h => h.includes('שם'));
      const roleIdx = headers.findIndex(h => h.includes('תפקיד'));
      const textIdx = headers.findIndex(h => h.includes('המלצה'));
      const ratingIdx = headers.findIndex(h => h.includes('דירוג'));
      const approvedIdx = headers.findIndex(h => h.includes('Approved'));

      // Fallback to known column positions if headers don't match
      const ni = nameIdx >= 0 ? nameIdx : 1;
      const ri = roleIdx >= 0 ? roleIdx : 2;
      const ti = textIdx >= 0 ? textIdx : 3;
      const rti = ratingIdx >= 0 ? ratingIdx : 4;
      const ai = approvedIdx >= 0 ? approvedIdx : 5;

      const approved = rows.slice(1).filter(row => row[ai] && row[ai].trim().toUpperCase() === 'TRUE');

      if (approved.length === 0) {
        grid.innerHTML = '<p class="testimonials-loading">אין המלצות עדיין</p>';
        return;
      }

      grid.innerHTML = '';
      approved.forEach(row => {
        const rating = parseInt(row[rti]) || 5;
        const stars = '\u2B50'.repeat(Math.min(Math.max(rating, 1), 5));
        const card = document.createElement('div');
        card.className = 'testimonial-card reveal';
        card.innerHTML =
          '<div class="testimonial-stars">' + stars + '</div>' +
          '<p class="testimonial-text">' + escapeHTML(row[ti] || '') + '</p>' +
          '<p class="testimonial-author">' + escapeHTML(row[ni] || '') + '</p>' +
          '<p class="testimonial-role">' + escapeHTML(row[ri] || '') + '</p>';
        grid.appendChild(card);
      });

      // Re-observe new cards for scroll animation
      grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    })
    .catch(() => {
      grid.innerHTML = '<p class="testimonials-loading">לא ניתן לטעון המלצות כרגע</p>';
    });

  function parseCSV(text) {
    const rows = [];
    let current = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"' && text[i + 1] === '"') {
          field += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          current.push(field);
          field = '';
        } else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
          current.push(field);
          field = '';
          rows.push(current);
          current = [];
          if (ch === '\r') i++;
        } else {
          field += ch;
        }
      }
    }
    if (field || current.length) {
      current.push(field);
      rows.push(current);
    }
    return rows;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();

// ===== Contact Form (basic client-side feedback) =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !phone) {
      alert('אנא מלאו שם וטלפון.');
      return;
    }

    alert('תודה ' + name + '! ההודעה נשלחה. אחזור אליך בהקדם.');
    contactForm.reset();
  });
}
