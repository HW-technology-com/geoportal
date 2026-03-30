/**
 * contact.js — Módulo de Contacto
 * Validación de formulario y envío via mailto / EmailJS.
 */

const Contact = (() => {

  // Valida un campo y muestra error si aplica
  function validate(id, errorId, rule, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    if (!el || !err) return true;
    if (!rule(el.value.trim())) {
      err.textContent = msg;
      el.style.borderColor = '#ef4444';
      return false;
    }
    err.textContent = '';
    el.style.borderColor = '';
    return true;
  }

  // Valida todo el formulario
  function validateAll() {
    const v1 = validate('contactName',  'err-name',  v => v.length >= 2,              'El nombre debe tener al menos 2 caracteres.');
    const v2 = validate('contactEmail', 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Ingresa un correo válido.');
    const v3 = validate('contactMsg',   'err-msg',   v => v.length >= 10,             'El mensaje debe tener al menos 10 caracteres.');
    return v1 && v2 && v3;
  }

  // Envía el formulario
  function submit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const msg     = document.getElementById('contactMsg').value.trim();

    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Construir enlace mailto como fallback
    const mailtoLink = `mailto:aquiroz@acvcran.onmicrosoft.com`
      + `?subject=${encodeURIComponent(`[GeoPortal] ${subject || 'Consulta'} — ${name}`)}`
      + `&body=${encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${msg}`)}`;

    // Intentar EmailJS si está disponible, si no usar mailto
    if (typeof emailjs !== 'undefined') {
      emailjs.send('service_acvc', 'template_geoportal', {
        from_name: name,
        from_email: email,
        subject: subject,
        message: msg
      }).then(
        () => showSuccess(),
        () => { window.location.href = mailtoLink; showSuccess(); }
      );
    } else {
      // Abrir cliente de correo local
      window.location.href = mailtoLink;
      setTimeout(showSuccess, 500);
    }
  }

  function showSuccess() {
    document.getElementById('contactForm').reset();
    document.getElementById('formSuccess').style.display = 'block';
    const btn = document.getElementById('btnSubmit');
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg> Enviar mensaje`;
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 6000);
  }

  return { submit, validateAll };
})();
