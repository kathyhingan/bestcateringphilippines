/* Best Catering Philippines - form submission
   Posts the quote form and vendor application form to the Apps Script web app.
   Set ENDPOINT_URL once after deploying the Apps Script web app (see apps-script/Code.gs). */

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

  /* Quote form (homepage): name, contact, occasion, location, guests, date */
  document.addEventListener('DOMContentLoaded', function () {
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
          contact: val('qf-contact'),
          occasion: val('qf-occ'),
          location: val('qf-loc'),
          guests: val('qf-guests'),
          date: val('qf-date')
        }, qbtn, 'Sent. We will respond within 24 hours.');
      });
    }

    /* Vendor application form: company, contact person, phone, email, cities, capacity, occasion types, years */
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
