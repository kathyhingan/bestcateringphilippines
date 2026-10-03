/* Best Catering Philippines - form submission
   1. Homepage quote form (bottom of page): name, email, phone, occasion, location, guests, date
   2. Quiz result form: name, email, phone + the quiz answers from window.bcpQuizAnswers
   3. Vendor application form
   Posts everything to the Apps Script web app (see apps-script/Code.gs). */

(function () {
  'use strict';

  var ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbxnO-sSHIiuORB328XKVdWvQKKE0h7gquuEhJ-eyiUOL8bs5RtftusnB6qlNUPdbZTK/exec';

  function post(payload, btn, successMsg) {
    if (!ENDPOINT_URL || ENDPOINT_URL.indexOf('http') !== 0) {
      alert('Form endpoint not configured yet. Email journey@luxurytoursphilippines.com instead.');
      return;
    }
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    fetch(ENDPOINT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    }).then(function () {
      btn.textContent = successMsg;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 4000);
    }).catch(function () {
      btn.textContent = 'Something went wrong. Please email us.';
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 4000);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* 1. Quote form (bottom of homepage) */
    var quoteForm = document.querySelector('#quote form.formbox');
    if (quoteForm) {
      var qbtn = quoteForm.querySelector('button[type="submit"]');
      quoteForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        function val(id) {
          var el = document.getElementById(id);
          return el ? el.value : '';
        }
        post({
          type: 'lead',
          source: 'Homepage quote form',
          name: val('qf-name'),
          email: val('qf-email'),
          phone: val('qf-phone'),
          occasion: val('qf-occ'),
          location: val('qf-loc'),
          guests: val('qf-guests'),
          date: val('qf-date')
        }, qbtn, 'Sent. We will respond within 24 hours.');
      });
    }

    /* 2. Quiz result form: quiz answers (window.bcpQuizAnswers) + contact details.
       The form is injected by home.js only after the quiz completes, so bind via
       document-level delegation (submit events bubble) instead of at load time. */
    document.addEventListener('submit', function (ev) {
      var form = ev.target;
      if (!form || form.id !== 'qform-result') return;
      ev.preventDefault();
      var qa = window.bcpQuizAnswers || {};
      function val(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
      }
      post({
        type: 'lead',
        source: 'Quiz result (Plan My Celebration)',
        name: val('qr-name'),
        email: val('qr-email'),
        phone: val('qr-phone'),
        occasion: qa.occasion || '',
        vibe: qa.vibe || '',
        guests: qa.guests || '',
        date: qa.date || '',
        location: qa.location || '',
        budget: qa.budget || ''
      }, form.querySelector('button[type="submit"]'), 'Sent. We will respond within 24 hours.');
    });

    /* 3. Vendor application form */
    var vendorForm = document.querySelector('form.formbox#vendorForm') ||
                     (document.getElementById('vf-company') ?
                      document.getElementById('vf-company').closest('form') : null);
    if (vendorForm) {
      var vbtn = vendorForm.querySelector('button[type="submit"]');
      vendorForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        function val(id) {
          var el = document.getElementById(id);
          return el ? el.value : '';
        }
        post({
          type: 'vendor',
          company: val('vf-company'),
          contactPerson: val('vf-contact'),
          phone: val('vf-phone'),
          email: val('vf-email'),
          cities: val('vf-cities'),
          capacity: val('vf-cap'),
          occasionTypes: val('vf-occ'),
          years: val('vf-years')
        }, vbtn, 'Application received. We will review and follow up.');
      });
    }
  });
})();
