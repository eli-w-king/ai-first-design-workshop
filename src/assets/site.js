(() => {
  'use strict';
  const announcement = document.getElementById('announcement');
  const announce = text => { if (announcement) announcement.textContent = text; };
  const enableCopies = () => document.querySelectorAll('[data-copy]').forEach(button => { button.hidden = false; });
  enableCopies();

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    const code = document.getElementById(button.dataset.copy);
    if (!code) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code.textContent);
      const label = button.dataset.copyLabel || button.getAttribute('aria-label');
      button.dataset.copyLabel = label;
      button.textContent = 'Copied';
      button.setAttribute('aria-label', 'Copied');
      announce('Copied to the clipboard.');
      clearTimeout(button.copyTimer);
      button.copyTimer = setTimeout(() => { button.textContent = 'Copy'; button.setAttribute('aria-label', label); }, 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      announce('Clipboard access is unavailable. The text is selected so you can copy it yourself.');
    }
  });

  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (menu && nav) {
    menu.hidden = false;
    const close = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = 'Menu'; };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { close(); menu.focus(); }
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    matchMedia('(min-width: 851px)').addEventListener('change', close);
  }

  const form = document.getElementById('lock-form');
  if (!form) return;
  const input = document.getElementById('course-password');
  const remember = document.getElementById('remember-course');
  const status = document.getElementById('lock-status');
  const locked = document.getElementById('course-locked');
  const opened = document.getElementById('course-open');
  const holder = document.getElementById('course-content');
  const access = document.getElementById('course-access-status');
  const submit = form.querySelector('button[type="submit"]');
  const STORE = 'ai-first-design-workshop:course:v1';
  let payload;
  let busy = false;
  const bytes = text => Uint8Array.from(atob(text), ch => ch.charCodeAt(0));
  const base64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const message = (text, error = false) => { status.textContent = text; status.classList.toggle('is-error', error); };
  const forget = () => {
    try { localStorage.removeItem(STORE); return true; } catch { return false; }
  };
  const loadPayload = async () => {
    if (payload) return payload;
    const response = await fetch(form.dataset.payload, { cache: 'no-cache', credentials: 'same-origin' });
    if (!response.ok) throw new Error('load');
    const data = await response.json();
    if (data.version !== 1 || data.kdf !== 'PBKDF2' || data.hash !== 'SHA-256' || data.iterations !== 600000 || data.cipher !== 'AES-GCM' || bytes(data.salt).length !== 16 || bytes(data.iv).length !== 12 || bytes(data.ct).length <= 16) throw new Error('load');
    payload = data;
    return data;
  };
  const decrypt = async raw => {
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(payload.iv), tagLength: 128 }, key, bytes(payload.ct));
    const result = JSON.parse(new TextDecoder().decode(plain));
    if (result.version !== 1 || typeof result.html !== 'string') throw new Error('payload');
    return result.html;
  };
  const show = (html, remembered, fromForm, storageBlocked = false) => {
    holder.innerHTML = html;
    locked.hidden = true;
    opened.hidden = false;
    document.documentElement.dataset.course = 'open';
    input.value = '';
    input.removeAttribute('aria-invalid');
    message('');
    access.textContent = remembered ? 'Remembered on this device. Choose Forget access when you want to lock it again.' : storageBlocked ? "Open for this visit. This browser could not save access." : 'Open for this visit. Reloading will ask for the password again.';
    enableCopies();
    document.dispatchEvent(new Event('course:open'));
    if (fromForm) { document.getElementById('course-heading').focus(); announce('The take-home is open.'); }
    if (location.hash) {
      try { holder.querySelector(`#${CSS.escape(decodeURIComponent(location.hash.slice(1)))}`)?.scrollIntoView(); } catch { /* Invalid fragments do not prevent access. */ }
    }
  };
  const setBusy = value => {
    busy = value;
    submit.disabled = value;
    input.disabled = value;
    remember.disabled = value;
    form.setAttribute('aria-busy', String(value));
  };

  input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); message(''); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    if (!window.crypto?.subtle) { message('This browser needs a secure connection to open the course. Use the HTTPS workshop link in a current browser.', true); return; }
    if (!input.value) { message('Enter the password from your welcome sheet.', true); input.focus(); return; }
    setBusy(true);
    message('Opening your take-home...');
    let raw;
    let loaded = false;
    try {
      await loadPayload();
      loaded = true;
      const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(input.value), 'PBKDF2', false, ['deriveBits']);
      raw = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes(payload.salt), iterations: payload.iterations }, material, 256));
      const html = await decrypt(raw);
      let saved = false;
      if (remember.checked) {
        try { localStorage.setItem(STORE, JSON.stringify({ salt: payload.salt, key: base64(raw) })); saved = true; } catch { /* The course still opens without persistent storage. */ }
      } else forget();
      show(html, saved, true, remember.checked && !saved);
    } catch {
      message(loaded ? "That password didn't work. Check your welcome sheet and try again." : "The course could not load. Check your connection and try again.", true);
      if (loaded) input.setAttribute('aria-invalid', 'true');
    } finally {
      raw?.fill(0);
      setBusy(false);
      if (!locked.hidden) { input.focus(); input.select(); }
    }
  });

  document.getElementById('forget-course').addEventListener('click', () => {
    const cleared = forget();
    holder.replaceChildren();
    opened.hidden = true;
    locked.hidden = false;
    document.documentElement.dataset.course = 'locked';
    remember.checked = false;
    input.value = '';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    message(cleared ? 'Access forgotten. Enter the password to open it again.' : "The page is locked, but saved access could not be removed. Clear this site's browser data before leaving this device.", !cleared);
    input.focus();
    document.dispatchEvent(new Event('course:open'));
  });

  (async () => {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch { return; }
    if (!saved) return;
    if (!window.crypto?.subtle) return;
    setBusy(true);
    message('Opening your saved access...');
    let raw;
    try {
      await loadPayload();
      if (saved.salt !== payload.salt) throw new Error('changed');
      raw = bytes(saved.key);
      show(await decrypt(raw), true, false);
    } catch {
      forget();
      message('Enter the password from your welcome sheet to open the current course.');
    } finally {
      raw?.fill(0);
      setBusy(false);
    }
  })();
})();
