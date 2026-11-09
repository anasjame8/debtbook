// Connects the debt book to Firebase (shared database + staff login).
(function () {
  var cfg = window.FIREBASE_CONFIG || {};
  var resolveDb; var dbReady = new Promise(function (r) { resolveDb = r; });
  window.claude = { use: function (n) { return n === 'db' ? dbReady : Promise.resolve(null); } };   // no file downloads: the app shows copy-text instead

  var ov = document.createElement('div');
  ov.id = 'loginOv';
  ov.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif';
  var st = document.createElement('style');
  st.textContent = '#loginOv{background:#f4f6f5;color:#1c2420}#loginOv .box{background:#fff;border:1px solid #dde3e0;border-radius:14px;padding:20px;width:100%;max-width:380px}#loginOv input{width:100%;font:inherit;padding:11px;margin:4px 0 12px;border:1px solid #dde3e0;border-radius:8px;background:#fff;color:#1c2420}#loginOv button{width:100%;font:inherit;font-weight:700;padding:12px;border:0;border-radius:8px;background:#1f7a4d;color:#fff}#loginOv .err{color:#c0392b;min-height:20px;margin:0 0 8px;font-size:14px}#loginOv label{font-size:13px;color:#6b7872}@media (prefers-color-scheme:dark){#loginOv{background:#0f1613;color:#e7eee9}#loginOv .box{background:#17211c;border-color:#2a3731}#loginOv input{background:#17211c;color:#e7eee9;border-color:#2a3731}}';
  document.head.appendChild(st);
  document.documentElement.appendChild(ov);

  function show(html) { ov.style.display = 'flex'; ov.innerHTML = '<div class="box">' + html + '</div>'; }
  function hide() { ov.style.display = 'none'; ov.innerHTML = ''; }

  if (typeof firebase === 'undefined') { show('<h3>No connection</h3><p>Could not load the online services. Check the internet and reload.<br>لا يوجد اتصال بالإنترنت. تحقق وأعد التحميل.</p>'); return; }
  if (!cfg.apiKey || /PASTE/.test(cfg.apiKey + cfg.projectId)) { show('<h3>Setup needed</h3><p>Open <b>firebase-config.js</b> and paste your Firebase settings (see README).</p>'); return; }

  firebase.initializeApp(cfg);
  var auth = firebase.auth(), fs = firebase.firestore();
  try { fs.enablePersistence({ synchronizeTabs: true }).catch(function () { }); } catch (e) { }

  var adapter = {
    doc: function (p) { var d = fs.doc(p); return { path: p, set: function (v) { return d.set(v); }, delete: function () { return d.delete(); } }; },
    collection: function (c) { var col = fs.collection(c); return { onSnapshot: function (next, err) { return col.onSnapshot(next, err); } }; }
  };

  var started = false;
  function login() {
    show('<h3 style="margin-top:0">Shop login · دخول المتجر</h3><label>Email · البريد</label><input id="lgE" type="email" autocomplete="username" inputmode="email"><label>Password · كلمة المرور</label><input id="lgP" type="password" autocomplete="current-password"><div class="err" id="lgX"></div><button id="lgB">Log in · دخول</button>');
    var go = function () {
      var e = document.getElementById('lgE').value.trim(), p = document.getElementById('lgP').value, x = document.getElementById('lgX'), b = document.getElementById('lgB');
      if (!e || !p) return; b.disabled = true; x.textContent = '';
      auth.signInWithEmailAndPassword(e, p).catch(function (er) {
        b.disabled = false;
        x.textContent = /network/.test(er.code) ? 'No internet · لا يوجد إنترنت' : 'Wrong email or password · البريد أو كلمة المرور خطأ';
      });
    };
    document.getElementById('lgB').onclick = go;
    document.getElementById('lgP').onkeydown = function (ev) { if (ev.key === 'Enter') go(); };
  }
  auth.onAuthStateChanged(function (u) {
    if (u) { hide(); if (!started) { started = true; resolveDb(adapter); } }
    else if (started) { location.reload(); }
    else login();
  });
  window.shopSignOut = function () { auth.signOut(); };
})();
