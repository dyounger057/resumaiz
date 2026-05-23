# Resumaiz — Setup Instructions

## Files in This Folder
- `index.html` — Main landing page / resume rewriter ($29 product)
- `resumaiz-pro.html` — Full Pro dashboard ($49/mo product)
- `privacy.html` — Privacy policy (required by Stripe)
- `terms.html` — Terms of service (required by Stripe)
- `404.html` — Custom 404 page
- `rz-utils.js` — Shared utilities (config lives here)
- `netlify/functions/ai.js` — Secure API proxy (keeps your key hidden)
- `netlify.toml` — Netlify configuration
- `_redirects` — URL routing rules

---

## 3-Step Setup Before Going Live

### 1. Add Your Stripe Links
Open `rz-utils.js` and replace:
```
STRIPE_REWRITE_LINK: 'https://buy.stripe.com/REPLACE_WITH_YOUR_REWRITE_LINK'
STRIPE_PRO_LINK: 'https://buy.stripe.com/REPLACE_WITH_YOUR_PRO_LINK'
```

### 2. Add Your Anthropic API Key
In Netlify:
- Go to Site Settings → Environment Variables
- Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com

### 3. Remove the Demo Bypass Button
In `index.html`, find and delete this section:
```html
<!-- DEV MODE: bypass payment for demo -->
<div style="text-align:center;margin-top:12px">
  <button onclick="bypassPayment()">DEMO: Skip payment & generate</button>
</div>
```

---

## Deploy to Netlify
1. Drag this entire folder to app.netlify.com/drop
2. Set your environment variable (ANTHROPIC_API_KEY)
3. Done — your site is live

## Custom Domain
1. Buy domain on namecheap.com
2. Netlify → Domain Management → Add Domain
3. Follow DNS setup instructions

## Support
hello@resumaiz.com
