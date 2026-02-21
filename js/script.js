document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    const year = new Date().getFullYear();
    if (Number.isFinite(year)) {
      yearSpan.textContent = String(year);
    }
  }

  // Snackbar helper (use allowHtml: true only when message contains safe HTML, e.g. mailto link)
  let snackbarHideTimeoutId = null;
  function showSnackbar(message, type, allowHtml = false) {
    const snackbar = document.getElementById('snackbar');
    if (!snackbar) return;
    if (snackbarHideTimeoutId !== null) {
      clearTimeout(snackbarHideTimeoutId);
      snackbarHideTimeoutId = null;
    }
    if (allowHtml) {
      snackbar.innerHTML = message;
    } else {
      snackbar.textContent = message;
    }
    snackbar.className = 'snackbar';
    snackbar.classList.add('snackbar--' + type, 'snackbar--visible');

    snackbarHideTimeoutId = setTimeout(() => {
      snackbar.classList.remove('snackbar--visible');
      snackbarHideTimeoutId = null;
    }, 6000);
  }

  // Web3Forms AJAX submission (guard: require both form and submit button)
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('contact-submit');
  if (!form || !btn) return;

  const originalText = btn.textContent;
  function resetButton() {
    btn.textContent = originalText;
    btn.disabled = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const minLoadingMs = 600;
    const loadingStarted = Date.now();

    try {
      btn.disabled = true;
      btn.textContent = 'Sending...';

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success) {
        showSnackbar('Thank you! We will call you shortly.', 'success');
        form.reset();
      } else {
        showSnackbar('Message failed. Please email us directly at <a href="mailto:support@peeledonion.in">support@peeledonion.in</a>', 'error', true);
      }
    } catch (err) {
      showSnackbar('Message failed. Please email us directly at <a href="mailto:support@peeledonion.in">support@peeledonion.in</a>', 'error', true);
    } finally {
      const elapsed = Date.now() - loadingStarted;
      if (elapsed >= minLoadingMs) {
        resetButton();
      } else {
        setTimeout(resetButton, minLoadingMs - elapsed);
      }
    }
  });
});
