// ── Resumaiz Shared Utilities ──

const RZ = {
  // Config — replace with your real values
  STRIPE_REWRITE_LINK: 'https://buy.stripe.com/REPLACE_WITH_YOUR_REWRITE_LINK',
  STRIPE_PRO_LINK: 'https://buy.stripe.com/REPLACE_WITH_YOUR_PRO_LINK',
  PRO_PAGE: 'resumaiz-pro.html',
  HOME_PAGE: 'index.html',

  // Check if user has paid (set via Stripe success redirect)
  isPro() {
    return localStorage.getItem('rz_plan') === 'pro';
  },

  isRewritePurchased() {
    return localStorage.getItem('rz_rewrite_paid') === 'true' || this.isPro();
  },

  // Mark as paid (called from success page)
  setPro() {
    localStorage.setItem('rz_plan', 'pro');
    localStorage.setItem('rz_plan_date', new Date().toISOString());
  },

  setRewritePaid() {
    localStorage.setItem('rz_rewrite_paid', 'true');
  },

  // Profile
  getProfile() {
    try { return JSON.parse(localStorage.getItem('rz_profile') || '{}'); }
    catch { return {}; }
  },

  saveProfile(data) {
    localStorage.setItem('rz_profile', JSON.stringify(data));
  },

  // Applications
  getApps() {
    try { return JSON.parse(localStorage.getItem('rz_apps') || '[]'); }
    catch { return []; }
  },

  saveApps(apps) {
    localStorage.setItem('rz_apps', JSON.stringify(apps));
  },

  // Kits counter
  getKitsCount() {
    return parseInt(localStorage.getItem('rz_kits') || '0');
  },

  incrementKits() {
    const n = this.getKitsCount() + 1;
    localStorage.setItem('rz_kits', n);
    return n;
  },

  FREE_KIT_LIMIT: 2,

  canGenerateKit() {
    return this.isPro() || this.getKitsCount() < this.FREE_KIT_LIMIT;
  },

  // Email capture
  getCapturedEmail() {
    return localStorage.getItem('rz_email') || '';
  },

  saveEmail(email) {
    localStorage.setItem('rz_email', email);
  },

  // AI call via secure serverless function
  async callAI(prompt, timeoutMs = 45000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch('/.netlify/functions/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error('API error ' + res.status);
      const data = await res.json();
      const text = data.content.map(i => i.text || '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error('TIMEOUT');
      throw err;
    }
  },

  // Toast notification
  showToast(msg, type = 'default') {
    let toast = document.getElementById('rz-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'rz-toast';
      toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);padding:12px 24px;border-radius:100px;font-size:13px;font-weight:600;opacity:0;transition:all 0.3s;z-index:9999;white-space:nowrap;font-family:Outfit,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.3)';
      document.body.appendChild(toast);
    }
    const colors = {
      default: 'background:#1c1c1f;color:#f0ede8;border:1px solid #2a2a2f',
      success: 'background:#0d2a1a;color:#34c77b;border:1px solid rgba(52,199,123,0.3)',
      error: 'background:#2a0d0d;color:#ff5c5c;border:1px solid rgba(255,92,92,0.3)',
      gold: 'background:#1a1200;color:#d4a843;border:1px solid rgba(212,168,67,0.3)'
    };
    toast.style.cssText += ';' + (colors[type] || colors.default);
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3000);
  },

  // Copy text to clipboard
  copyText(text, label = 'Copied!') {
    navigator.clipboard.writeText(text)
      .then(() => RZ.showToast('📋 ' + label, 'success'))
      .catch(() => {
        const t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t);
        t.select(); document.execCommand('copy');
        document.body.removeChild(t);
        RZ.showToast('📋 ' + label, 'success');
      });
  },

  // Format date
  formatDate(d = new Date()) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  // Stripe redirect
  goToCheckout(type = 'rewrite') {
    const link = type === 'pro' ? this.STRIPE_PRO_LINK : this.STRIPE_REWRITE_LINK;
    if (link.includes('REPLACE_WITH')) {
      RZ.showToast('⚠ Add your Stripe links in rz-utils.js', 'error');
      return;
    }
    window.location.href = link;
  }
};

// Check for Stripe success redirect
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('payment') === 'success') {
  const type = urlParams.get('type');
  if (type === 'pro') RZ.setPro();
  if (type === 'rewrite') RZ.setRewritePaid();
  RZ.showToast('✓ Payment confirmed — welcome!', 'success');
  window.history.replaceState({}, '', window.location.pathname);
}
