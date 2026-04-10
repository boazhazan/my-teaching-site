/* =============================================
   Auth Gate — מערכת רישום, תשלום והתחברות
   בועז חזן — אתר לימוד
   =============================================
   קובץ זה מוסיף:
   1. כפתור כניסה/סטטוס בהדר
   2. חלון רישום + הנחיות תשלום
   3. חלון הזנת קוד
   4. לוגיקת נעילה/פתיחה של תכנים
   ============================================= */

/* ===== CSS ===== */
const authStyles = document.createElement('style');
authStyles.textContent = `
/* Auth Button in Header */
.auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid var(--accent);
  background: var(--accent);
  color: #fff;
  transition: all 0.25s ease;
  margin-right: 4px;
}

.auth-btn:hover {
  background: var(--accent-dark);
  border-color: var(--accent-dark);
  transform: translateY(-1px);
}

.auth-btn.logged-in {
  background: var(--success, #10b981);
  border-color: var(--success, #10b981);
  font-size: 0.85rem;
}

.auth-btn.logged-in:hover {
  opacity: 0.9;
}

/* Modal Overlay */
.auth-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10000;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.auth-overlay.show {
  display: flex;
}

/* Modal Box */
.auth-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  direction: rtl;
  text-align: right;
}

.auth-modal-header {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  padding: 28px 28px 20px;
  border-radius: 16px 16px 0 0;
  text-align: center;
}

.auth-modal-header h2 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.auth-modal-header p {
  font-size: 0.9rem;
  opacity: 0.85;
}

.auth-modal-body {
  padding: 24px 28px 28px;
}

.auth-close {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.auth-close:hover {
  background: rgba(255,255,255,0.35);
}

/* Tabs */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
}

.auth-tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  background: #f8fafc;
  color: var(--text-light, #64748b);
  cursor: pointer;
  transition: all 0.2s;
}

.auth-tab.active {
  background: var(--primary, #2563eb);
  color: #fff;
}

/* Form Elements */
.auth-field {
  margin-bottom: 14px;
}

.auth-field label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: var(--text, #1e293b);
}

.auth-field input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--border, #e2e8f0);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  direction: rtl;
  transition: border-color 0.2s;
}

.auth-field input:focus {
  outline: none;
  border-color: var(--primary, #2563eb);
}

.auth-submit {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.auth-submit.register {
  background: var(--primary, #2563eb);
  color: #fff;
}

.auth-submit.register:hover {
  background: var(--primary-dark, #1d4ed8);
}

.auth-submit.verify {
  background: var(--accent, #f59e0b);
  color: #fff;
}

.auth-submit.verify:hover {
  background: var(--accent-dark, #d97706);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Payment Info Box */
.auth-payment-box {
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  text-align: center;
}

.auth-payment-box h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text, #1e293b);
}

.auth-payment-box .price {
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent-dark, #d97706);
  margin: 4px 0;
}

.auth-payment-box p {
  font-size: 0.85rem;
  color: var(--text-light, #64748b);
  margin: 4px 0;
}

.auth-payment-methods {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
}

.auth-payment-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
}

.auth-payment-method span.pay-icon {
  font-size: 1.5rem;
}

/* Message */
.auth-message {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin: 12px 0;
  display: none;
}

.auth-message.success {
  background: #d1fae5;
  color: #065f46;
  display: block;
}

.auth-message.error {
  background: #fee2e2;
  color: #991b1b;
  display: block;
}

.auth-message.info {
  background: #dbeafe;
  color: #1e40af;
  display: block;
}

/* Divider */
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: var(--text-light, #64748b);
  font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border, #e2e8f0);
}

/* Locked overlay on exercises */
.auth-locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 12px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-locked-overlay:hover {
  background: rgba(255, 255, 255, 0.92);
}

.auth-locked-overlay .lock-icon {
  font-size: 2.5rem;
}

.auth-locked-overlay p {
  font-weight: 700;
  color: var(--primary, #2563eb);
  font-size: 1rem;
}

.auth-locked-overlay .lock-sub {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--text-light, #64748b);
}

/* Logout link */
.auth-logout {
  display: block;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-light, #64748b);
  cursor: pointer;
  margin-top: 12px;
  text-decoration: underline;
}

.auth-logout:hover {
  color: #dc2626;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-modal {
    max-width: 100%;
    margin: 8px;
    border-radius: 12px;
  }

  .auth-modal-header {
    padding: 20px 20px 16px;
    border-radius: 12px 12px 0 0;
  }

  .auth-modal-body {
    padding: 16px 20px 20px;
  }

  .auth-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .auth-payment-methods {
    flex-direction: column;
    gap: 8px;
  }
}
`;
document.head.appendChild(authStyles);


/* ===== Configuration ===== */
const AUTH_CONFIG = {
  apiUrl: 'https://script.google.com/macros/s/AKfycbzGLYhz0ZuhY0caoaae88fVmY9LreZFC7CoE4hvJuGnuAoH-D_afZ593ff7us2puKvKUw/exec',
  adminPhone: '0523616310',
  price: 20,
  testCode: 'BOAZ2026',
  storageKey: 'bh_auth'
};


/* ===== State Management ===== */
const AuthState = {
  get() {
    try {
      const stored = localStorage.getItem(AUTH_CONFIG.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  set(data) {
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify({
      code: data.code,
      name: data.name,
      verified: true,
      timestamp: Date.now()
    }));
  },

  clear() {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
  },

  isLoggedIn() {
    const state = this.get();
    return state && state.verified === true;
  },

  getName() {
    const state = this.get();
    return state ? state.name : '';
  }
};


/* ===== API Calls ===== */
async function authApiCall(data) {
  try {
    const response = await fetch(AUTH_CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (err) {
    console.error('Auth API error:', err);
    // Fallback for test code
    if (data.action === 'verify' && data.code.toUpperCase() === AUTH_CONFIG.testCode) {
      return { success: true, valid: true, name: 'בועז (אופליין)', message: 'קוד תקין!' };
    }
    return { success: false, error: 'שגיאת תקשורת. נסה שוב.' };
  }
}


/* ===== Build UI ===== */
function buildAuthUI() {
  // --- Auth Button in Header ---
  const nav = document.getElementById('navLinks');
  if (nav) {
    const authBtn = document.createElement('button');
    authBtn.className = 'auth-btn';
    authBtn.id = 'authHeaderBtn';
    updateAuthButton(authBtn);
    authBtn.addEventListener('click', () => {
      if (AuthState.isLoggedIn()) {
        showLoggedInModal();
      } else {
        showAuthModal();
      }
    });

    // Insert before nav-cta
    const ctaLink = nav.querySelector('.nav-cta');
    if (ctaLink) {
      nav.insertBefore(authBtn, ctaLink);
    } else {
      nav.appendChild(authBtn);
    }
  }

  // --- Modal Overlay ---
  const overlay = document.createElement('div');
  overlay.className = 'auth-overlay';
  overlay.id = 'authOverlay';
  overlay.innerHTML = `
    <div class="auth-modal" id="authModal">
      <div class="auth-modal-header">
        <button class="auth-close" id="authClose">&times;</button>
        <h2 id="authModalTitle">כניסה לתכנים</h2>
        <p id="authModalSubtitle">רמה 1 פתוחה לכולם. לגישה מלאה — הרשמו!</p>
      </div>
      <div class="auth-modal-body" id="authModalBody"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAuthModal();
  });

  document.getElementById('authClose').addEventListener('click', closeAuthModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthModal();
  });
}

function updateAuthButton(btn) {
  if (!btn) btn = document.getElementById('authHeaderBtn');
  if (!btn) return;

  if (AuthState.isLoggedIn()) {
    btn.className = 'auth-btn logged-in';
    btn.textContent = '\u2713 ' + AuthState.getName();
  } else {
    btn.className = 'auth-btn';
    btn.textContent = '\uD83D\uDD11 כניסה';
  }
}


/* ===== Modal Views ===== */
function showAuthModal() {
  const body = document.getElementById('authModalBody');
  const title = document.getElementById('authModalTitle');
  const subtitle = document.getElementById('authModalSubtitle');

  title.textContent = 'כניסה לתכנים';
  subtitle.textContent = 'רמה 1 פתוחה לכולם. לגישה מלאה — הרשמו!';

  body.innerHTML = `
    <div class="auth-tabs">
      <button class="auth-tab active" id="tabRegister">הרשמה</button>
      <button class="auth-tab" id="tabCode">יש לי קוד</button>
    </div>

    <div id="viewRegister">
      <div class="auth-field">
        <label for="authName">שם מלא</label>
        <input type="text" id="authName" placeholder="השם שלך">
      </div>
      <div class="auth-field">
        <label for="authPhone">טלפון</label>
        <input type="tel" id="authPhone" placeholder="050-000-0000">
      </div>
      <div class="auth-field">
        <label for="authEmail">אימייל (אופציונלי — לקבלת הקוד)</label>
        <input type="email" id="authEmail" placeholder="your@email.com">
      </div>
      <button class="auth-submit register" id="authRegisterBtn">\uD83D\uDCDD הרשמה</button>
      <div class="auth-message" id="registerMsg"></div>

      <div id="paymentSection" style="display: none;">
        <div class="auth-payment-box">
          <h3>\uD83D\uDCB3 תשלום חד-פעמי</h3>
          <div class="price">\u20AA${AUTH_CONFIG.price}</div>
          <p>גישה מלאה לכל התכנים — לתמיד!</p>
          <div class="auth-payment-methods">
            <div class="auth-payment-method">
              <span class="pay-icon">\uD83D\uDCF1</span>
              <span>ביט</span>
              <span style="font-size: 0.8rem; color: #64748b;">${AUTH_CONFIG.adminPhone}</span>
            </div>
            <div class="auth-payment-method">
              <span class="pay-icon">\uD83D\uDCB0</span>
              <span>פייבוקס</span>
              <span style="font-size: 0.8rem; color: #64748b;">${AUTH_CONFIG.adminPhone}</span>
            </div>
          </div>
          <p style="margin-top: 12px; font-weight: 600;">\uD83D\uDCCC אחרי התשלום תקבלו קוד גישה במייל או ב-WhatsApp</p>
        </div>
      </div>
    </div>

    <div id="viewCode" style="display: none;">
      <p style="margin-bottom: 12px; color: var(--text-light); font-size: 0.9rem;">
        קיבלת קוד אחרי התשלום? הכניסו אותו כאן:
      </p>
      <div class="auth-field">
        <label for="authCode">קוד גישה</label>
        <input type="text" id="authCode" placeholder="XXXXXXXX"
               style="text-align: center; font-size: 1.3rem; letter-spacing: 3px; font-weight: 700; text-transform: uppercase;">
      </div>
      <button class="auth-submit verify" id="authVerifyBtn">\uD83D\uDD13 כניסה</button>
      <div class="auth-message" id="verifyMsg"></div>
    </div>
  `;

  document.getElementById('tabRegister').addEventListener('click', () => {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('tabCode').classList.remove('active');
    document.getElementById('viewRegister').style.display = 'block';
    document.getElementById('viewCode').style.display = 'none';
  });

  document.getElementById('tabCode').addEventListener('click', () => {
    document.getElementById('tabCode').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
    document.getElementById('viewCode').style.display = 'block';
    document.getElementById('viewRegister').style.display = 'none';
  });

  document.getElementById('authRegisterBtn').addEventListener('click', handleRegister);
  document.getElementById('authVerifyBtn').addEventListener('click', handleVerify);

  document.getElementById('authCode')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleVerify();
  });

  document.getElementById('authOverlay').classList.add('show');
}

function showLoggedInModal() {
  const body = document.getElementById('authModalBody');
  const title = document.getElementById('authModalTitle');
  const subtitle = document.getElementById('authModalSubtitle');

  title.textContent = 'שלום, ' + AuthState.getName() + '!';
  subtitle.textContent = 'יש לך גישה מלאה לכל התכנים';

  body.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 3rem; margin-bottom: 12px;">\u2705</div>
      <p style="font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 4px;">
        גישה מלאה פעילה
      </p>
      <p style="color: var(--text-light); font-size: 0.9rem;">
        כל התכנים והתרגילים פתוחים עבורך
      </p>
      <span class="auth-logout" id="authLogout">התנתקות</span>
    </div>
  `;

  document.getElementById('authLogout').addEventListener('click', () => {
    if (confirm('להתנתק? תצטרך להכניס את הקוד שוב כדי לגשת לתכנים.')) {
      AuthState.clear();
      updateAuthButton();
      closeAuthModal();
      location.reload();
    }
  });

  document.getElementById('authOverlay').classList.add('show');
}

function closeAuthModal() {
  document.getElementById('authOverlay')?.classList.remove('show');
}


/* ===== Handlers ===== */
async function handleRegister() {
  const name = document.getElementById('authName').value.trim();
  const phone = document.getElementById('authPhone').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const msgEl = document.getElementById('registerMsg');
  const btn = document.getElementById('authRegisterBtn');

  if (!name || !phone) {
    showMessage(msgEl, 'error', 'נא למלא שם וטלפון');
    return;
  }

  btn.disabled = true;
  btn.textContent = '\u23F3 שולח...';

  const result = await authApiCall({ action: 'register', name, phone, email });

  btn.disabled = false;
  btn.textContent = '\uD83D\uDCDD הרשמה';

  if (result.success) {
    if (result.existing && result.paid) {
      showMessage(msgEl, 'success', 'כבר רשום ושילמת! עבור ללשונית "יש לי קוד".');
    } else {
      showMessage(msgEl, 'success', result.message || 'נרשמת בהצלחה!');
      document.getElementById('paymentSection').style.display = 'block';
    }
  } else {
    showMessage(msgEl, 'error', result.error || 'שגיאה — נסה שוב');
  }
}

async function handleVerify() {
  const code = document.getElementById('authCode').value.trim();
  const msgEl = document.getElementById('verifyMsg');
  const btn = document.getElementById('authVerifyBtn');

  if (!code) {
    showMessage(msgEl, 'error', 'נא להכניס קוד');
    return;
  }

  btn.disabled = true;
  btn.textContent = '\u23F3 בודק...';

  const result = await authApiCall({ action: 'verify', code });

  btn.disabled = false;
  btn.textContent = '\uD83D\uDD13 כניסה';

  if (result.success && result.valid) {
    AuthState.set({ code: code.toUpperCase(), name: result.name || 'משתמש' });
    showMessage(msgEl, 'success', '\uD83C\uDF89 ' + (result.message || 'מאושר! גישה מלאה הופעלה.'));
    updateAuthButton();

    setTimeout(() => {
      closeAuthModal();
      location.reload();
    }, 1200);
  } else {
    showMessage(msgEl, 'error', result.message || 'קוד לא תקין או שהתשלום טרם אושר');
  }
}

function showMessage(el, type, text) {
  if (!el) return;
  el.className = 'auth-message ' + type;
  el.textContent = text;
  el.style.display = 'block';
}


/* ===== Content Locking ===== */

function isContentUnlocked() {
  return AuthState.isLoggedIn();
}

function addLockOverlay(el, message, subMessage) {
  el.style.position = 'relative';
  el.style.overflow = 'hidden';

  const overlay = document.createElement('div');
  overlay.className = 'auth-locked-overlay';
  overlay.innerHTML = `
    <span class="lock-icon">\uD83D\uDD12</span>
    <p>${message || 'תוכן זה דורש הרשמה'}</p>
    <span class="lock-sub">${subMessage || 'לחצו כאן לפתיחת גישה מלאה'}</span>
  `;
  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    showAuthModal();
  });
  el.appendChild(overlay);
}

function applyContentLocks() {
  if (isContentUnlocked()) return;

  // 1. Generic lock: data-auth-locked="true" (materials page, etc.)
  document.querySelectorAll('[data-auth-locked="true"]').forEach(el => {
    addLockOverlay(el);
  });

  // 2. Premium content: data-premium (exercises, questions, etc.)
  document.querySelectorAll('[data-premium]').forEach(el => {
    addLockOverlay(el);
  });

  // 3. Exercise tabs: lock all tabs except the first
  const exerciseTabs = document.querySelectorAll('.level-tab, .tab-btn, [data-level]');
  if (exerciseTabs.length > 1) {
    exerciseTabs.forEach((tab, index) => {
      if (index === 0) return;

      tab.style.opacity = '0.5';
      tab.style.pointerEvents = 'none';
      tab.style.position = 'relative';

      const lock = document.createElement('span');
      lock.textContent = ' \uD83D\uDD12';
      lock.style.fontSize = '0.8em';
      tab.appendChild(lock);
    });
  }

  // 4. Show upgrade banner if locked content exists
  const hasLockedContent = document.querySelector('[data-auth-locked="true"], [data-premium], .level-tab, .tab-btn, [data-level]');
  if (hasLockedContent) {
    showUpgradeBanner();
  }
}

function showUpgradeBanner() {
  if (document.getElementById('authUpgradeBanner')) return;

  const isExercisePage = document.querySelector('[data-premium], [data-exercise], [data-section], [data-question]');
  const isMaterialsPage = document.querySelector('.materials-content');
  if (!isExercisePage && !isMaterialsPage) return;

  const banner = document.createElement('div');
  banner.id = 'authUpgradeBanner';
  banner.style.cssText = `
    background: linear-gradient(135deg, #dbeafe, #fef3c7);
    border: 2px solid #2563eb;
    border-radius: 12px;
    padding: 16px 20px;
    margin: 16px auto;
    max-width: 600px;
    text-align: center;
    direction: rtl;
    font-family: 'Heebo', sans-serif;
    cursor: pointer;
    position: relative;
    z-index: 50;
  `;
  banner.innerHTML = `
    <p style="font-weight: 700; font-size: 1rem; margin-bottom: 4px; color: #1e293b;">
      \uD83D\uDD13 נהנים? יש עוד המון תוכן!
    </p>
    <p style="font-size: 0.9rem; color: #2563eb; font-weight: 600;">
      לחצו כאן להרשמה — \u20AA${AUTH_CONFIG.price} חד-פעמי לגישה מלאה לכל התכנים
    </p>
  `;
  banner.addEventListener('click', showAuthModal);

  const target = document.querySelector('.container, main');
  if (target) {
    target.insertBefore(banner, target.firstChild);
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }
}


/* ===== Initialize ===== */
document.addEventListener('DOMContentLoaded', () => {
  buildAuthUI();
  applyContentLocks();
});
