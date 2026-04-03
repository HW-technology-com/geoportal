/**
 * contact.js — Formulario de contacto con validación
 */
const Contact = (() => {
  function validate(id, errId, rule, msg) {
    const el = document.getElementById(id);
    const er = document.getElementById(errId);
    if (!el || !er) return true;
    if (!rule(el.value.trim())) {
      er.textContent = msg;
      el.style.borderColor = '#ef4444';
      return false;
    }
    er.textContent = '';
    el.style.borderColor = '';
    return true;
  }

  function submit(e) {
    e.preventDefault();
    const v1 = validate('contactName',  'err-name',  v => v.length >= 2, 'Mínimo 2 caracteres.');
    const v2 = validate('contactEmail', 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Correo inválido.');
    const v3 = validate('contactMsg',   'err-msg',   v => v.length >= 10, 'Mínimo 10 caracteres.');
    if (!v1 || !v2 || !v3) return;

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const msg     = document.getElementById('contactMsg').value.trim();
    const btn     = document.getElementById('btnSubmit');
    btn.disabled  = true;
    btn.textContent = 'Enviando...';

    const mailto = 'mailto:soluciones@dronesfalcon.co'
      + '?subject=' + encodeURIComponent('[GeoPortal] ' + (subject || 'Consulta') + ' - ' + name)
      + '&body='    + encodeURIComponent('Nombre: ' + name + '\nCorreo: ' + email + '\n\n' + msg);

    window.location.href = mailto;
    setTimeout(() => {
      document.getElementById('contactForm').reset();
      document.getElementById('formSuccess').style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
      setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 5000);
    }, 600);
  }

  return { submit };
})();
