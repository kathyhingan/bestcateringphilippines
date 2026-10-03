/* Best Catering Philippines - homepage behaviour
   1. Events carousel (rail, arrows, dots)
   2. Inline "Plan My Celebration" quiz
   3. FAQ accordions (one open at a time, per faqlist group)
   No em dashes anywhere in output strings. */

(function () {
  'use strict';

  /* ---------------- -1. FAQ accordions ---------------- */
  /* Native <details>/<summary>, content always present for crawlers/schema.
     JS only enforces "one open at a time" within each .faqlist group;
     without JS every item still opens/closes independently and fine. */
  Array.prototype.forEach.call(document.querySelectorAll('.faqlist'), function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll('details.faqitem'));
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  /* ---------------- 0. Mobile hamburger menu ---------------- */
  var burger = document.getElementById('burgerBtn');
  var panel = document.getElementById('mobilePanel');
  var navEl = document.querySelector('header.nav');
  if (burger && panel) {
    var setNavH = function () {
      var h = navEl ? navEl.getBoundingClientRect().height : 64;
      document.documentElement.style.setProperty('--mobile-nav-h', h + 'px');
    };
    setNavH();
    window.addEventListener('resize', setNavH);

    var closeMenu = function () {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
    };
    var openMenu = function () {
      setNavH();
      panel.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('menu-open');
    };
    burger.addEventListener('click', function () {
      panel.classList.contains('open') ? closeMenu() : openMenu();
    });
    // close on link tap, escape, or resize past the mobile breakpoint
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------------- 1. Events carousel ---------------- */
  var rail = document.getElementById('rail');
  if (rail) {
    var prev = document.getElementById('rprev');
    var next = document.getElementById('rnext');
    var dotsBox = document.getElementById('rdots');
    var slides = Array.prototype.slice.call(rail.querySelectorAll('.slide'));

    function step() {
      var s = rail.querySelector('.slide');
      return s ? s.getBoundingClientRect().width + 20 : 320;
    }
    if (prev) prev.addEventListener('click', function () {
      rail.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      rail.scrollBy({ left: step(), behavior: 'smooth' });
    });

    // dots: one per slide
    if (dotsBox) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', function () {
          rail.scrollTo({ left: i * step(), behavior: 'smooth' });
        });
        dotsBox.appendChild(b);
      });
    }

    function sync() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
      var dots = dotsBox ? dotsBox.children : [];
      if (dots.length) {
        var idx = Math.round(rail.scrollLeft / step());
        for (var i = 0; i < dots.length; i++) {
          dots[i].className = (i === idx) ? 'on' : '';
        }
      }
    }
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---------------- 2. Inline quiz ---------------- */
  var STEPS = [
    {
      key: 'occasion', label: 'What are we celebrating?',
      sub: 'Tap one to begin.',
      opts: [
        { v: 'Weddings', d: 'Full-service and destination' },
        { v: 'Christenings', d: 'Family and sponsors' },
        { v: 'Birthdays', d: 'Every milestone year' },
        { v: '18th Debuts', d: 'Cotillion and full service' },
        { v: 'Graduations', d: 'Milestone celebrations' },
        { v: 'Corporate Events', d: 'Company and MICE' },
        { v: 'Christmas', d: 'Parties and reunions' },
        { v: 'New Year', d: 'Countdown celebrations' }
      ]
    },
    {
      key: 'vibe', label: 'What is the vibe?',
      sub: 'No wrong answer. This shapes the menu, the room and how we brief your caterer.',
      opts: [
        { v: 'Garden Elegance', d: 'Greenery, long tables, daylight' },
        { v: 'Grand Ballroom', d: 'Chandeliers and full service' },
        { v: 'Beachfront Celebration', d: 'Sunset, sand, open air' },
        { v: 'Modern Chic', d: 'Clean lines, plated service' },
        { v: 'Filipino Fiesta', d: 'Generous, warm, abundant' },
        { v: 'Intimate Luxury', d: 'Small room, high detail' }
      ]
    },
    {
      key: 'guests', label: 'How many are you celebrating with?',
      sub: 'This sets what we can realistically deliver.',
      opts: [
        { v: 'Under 50', d: 'An intimate room' },
        { v: '50 to 100', d: 'A full hall' },
        { v: '100+', d: 'A large-scale production' }
      ]
    },
    { key: 'date', label: 'When is the big day?', sub: 'A month and year is enough for now.', date: true },
    {
      key: 'location', label: 'Where will it be?',
      sub: 'Ten locations, all live at launch.', unsure: 'Not sure yet',
      opts: [
        { v: 'Metro Manila', d: 'Ballroom and estate' },
        { v: 'Calabarzon', d: 'Tagaytay and Batangas' },
        { v: 'Palawan', d: 'Destination and resort' },
        { v: 'Cebu', d: 'Resort and heritage' },
        { v: 'Baguio', d: 'Highland and garden' },
        { v: 'La Union', d: 'Boutique and surf' },
        { v: 'Ilocos', d: 'Heritage and estate' },
        { v: 'Clark', d: 'Resort and MICE' },
        { v: 'Subic', d: 'Resort and bayfront' },
        { v: 'Boracay', d: 'Beachfront and resort' }
      ]
    },
    {
      key: 'budget', label: 'What is your budget range?',
      sub: 'Bands, not exact figures.', 
      opts: [
        { v: 'Below 100,000 pesos', d: 'Below our managed minimum' },
        { v: '150,000 to 250,000 pesos', d: 'Managed, standard scale' },
        { v: '250,000 to 500,000 pesos', d: 'Managed, larger scale' },
        { v: '500,000 pesos and above', d: 'Managed, full production' }
      ]
    }
  ];

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var YEARS = ['2026','2027','2028','2029','Not sure yet'];

  var elStep = document.getElementById('qstep');
  var elLabel = document.getElementById('qlabel');
  var elFill = document.getElementById('qfill');
  var elContent = document.getElementById('qcontent');
  var elControls = document.getElementById('qcontrols');
  if (!elContent) return;

  var idx = 0;
  var answers = {};
  var dp = { m: '', y: '' };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function qualifies() {
    var g = answers.guests;
    var b = answers.budget || '';
    var bigGuests = (g === '50 to 100' || g === '100+');
    var bigBudget = /^(150,000|250,000|500,000)/.test(b);
    return bigGuests && bigBudget;
  }
  function profileLine() {
    var v = answers.vibe || '';
    var o = answers.occasion || 'celebration';
    var g = answers.guests || '';
    var l = answers.location || '';
    var d = answers.date || '';
    var adj = {
      'Garden Elegance': 'A Grand Garden',
      'Grand Ballroom': 'A Grand Ballroom',
      'Beachfront Celebration': 'A Beachfront',
      'Modern Chic': 'A Modern',
      'Filipino Fiesta': 'A Fiesta',
      'Intimate Luxury': 'An Intimate'
    }[v] || 'A';
    var noun = (o === 'Weddings') ? 'Wedding' : (o.slice(-1) === 's' ? o.slice(0, -1) : o);
    var guests = g ? ' for ' + g + ' guests' : '';
    var where = (l && l !== 'Not sure yet') ? ' in ' + l : '';
    var when = (d && d !== 'Not sure yet') ? ', ' + d : (d === 'Not sure yet' ? ', date still open' : '');
    return adj + ' ' + noun + where + guests + when;
  }

  function render() {
    if (idx >= STEPS.length) { renderResult(); return; }
    var s = STEPS[idx];
    var val = answers[s.key];

    elStep.textContent = 'Step ' + (idx + 1) + ' of ' + STEPS.length;
    elLabel.textContent = s.label;
    elFill.style.width = (((idx + 1) / STEPS.length) * 100).toFixed(1) + '%';

    var html = '<h3>' + esc(s.label) + '</h3>';
    html += '<p class="qsub">' + esc(s.sub) + '</p>';

    if (s.date) {
      html += '<div class="qdate">';
      html += '<div class="field"><label for="qm">Month</label><select id="qm"><option value="">Select month</option>';
      MONTHS.forEach(function (m) { html += '<option' + (dp.m === m ? ' selected' : '') + '>' + m + '</option>'; });
      html += '</select></div>';
      html += '<div class="field"><label for="qy">Year</label><select id="qy"><option value="">Select year</option>';
      YEARS.forEach(function (y) { html += '<option' + (dp.y === y ? ' selected' : '') + '>' + y + '</option>'; });
      html += '</select></div>';
      html += '<button class="qchip" id="qunsure" type="button" aria-pressed="' + (answers.date === 'Not sure yet') + '">Not sure yet</button>';
      html += '</div>';
    } else {
      html += '<div class="qopts">';
      s.opts.forEach(function (o) {
        html += '<button class="qopt" type="button" data-v="' + esc(o.v) + '" aria-pressed="' + (val === o.v) + '">';
        html += '<span class="t">' + esc(o.v) + '</span><span class="d">' + esc(o.d) + '</span></button>';
      });
      html += '</div>';
      if (s.unsure) {
        html += '<button class="qchip" id="qunsure" type="button" aria-pressed="' + (val === s.unsure) + '">' + esc(s.unsure) + '</button>';
      }
    }
    elContent.innerHTML = html;

    // controls
    var ctrl = '';
    if (idx > 0) ctrl += '<button class="btn ghost" id="qback" type="button">Back</button>';
    var last = (idx === STEPS.length - 1);
    ctrl += '<button class="btn on-mag" id="qnext" type="button"' + (val ? '' : ' disabled') + '>' +
            (last ? 'See my profile' : 'Continue') + '</button>';
    ctrl += '<span class="qhint">' + (val ? 'Selected' : 'Pick one to continue') + '</span>';
    elControls.innerHTML = ctrl;

    // wire
    Array.prototype.forEach.call(elContent.querySelectorAll('.qopt'), function (b) {
      b.addEventListener('click', function () {
        answers[s.key] = b.getAttribute('data-v');
        render();
      });
    });
    var unsure = document.getElementById('qunsure');
    if (unsure) unsure.addEventListener('click', function () {
      answers[s.key] = s.date ? 'Not sure yet' : s.unsure;
      if (s.date) { dp = { m: '', y: '' }; }
      render();
    });
    if (s.date) {
      function sync() {
        dp.m = document.getElementById('qm').value;
        dp.y = document.getElementById('qy').value;
        answers.date = (dp.m && dp.y) ? dp.m + ' ' + dp.y : '';
        var nx = document.getElementById('qnext');
        nx.disabled = !answers.date;
        elControls.querySelector('.qhint').textContent = answers.date ? 'Selected' : 'Pick a month and year';
      }
      document.getElementById('qm').addEventListener('change', sync);
      document.getElementById('qy').addEventListener('change', sync);
    }
    var back = document.getElementById('qback');
    if (back) back.addEventListener('click', function () { idx--; dp = { m: '', y: '' }; render(); });
    document.getElementById('qnext').addEventListener('click', function () {
      idx++; dp = { m: '', y: '' }; render();
    });
  }

  function renderResult() {
    var q = qualifies();
    var scroller = document.getElementById('quiz');
    elStep.textContent = 'Your Celebration Profile';
    elLabel.textContent = '';
    elFill.style.width = '100%';

    // expose quiz answers for the result form submission (forms.js reads this)
    window.bcpQuizAnswers = {
      occasion: answers.occasion, vibe: answers.vibe, guests: answers.guests,
      location: answers.location, date: answers.date, budget: answers.budget
    };

    var recap = [
      ['Occasion', answers.occasion], ['Vibe', answers.vibe], ['Guests', answers.guests],
      ['Location', answers.location], ['Date', answers.date], ['Budget band', answers.budget]
    ].map(function (r) {
      return '<div>' + esc(r[0]) + '<b>' + esc(r[1] || 'Any') + '</b></div>';
    }).join('');

    var body;
    if (q) {
      body =
        '<span class="badge">Qualified for full management</span>' +
        '<h3>Here is exactly where this goes next.</h3>' +
        '<p>You are within our managed range: 50 to 100+ guests, and 150,000 pesos and up. From here we take it end to end.</p>' +
        '<ul>' +
        '<li><b>We source and vet.</b> Real local caterers for ' + esc(answers.location || 'your city') + ', competitive bids.</li>' +
        '<li><b>You get one quote within 24 hours.</b> One clear price, nothing hidden.</li>' +
        '<li><b>We stay accountable.</b> A backup vendor on call, an on-site coordinator, and a pre-event confirmation before your date.</li>' +
        '</ul>' +
        '<form class="formbox qform-result" id="qform-result" onsubmit="return false">' +
        '<p class="qf-head">Leave your details and we take it from here. One clear quote within 24 hours.</p>' +
        '<div class="fieldrow">' +
        '<div class="field"><label for="qr-name">Full name</label><input id="qr-name" type="text" required></div>' +
        '</div>' +
        '<div class="fieldrow">' +
        '<div class="field"><label for="qr-email">Email address</label><input id="qr-email" type="email" required></div>' +
        '<div class="field"><label for="qr-phone">Mobile number</label><input id="qr-phone" type="tel" placeholder="09xx XXX XXXX" required></div>' +
        '</div>' +
        '<button class="btn on-mag" type="submit">Send my enquiry</button>' +
        '</form>';
    } else {
      body =
        '<span class="badge sub">A smaller celebration</span>' +
        '<h3>We want to be straight with you.</h3>' +
        '<p>Based on what you have told us, your celebration sits below the scale we manage directly. Our full service covers guest counts of 50 to 100+ and budgets of 150,000 pesos and up, with a flat 50,000 peso coordination fee.</p>' +
        '<p>That does not mean we cannot help. Send us your details and we will point you to catering options that genuinely fit your budget. Be aware the guarantee above does not apply at this scale, and we will not pretend otherwise.</p>' +
        '<form class="formbox qform-result" id="qform-result" onsubmit="return false">' +
        '<p class="qf-head">Leave your details and we will point you to catering options that genuinely fit your budget.</p>' +
        '<div class="fieldrow">' +
        '<div class="field"><label for="qr-name">Full name</label><input id="qr-name" type="text" required></div>' +
        '</div>' +
        '<div class="fieldrow">' +
        '<div class="field"><label for="qr-email">Email address</label><input id="qr-email" type="email" required></div>' +
        '<div class="field"><label for="qr-phone">Mobile number</label><input id="qr-phone" type="tel" placeholder="09xx XXX XXXX" required></div>' +
        '</div>' +
        '<button class="btn on-mag" type="submit">Send my details</button>' +
        '</form>';
    }

    elContent.innerHTML =
      '<div class="qresult">' +
      '<div class="pline">' +
      '<div class="kick">Your Celebration Profile</div>' +
      '<h3>' + esc(profileLine()) + '</h3>' +
      '<div class="recap">' + recap + '</div>' +
      '</div>' +
      '<div class="route">' + body +
      '<p style="margin-top:18px"><button class="qrestart" id="qrestart" type="button">Start again</button></p>' +
      '</div></div>';

    elControls.innerHTML = '';
    document.getElementById('qrestart').addEventListener('click', function () {
      idx = 0; answers = {}; dp = { m: '', y: '' }; render();
      if (scroller) scroller.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  render();
})();
