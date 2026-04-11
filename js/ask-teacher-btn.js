/* =============================================
   Ask Teacher Button — כפתור שאל את המורה
   מוסיף כפתור צף לכל דף תרגיל/הקניה
   ============================================= */

(function() {
  // ===== CSS =====
  const style = document.createElement('style');
  style.textContent = `
    .ask-teacher-float {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 9000;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .ask-teacher-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #fff;
      border: none;
      border-radius: 50px;
      font-family: 'Heebo', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
      transition: all 0.3s ease;
      text-decoration: none;
      direction: rtl;
    }

    .ask-teacher-btn:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 6px 24px rgba(245, 158, 11, 0.5);
      color: #fff;
    }

    .ask-teacher-btn:active {
      transform: translateY(0) scale(0.98);
    }

    .ask-teacher-btn .duck-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      background: #fff;
      padding: 2px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      animation: duckWobble 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes duckWobble {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-8deg); }
      75% { transform: rotate(8deg); }
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .ask-teacher-float {
        bottom: 16px;
        left: 16px;
        right: 16px;
      }

      .ask-teacher-btn {
        width: 100%;
        justify-content: center;
        padding: 14px 20px;
        font-size: 1.05rem;
        border-radius: 12px;
      }
    }
  `;
  document.head.appendChild(style);

  // ===== Detect page context =====
  function getPageContext() {
    const context = {
      topic: '',
      level: '',
      question: '',
      source: window.location.pathname
    };

    // Try to get topic from page title or h1
    const h1 = document.querySelector('h1');
    if (h1) {
      context.topic = h1.textContent.trim();
    }

    // Try to get level/difficulty from visible elements
    const activeTab = document.querySelector('.level-tab.active, .tab-btn.active, [data-level].active, [data-difficulty]');
    if (activeTab) {
      context.level = activeTab.textContent.trim();
    }

    // Try to get current question text
    const activeQuestion = document.querySelector('.q-stem, .question-text.active, .question.active, [data-question]:not([style*="display: none"]) .question-text');
    if (activeQuestion) {
      context.question = activeQuestion.textContent.trim().substring(0, 200);
    }

    return context;
  }

  // ===== Build relative path back to site root (returns "../../" etc.) =====
  function resolveRoot() {
    const path = window.location.pathname;
    // find the last "materials/" segment — everything after it is under the site root
    const idx = path.lastIndexOf('/materials/');
    if (idx === -1) return '';
    const tail = path.slice(idx + 1); // "materials/..."
    const parts = tail.split('/').filter(Boolean);
    // parts = ['materials', 'stage', 'subject', 'grade', 'file.html']  (or shallower)
    const up = parts.length - 1;
    return '../'.repeat(up);
  }
  function resolveAskTeacherHref() { return resolveRoot() + 'ask-teacher.html'; }
  function resolveDuckIconSrc() { return resolveRoot() + 'assets/images_DuckMe/logo_bot.png'; }

  // ===== Build the button =====
  function createAskButton() {
    if (document.querySelector('.ask-teacher-float')) return; // idempotent
    const container = document.createElement('div');
    container.className = 'ask-teacher-float';

    const btn = document.createElement('a');
    btn.className = 'ask-teacher-btn';
    btn.href = '#';
    btn.innerHTML = '<img class="duck-icon" src="' + resolveDuckIconSrc() + '" alt="DuckMe"> שאל את המורה';

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const ctx = getPageContext();
      const params = new URLSearchParams();

      if (ctx.topic) params.set('topic', ctx.topic);
      if (ctx.level) params.set('level', ctx.level);
      if (ctx.question) params.set('q', ctx.question);
      if (ctx.source) params.set('source', ctx.source);

      const base = resolveAskTeacherHref();
      window.location.href = base + '?' + params.toString();
    });

    container.appendChild(btn);
    document.body.appendChild(container);
  }

  // ===== Initialize =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAskButton);
  } else {
    createAskButton();
  }
})();
