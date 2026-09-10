/* peptides.site lead capture widget — self-contained (CSS + card + pill + submit) */
(function () {
  var CFG = {
    magnet: 'Peptide Dosage & Reconstitution Cheat Sheet',
    guideUrl: '/lead-magnets/peptides-cheatsheet.html',
    title: '\uD83D\uDCD8 Free Peptide Cheat Sheet',
    desc: 'Reconstitution steps, a dosage conversion table, and storage rules on one page. For research reference.',
    webhook: 'https://n8n.getmicroservices.co/webhook/lead-magnet-cf9a4e2b'
  };

  var css = ''
    + '.pep-lm-wrap{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:"Atkinson Hyperlegible",system-ui,sans-serif;}'
    + '.pep-lm-pill{background:#EA580C;color:#fff;border:none;border-radius:999px;padding:12px 20px;font-size:0.95rem;font-weight:700;cursor:pointer;box-shadow:0 10px 30px -8px rgba(234,88,12,0.6);font-family:inherit;}'
    + '.pep-lm-pill:hover{opacity:0.92;}'
    + '.pep-lm-card{display:none;background:#fff;border:1px solid #C7D2FE;border-left:6px solid #4F46E5;border-radius:16px;padding:22px;max-width:330px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);position:relative;}'
    + '.pep-lm-card.open{display:block;}'
    + '.pep-lm-card h3{font-family:"Crimson Pro",serif;font-size:1.3rem;line-height:1.15;margin:0 0 6px;color:#1E1B4B;}'
    + '.pep-lm-card p{font-size:0.85rem;color:#64748b;margin:0 0 14px;line-height:1.5;}'
    + '.pep-lm-card input{width:100%;box-sizing:border-box;padding:11px 12px;margin-bottom:9px;font-size:0.9rem;background:#fff;border:1px solid #C7D2FE;color:#1E1B4B;border-radius:8px;font-family:inherit;}'
    + '.pep-lm-card input:focus{outline:none;border-color:#4F46E5;}'
    + '.pep-lm-card button.submit{width:100%;padding:12px;font-size:0.92rem;font-weight:700;background:#4F46E5;color:#fff;border:none;border-radius:10px;cursor:pointer;font-family:inherit;}'
    + '.pep-lm-card button.submit:hover{opacity:0.92;}'
    + '.pep-lm-card button.submit:disabled{opacity:0.5;cursor:not-allowed;}'
    + '.pep-lm-close{position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.3rem;cursor:pointer;color:#94a3b8;padding:0;line-height:1;}'
    + '.pep-lm-success{display:none;font-size:0.85rem;color:#059669;font-weight:600;margin-top:8px;}'
    + '.pep-lm-success.show{display:block;}'
    + '.pep-lm-note{font-size:0.7rem;color:#94a3b8;margin-top:10px;line-height:1.4;}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.className = 'pep-lm-wrap';
  wrap.innerHTML = ''
    + '<div class="pep-lm-card" id="pepLmCard">'
    + '  <button class="pep-lm-close" aria-label="Close" onclick="document.getElementById(\'pepLmCard\').classList.remove(\'open\')">&times;</button>'
    + '  <h3>' + CFG.title + '</h3>'
    + '  <p>' + CFG.desc + '</p>'
    + '  <input type="text" id="pepLmName" placeholder="Your first name" autocomplete="given-name" />'
    + '  <input type="email" id="pepLmEmail" placeholder="Your email address" autocomplete="email" />'
    + '  <button class="submit" id="pepLmBtn">Get the Cheat Sheet &rarr;</button>'
    + '  <div class="pep-lm-success" id="pepLmSuccess">&#10003; Sent. Check your inbox.</div>'
    + '  <div class="pep-lm-note">Research reference only. No spam, unsubscribe anytime.</div>'
    + '</div>'
    + '<button class="pep-lm-pill" id="pepLmPill">\uD83D\uDCD8 Free Cheat Sheet</button>';
  document.body.appendChild(wrap);

  document.getElementById('pepLmPill').addEventListener('click', function () {
    document.getElementById('pepLmCard').classList.toggle('open');
  });

  document.getElementById('pepLmBtn').addEventListener('click', async function () {
    var name = document.getElementById('pepLmName').value.trim();
    var email = document.getElementById('pepLmEmail').value.trim();
    var btn = document.getElementById('pepLmBtn');
    var success = document.getElementById('pepLmSuccess');
    if (!name || !email || email.indexOf('@') === -1) { return; }
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      await fetch(CFG.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          magnet: CFG.magnet,
          pdfUrl: CFG.guideUrl,
          site: 'peptides.site',
          source: window.location.pathname,
          _token: '7f9d43fb7d9ac0b7a0f8f17ec4b08990791368a84f1bf860'
        })
      });
    } catch (e) { /* silent */ }
    success.classList.add('show');
    btn.textContent = '\u2713 Sent!';
    document.getElementById('pepLmName').value = '';
    document.getElementById('pepLmEmail').value = '';
    setTimeout(function () { btn.disabled = false; btn.textContent = 'Get the Cheat Sheet \u2192'; }, 3000);
  });
})();
