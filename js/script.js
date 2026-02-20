document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Snackbar helper
  function showSnackbar(message, type) {
    const snackbar = document.getElementById('snackbar');
    if (!snackbar) return;
    snackbar.innerHTML = message;
    snackbar.className = 'snackbar';
    snackbar.classList.add('snackbar--' + type, 'snackbar--visible');

    setTimeout(() => {
      snackbar.classList.remove('snackbar--visible');
    }, 6000);
  }

  // Web3Forms AJAX submission
  const form = document.getElementById('contact-form');
  if (form) {
    const btn = document.getElementById('contact-submit');
    const originalText = btn.textContent;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form)
        });
        const data = await res.json();

        if (data.success) {
          showSnackbar('Thank you! We will call you shortly.', 'success');
          form.reset();
          btn.textContent = originalText;
          btn.disabled = false;
        } else {
          showSnackbar('Message failed. Please email us directly at <a href="mailto:support@peeledonion.in">support@peeledonion.in</a>', 'error');
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        showSnackbar('Message failed. Please email us directly at <a href="mailto:support@peeledonion.in">support@peeledonion.in</a>', 'error');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
});
