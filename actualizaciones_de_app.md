<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#F6F2EA">
<meta name="apple-mobile-web-app-capable" content="yes">
<style>:root{color-scheme:light;}</style>
<title>Quadern — Avaluació de l'alumnat</title>
<link rel="manifest" href="data:application/json,{%22name%22:%22Quadern%22,%22short_name%22:%22Quadern%22,%22start_url%22:%22.%22,%22display%22:%22standalone%22,%22background_color%22:%22%23F6F2EA%22,%22theme_color%22:%22%23B5562F%22,%22icons%22:[{%22src%22:%22data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23B5562F'/%3E%3Ctext y='.9em' font-size='80' x='10'%3E📒%3C/text%3E%3C/svg%3E%22,%22sizes%22:%22any%22,%22type%22:%22image/svg+xml%22}]}">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Karla:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#262220;--ink2:#6E665E;--ink3:#A89F94;
  --paper:#F6F2EA;--surface:#FFFFFF;--line:#E4DCCE;--line2:#D6CCB9;
  --clay:#B5562F;--clay-l:#FBEAE0;
  --moss:#566B47;--moss-l:#EAEFE3;
  --honey:#B98627;--honey-l:#FBF1DE;
  --plum:#6B4A6E;--plum-l:#F1E8F1;
  --sky:#3C6B82;--sky-l:#E6EFF2;
  --r:8px;--rl:14px;--rxl:20px;
  --brun:#6B4C2A;--brun-l:#F2EAE0;
}
html,body{height:100%;font-family:'Karla',sans-serif;background:var(--paper);color:var(--ink);font-size:14px;-webkit-text-size-adjust:100%;}
html{background:#F6F2EA;}

/* ── RESPONSIVE LLEGIBILITAT ── */
/* Botons amb àrea de toc mínima de 44px (Apple HIG) */
.btn{min-height:36px;}
.btn-sm{min-height:30px;}
/* Nav tabs més grans en mòbil */
@media(max-width:768px){
  .ntab{padding:8px 10px;font-size:13px;gap:6px;}
  .ntab svg{width:17px;height:17px;}
  .btn{font-size:13px;padding:8px 14px;}
  .btn-sm{font-size:12.5px;padding:6px 11px;min-height:34px;}
  .h2{font-size:18px;}
  .card{padding:14px 15px;}
  .mc-v{font-size:24px;}
  .mc-l{font-size:11px;}
  .tbl th{font-size:11px;padding:9px 8px;}
  .tbl td{font-size:13px;padding:9px 8px;}
  .nota-input{width:46px;height:32px;font-size:14px;}
  .gate-title{font-size:24px;}
  .gate-sub{font-size:13.5px;}
  .cfg-tab{padding:8px 14px;font-size:13px;}
  .trim-nav-btn{padding:6px 10px;font-size:12px;}
}
body{display:flex;flex-direction:column;overflow:hidden;font-size:15px;}

/* GATE */
.gate{position:fixed;inset:0;background:var(--paper);z-index:500;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:36px 20px;touch-action:manipulation;}
.gate.hide{display:none;}
.gate-box{width:580px;max-width:100%;}
.gate-step{display:none;}
.gate-step.on{display:block;animation:gfade .2s ease;}
@keyframes gfade{from{opacity:0;transform:translateY(5px);}to{opacity:1;}}
.gate-eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);font-weight:600;margin-bottom:8px;}
.gate-title{font-family:'Fraunces',serif;font-size:28px;font-weight:500;margin-bottom:6px;line-height:1.1;}
.gate-sub{font-size:13px;color:var(--ink2);margin-bottom:20px;line-height:1.6;}
.gate-back{font-size:13px;color:var(--ink2);cursor:pointer;margin-bottom:16px;display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--surface);border-radius:var(--r);padding:6px 12px;font-family:inherit;font-weight:500;touch-action:manipulation;}
.gate-back:hover{background:var(--paper);}
.trim-nav-btn{padding:5px 10px;border:none;background:none;border-radius:5px;font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;font-family:'Karla',sans-serif;transition:all .12s;touch-action:manipulation;}
.trim-nav-btn:hover{background:var(--line);color:var(--ink);}
.trim-nav-btn.on{background:var(--clay);color:#fff;}

.reg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;}
.reg-card{background:var(--surface);border:1.5px solid var(--line);border-radius:var(--rl);padding:14px 10px;cursor:pointer;transition:all .15s;text-align:center;touch-action:manipulation;}
.reg-card:hover,.reg-card.sel{border-color:var(--clay);background:var(--clay-l);}
.reg-card-num{font-family:'Fraunces',serif;font-size:22px;font-weight:500;color:var(--ink);margin-bottom:3px;}
.reg-card-sub{font-size:11px;color:var(--ink3);}
.subj-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.subj-chip{padding:6px 13px;border-radius:20px;border:1.5px solid var(--line);background:none;font-size:12.5px;font-weight:500;cursor:pointer;color:var(--ink2);font-family:inherit;transition:all .15s;touch-action:manipulation;}
.subj-chip.sel{border-color:var(--clay);background:var(--clay-l);color:var(--clay);}
.trim-pills{display:flex;gap:6px;margin-bottom:14px;}
.trim-pill{padding:5px 14px;border-radius:20px;border:1.5px solid var(--line);background:none;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--ink2);transition:all .15s;touch-action:manipulation;}
.trim-pill.on{border-color:var(--clay);background:var(--clay-l);color:var(--clay);}

/* NAV */
nav{background:var(--surface);border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 18px;height:50px;flex-shrink:0;gap:2px;overflow-x:auto;}
.nav-brand{font-family:'Fraunces',serif;font-size:17px;font-weight:500;color:var(--ink);margin-right:12px;padding-right:12px;border-right:1px solid var(--line);display:flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap;}
.nav-dot{width:6px;height:6px;border-radius:50%;background:var(--clay);flex-shrink:0;}
.ntab{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:var(--r);font-size:12.5px;font-weight:500;color:var(--ink2);cursor:pointer;border:none;background:none;font-family:'Karla',sans-serif;transition:all .15s;white-space:nowrap;touch-action:manipulation;}
.ntab:hover{background:var(--paper);color:var(--ink);}
.ntab.on{background:var(--clay-l);color:var(--clay);}
.ntab[data-s="programacio"].on{background:var(--brun);color:#fff;border-color:var(--brun);}
.ntab svg{width:14px;height:14px;flex-shrink:0;}
.nav-sp{flex:1;}
.nav-ctx{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink2);background:var(--paper);padding:5px 10px;border-radius:20px;cursor:pointer;border:1px solid var(--line);white-space:nowrap;touch-action:manipulation;}
.nav-ctx b{color:var(--ink);}

/* LAYOUT */
.body{flex:1;overflow:hidden;}
.main{height:100%;overflow-y:auto;padding:20px 22px 50px;}
.scr{display:none;}
.scr.on{display:block;animation:fadeUp .18s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px);}to{opacity:1;}}

/* UTILS */
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:var(--r);font-size:12.5px;font-weight:500;cursor:pointer;border:1px solid var(--line);background:var(--surface);color:var(--ink);transition:all .15s;font-family:'Karla',sans-serif;touch-action:manipulation;}
.btn:hover{background:var(--paper);}
.btn-clay{background:var(--clay);color:#fff;border-color:var(--clay);}
.btn-clay:hover{background:#9c4423;}
.btn-moss{background:var(--moss);color:#fff;border-color:var(--moss);}
.btn-ghost{border-color:transparent;background:none;}
.btn-sm{padding:4px 8px;font-size:12px;}
.btn-danger{color:var(--clay);border-color:var(--clay-l);}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--rl);padding:16px 18px;margin-bottom:12px;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;}
.sec{font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.09em;margin-bottom:8px;}
.h2{font-family:'Fraunces',serif;font-size:20px;font-weight:500;margin-bottom:4px;}
.h3{font-family:'Fraunces',serif;font-size:16px;font-weight:500;margin-bottom:10px;}
.pill{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;}
.p-clay{background:var(--clay-l);color:var(--clay);}
.p-moss{background:var(--moss-l);color:var(--moss);}
.p-honey{background:var(--honey-l);color:var(--honey);}
.p-sky{background:var(--sky-l);color:var(--sky);}
.p-gray{background:var(--paper);color:var(--ink2);}
.ava{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0;}
.input{border:1px solid var(--line);border-radius:var(--r);padding:8px 11px;font-size:13px;font-family:'Karla',sans-serif;color:var(--ink);background:var(--surface);outline:none;width:100%;transition:border .15s;}
.input:focus{border-color:var(--clay);}
select.input{appearance:none;cursor:pointer;}
textarea.input{resize:vertical;line-height:1.6;}
.fg{margin-bottom:12px;}
.flbl{font-size:12px;font-weight:600;color:var(--ink2);margin-bottom:4px;display:block;}
.mc{background:var(--paper);border-radius:var(--r);padding:13px 15px;}
.mc-l{font-size:10px;color:var(--ink3);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
.mc-v{font-family:'Fraunces',serif;font-size:26px;font-weight:500;line-height:1;}
.mc-s{font-size:11px;color:var(--ink3);margin-top:2px;}

/* TAULA */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{padding:8px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;border-bottom:1.5px solid var(--line);white-space:normal;line-height:1.4;vertical-align:top;}
.tbl td{padding:8px 10px;border-bottom:1px solid var(--line);font-size:12.5px;vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:var(--paper);}
.tbl th.sticky,.tbl td.sticky{position:sticky;left:0;background:var(--surface);z-index:2;box-shadow:2px 0 4px rgba(0,0,0,.04);}
.tbl tr:hover td.sticky{background:var(--paper);}

/* NOTA INPUT */
.nota-input{width:50px;height:28px;text-align:center;border:1.5px solid var(--line);border-radius:7px;font-size:13px;font-weight:700;background:var(--paper);color:var(--ink2);outline:none;font-family:inherit;cursor:pointer;}
.nota-input:focus{border-color:var(--clay);box-shadow:0 0 0 3px var(--clay-l);}
.nota-input.na{background:var(--moss-l);color:var(--moss);border-color:var(--moss-l);}
.nota-input.nb{background:var(--sky-l);color:var(--sky);border-color:var(--sky-l);}
.nota-input.nc{background:var(--honey-l);color:var(--honey);border-color:var(--honey-l);}
.nota-input.nd{background:var(--clay-l);color:var(--clay);border-color:var(--clay-l);}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
input[type=number]{-moz-appearance:textfield;appearance:textfield;}

/* COMP TILES */
.comp-tile{background:var(--surface);border:1px solid var(--line);border-radius:var(--rl);padding:14px 16px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:10px;touch-action:manipulation;}
.comp-tile:hover{border-color:var(--clay);transform:translateY(-1px);}
.comp-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;}

/* POPUP */
.overlay{position:fixed;inset:0;background:rgba(38,34,32,.4);z-index:200;display:flex;align-items:center;justify-content:center;}
.popup{background:var(--surface);border-radius:var(--rxl);padding:22px;width:360px;max-width:94vw;box-shadow:0 20px 60px rgba(38,34,32,.2);animation:popIn .15s ease;}
@keyframes popIn{from{opacity:0;transform:scale(.96);}to{opacity:1;transform:scale(1);}}
.popup-title{font-size:12px;color:var(--ink3);margin-bottom:2px;}
.popup-head{font-family:'Fraunces',serif;font-size:16px;font-weight:500;margin-bottom:12px;line-height:1.3;}
.rub-rang{border-radius:var(--r);padding:9px 11px;margin-bottom:5px;}
.rub-rang-label{font-size:11px;font-weight:700;margin-bottom:3px;}
.rub-rang-text{font-size:12px;line-height:1.5;color:var(--ink2);}

/* CFG TABS */
.cfg-tabs{display:flex;gap:3px;background:var(--paper);border-radius:10px;padding:3px;margin-bottom:14px;width:fit-content;flex-wrap:wrap;}
.cfg-tab{padding:6px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;color:var(--ink2);border:none;background:none;font-family:'Karla',sans-serif;transition:all .12s;touch-action:manipulation;}
.cfg-tab.on{background:var(--surface);color:var(--ink);box-shadow:0 1px 3px rgba(38,34,32,.08);}
.cfg-section{display:none;}
.cfg-section.on{display:block;}

/* TOGGLE */
.toggle{position:relative;width:36px;height:20px;border-radius:20px;background:var(--line2);cursor:pointer;transition:background .2s;flex-shrink:0;}
.toggle.on{background:var(--moss);}
.toggle::after{content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:3px;left:3px;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.toggle.on::after{left:19px;}

/* CALENDARI */
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:10px;}
.cal-day{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:4px 3px;border-radius:6px;font-size:12px;cursor:pointer;position:relative;min-height:40px;}
.cal-day:hover{background:var(--paper);}
.cal-day.today{background:var(--clay-l);}
.cal-day.today .cal-day-num{color:var(--clay);font-weight:700;}
.cal-day.other-month .cal-day-num{color:var(--ink3);}
.cal-day-num{font-size:12px;font-weight:500;margin-bottom:2px;}
.cal-event{width:100%;font-size:9px;padding:1px 3px;border-radius:3px;margin-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;}
.cal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.cal-weekdays{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;}
.cal-wd{text-align:center;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;padding:4px 0;}

/* SPIDER CHART */
.spider-wrap{display:flex;justify-content:center;padding:10px 0;}

/* TOAST */
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--paper);padding:9px 16px;border-radius:var(--r);font-size:13px;z-index:999;pointer-events:none;animation:tin .25s ease;}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}

/* PRINT */
@media print{nav,.gate,.btn,.overlay,.toast{display:none!important;}body{overflow:visible;height:auto;}.body{overflow:visible;}.main{padding:0;overflow:visible;}}

/* RESPONSIVE */
@media(max-width:640px){
  .g2,.g3,.g4{grid-template-columns:1fr 1fr;}
  .main{padding:14px 12px 40px;}
  nav{padding:0 8px;}
  .ntab{padding:4px 7px;font-size:12px;}
  .reg-grid{grid-template-columns:1fr 1fr;}
}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-thumb{background:var(--line2);border-radius:3px;}
</style>
</head>
<body>

<!-- GATE -->
<div class="gate" id="gate">
<div class="gate-box">

  <!-- PAS 1: DADES -->
  <div class="gate-step on" id="g-dades">
    <div class="gate-eyebrow">Benvingut/da</div>
    <div class="gate-title">Configura el teu perfil</div>
    <div class="gate-sub">Dades bàsiques per personalitzar l'app.</div>
    <div class="fg"><label class="flbl">Nom complet</label><input class="input" id="reg-nom" placeholder="Ex: Anna Garcia"></div>
    <div class="g2" style="gap:10px;">
      <div class="fg"><label class="flbl">Centre educatiu</label><input class="input" id="reg-centre" placeholder="Ex: Escola Montserrat"></div>
      <div class="fg"><label class="flbl">Any escolar</label><input class="input" id="reg-any" value="2025-2026"></div>
    </div>
    <button class="btn btn-clay" style="width:100%;padding:10px;" onclick="gatePas2()">Continuar →</button>
  </div>

  <!-- PAS 2: CURSOS -->
  <div class="gate-step" id="g-cursos">
    <button class="gate-back" onclick="showGatePas('g-dades')">← Tornar</button>
    <div class="gate-eyebrow">Pas 2 de 3</div>
    <div class="gate-title">Quins cursos tens?</div>
    <div class="gate-sub">Selecciona tots els cursos on imparteixes alguna assignatura.</div>
    <div class="reg-grid" id="cursos-grid"></div>
    <button class="btn btn-clay" style="width:100%;padding:10px;margin-top:8px;" onclick="gatePas3()">Continuar →</button>
  </div>

  <!-- PAS 3: ASSIGNATURES -->
  <div class="gate-step" id="g-assigns">
    <button class="gate-back" onclick="showGatePas('g-cursos')">← Tornar</button>
    <div class="gate-eyebrow">Pas 3 de 3</div>
    <div class="gate-title">Assignatures per curs</div>
    <div class="gate-sub">Tria quines assignatures imparteixes a cada curs.</div>
    <div id="assigns-container"></div>
    <button class="btn btn-clay" style="width:100%;padding:10px;margin-top:4px;" onclick="gateEntrar()">Entrar a l'app →</button>
  </div>

  <!-- PAS 4a: ENTRADA RÀPIDA o SELECCIONAR CURS -->
  <div class="gate-step" id="g-sel-cursos">
    <div class="gate-eyebrow" id="g-sel-eyebrow">Bon dia!</div>
    <div class="gate-title">Quin curs vols obrir?</div>
    <!-- Entrada ràpida: última sessió -->
    <div id="g-sel-cursos-list"></div>
    <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line);display:flex;gap:8px;">
      <button class="btn btn-clay btn-sm" onclick="obrirNouCurs()">+ Nou curs</button>
      <button class="btn btn-sm" onclick="showGatePas('g-informe')">📊 Generar informe</button>
    </div>
  </div>


  <!-- PAS 4c: SELECCIONAR ASSIGNATURA -->
  <div class="gate-step" id="g-sel-assigns">
    <button class="gate-back" onclick="showGatePas('g-sel-cursos')">← Tornar</button>
    <div class="gate-eyebrow" id="g-sel-assigns-eyebrow">3r A · 1r Trimestre</div>
    <div class="gate-title">Quina assignatura?</div>
    <div class="gate-sub">Selecciona l'assignatura que vols obrir.</div>
    <div id="g-sel-assigns-list"></div>
  </div>

  <!-- PAS 5: INFORME JSON -->
  <div class="gate-step" id="g-informe">
    <button class="gate-back" onclick="showGatePas('g-sel-cursos')">← Tornar</button>
    <div class="gate-eyebrow">Informes</div>
    <div class="gate-title">Generar informe</div>
    <div class="gate-sub">Puja els fitxers JSON de notes per generar un informe consolidat.</div>
    <label style="display:block;border:2px dashed var(--line2);border-radius:var(--rl);padding:24px;text-align:center;cursor:pointer;margin-bottom:12px;transition:all .2s;" for="inf-json-inp"
      ondragover="event.preventDefault();this.style.borderColor='var(--clay)'" ondragleave="this.style.borderColor='var(--line2)'"
      ondrop="event.preventDefault();this.style.borderColor='var(--line2)';infHandleDrop(event)">
      <input type="file" id="inf-json-inp" accept=".json" multiple style="display:none;" onchange="infHandleFiles(this)">
      <div style="font-size:24px;margin-bottom:6px;">📂</div>
      <div style="font-size:13px;font-weight:600;margin-bottom:2px;">Puja els JSON de notes</div>
      <div style="font-size:11px;color:var(--ink3);">Pots seleccionar múltiples fitxers</div>
    </label>
    <div id="inf-fitxers-list" style="margin-bottom:12px;"></div>
    <div class="fg">
      <label class="flbl">Filtrar per trimestre</label>
      <select class="input" id="inf-trim-sel">
        <option value="">Tots els trimestres (mitjana anual)</option>
        <option value="1r Trimestre">1r Trimestre</option>
        <option value="2n Trimestre">2n Trimestre</option>
        <option value="3r Trimestre">3r Trimestre</option>
      </select>
    </div>
    <button class="btn btn-clay" style="width:100%;" onclick="generarInforme()" id="inf-gen-btn" disabled>Generar informe →</button>
    <div id="inf-resultat" style="margin-top:14px;"></div>
  </div>

</div>
</div>

<!-- NAV -->
<nav>
  <div class="nav-brand" onclick="abrirGateSeleccio()"><div class="nav-dot"></div>Quadern</div>
  <button class="ntab on" data-s="home" onclick="navGo(this)">
    <svg viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2l6 4.5V14H10v-3H6v3H2V6.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>Inici
  </button>
  <button class="ntab" data-s="alumnes" onclick="navGo(this)">
    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.8" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 14c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Alumnes
  </button>
  <button class="ntab" data-s="competencies" onclick="navGo(this)">
    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3" stroke-dasharray="1.5 2"/></svg>Competències
  </button>

  <button class="ntab" data-s="config" onclick="navGo(this)">
    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1 1M11.8 11.8l1 1M11.8 3.2l-1 1M3.2 11.8l1-1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Configuració
  </button>
  <div class="nav-sp"></div>
  <button class="ntab" data-s="programacio" onclick="navGo(this)" style="background:var(--brun-l);color:var(--brun);border:1px solid #D4B99A;border-radius:var(--r);padding:5px 11px;font-size:12px;font-weight:600;margin-right:6px;">
    <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 1v2M11 1v2M2 6h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Programació
  </button>
  <div style="display:flex;align-items:center;gap:4px;">
    <div class="nav-ctx" onclick="abrirGateSeleccio()" style="gap:5px;">
      <span id="nav-curs">—</span>
      <span style="color:var(--ink3);">·</span>
      <b id="nav-subj">—</b>
    </div>
    <div style="display:flex;gap:2px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r);padding:2px;">
      <button class="trim-nav-btn" id="tnb-0" onclick="selTrimNav(0)">1T</button>
      <button class="trim-nav-btn" id="tnb-1" onclick="selTrimNav(1)">2T</button>
      <button class="trim-nav-btn" id="tnb-2" onclick="selTrimNav(2)">3T</button>
    </div>
  </div>
</nav>

<div class="body"><div class="main" id="main">

<!-- HOME -->
<div class="scr on" id="s-home">
  <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;">
    <div class="h2" id="home-title">Resum de classe</div>
    <div style="font-size:12px;color:var(--ink3);" id="home-sub"></div>
  </div>
  <div class="g4" id="home-metrics"></div>
  <div class="g2">
    <div class="card" style="margin-bottom:0;">
      <div class="sec">Gràfic d'aranya — Classe</div>
      <div class="spider-wrap"><canvas id="spider-home" width="260" height="220"></canvas></div>
    </div>
    <div class="card" style="margin-bottom:0;">
      <div class="sec">Competències — Nivell mitjà</div>
      <div id="home-bars"></div>
    </div>
  </div>
</div>

<!-- ALUMNES -->
<div class="scr" id="s-alumnes">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <div class="h2">Alumnes</div>
    <div style="display:flex;gap:6px;">
      <button class="btn btn-sm" onclick="exportarPDF()">Exportar PDF</button>
      <button class="btn btn-clay btn-sm" onclick="exportarJSON()">↓ Exportar JSON</button>
    </div>
  </div>
  <div style="margin-bottom:12px;">
    <input class="input" id="cerca-alumnes" placeholder="🔍 Cercar alumne..." oninput="renderAlumnes()" style="max-width:320px;">
  </div>
  <div id="alumnes-view"></div>
  <!-- Popup detall alumne -->
  <div id="alumne-detail" style="display:none;">
    <button class="btn btn-sm" onclick="document.getElementById('alumne-detail').style.display='none';document.getElementById('alumnes-table-wrap').style.display='block';" style="margin-bottom:14px;padding:8px 16px;font-size:13.5px;">← Tornar als alumnes</button>
    <div id="alumne-detail-body"></div>
  </div>
  <div id="alumnes-table-wrap"></div>
</div>

<!-- COMPETÈNCIES -->
<div class="scr" id="s-competencies">
  <div id="cv-llista">
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px;">
      <div class="h2">Competències</div>
      <div style="font-size:12px;color:var(--ink3);">Selecciona'n una</div>
    </div>
    <div class="g4" id="comp-tiles"></div>
  </div>
  <div id="cv-activitats" style="display:none;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <button class="btn btn-sm" onclick="showCV('cv-llista','cv-activitats')" style="padding:7px 14px;font-size:13.5px;">← Tornar</button>
      <div class="h2" id="cv-act-title" style="margin-bottom:0;"></div>
    </div>
    <div id="cv-act-body"></div>
  </div>
  <div id="cv-graella" style="display:none;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <button class="btn btn-sm" onclick="showCV('cv-activitats','cv-graella');openComp(currentCompId)" style="padding:7px 14px;font-size:13.5px;">← Tornar</button>
      <div class="h2" id="cv-gr-title" style="margin-bottom:0;flex:1;"></div>
      <span style="font-size:11px;color:var(--ink3);" id="cv-gr-data"></span>
    </div>
    <div style="font-size:11px;color:var(--ink3);margin-bottom:8px;">Clica el nom del criteri per veure la rúbrica. Tab/Enter per navegar entre cel·les.</div>
    <div style="overflow-x:auto;border:1px solid var(--line);border-radius:var(--rl);"><table class="tbl" id="cv-table"></table></div>
  </div>
</div>

<!-- PROGRAMACIÓ -->
<div class="scr" id="s-programacio">
  <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;">
    <div class="h2">Programació</div>
    <button class="btn btn-clay btn-sm" onclick="obrirNouEvent()">+ Nou event</button>
  </div>
  <div class="card">
    <div class="cal-header">
      <button class="btn btn-ghost btn-sm" onclick="calNavMes(-1)">←</button>
      <div style="font-size:14px;font-weight:700;" id="cal-mes-label"></div>
      <button class="btn btn-ghost btn-sm" onclick="calNavMes(1)">→</button>
    </div>
    <div class="cal-weekdays">
      <div class="cal-wd">Dl</div><div class="cal-wd">Dt</div><div class="cal-wd">Dc</div>
      <div class="cal-wd">Dj</div><div class="cal-wd">Dv</div><div class="cal-wd">Ds</div><div class="cal-wd">Dg</div>
    </div>
    <div class="cal-grid" id="cal-grid"></div>
  </div>
  <div id="cal-events-avui" style="margin-top:4px;"></div>
</div>

<!-- CONFIGURACIÓ -->
<div class="scr" id="s-config">
  <div style="display:flex;align-items:baseline;margin-bottom:14px;"><div class="h2">Configuració</div></div>
  <div class="cfg-tabs">
    <button class="cfg-tab on" onclick="cfgTab(this,'cfg-alumnes')">Alumnes</button>
    <button class="cfg-tab" onclick="cfgTab(this,'cfg-rubrica')">Rúbrica</button>
  </div>

  <div class="cfg-section on" id="cfg-alumnes">
    <div class="g2">
      <div class="card" style="margin-bottom:0;">
        <div class="sec">Importar Excel / CSV</div>
        <div style="font-size:12px;color:var(--ink2);margin-bottom:10px;">Primera columna = nom, segona = cognom (opcional)</div>
        <label id="excel-dz" style="display:block;border:2px dashed var(--line2);border-radius:var(--rl);padding:24px;text-align:center;cursor:pointer;margin-bottom:10px;" for="excel-inp"
          ondragover="event.preventDefault();this.style.borderColor='var(--clay)'" ondragleave="this.style.borderColor='var(--line2)'" ondrop="event.preventDefault();this.style.borderColor='var(--line2)';handleDrop(event)">
          <input type="file" id="excel-inp" accept=".xlsx,.xls,.csv" style="display:none;" onchange="handleExcelFile(this)">
          <div style="font-size:24px;margin-bottom:6px;">📊</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:2px;">Arrossega o clica</div>
          <div style="font-size:11px;color:var(--ink3);">Excel o CSV</div>
        </label>
        <div class="sec">Afegir manualment</div>
        <div style="display:flex;gap:6px;">
          <input class="input" id="inp-alu" placeholder="Nom i cognoms..." onkeydown="if(event.key==='Enter')addAlumneManual()">
          <button class="btn btn-clay" onclick="addAlumneManual()">+</button>
        </div>
        <div id="excel-feedback" style="margin-top:8px;"></div>
      </div>
      <div class="card" style="margin-bottom:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="sec" style="margin-bottom:0;">Alumnes (<span id="alu-count">0</span>)</div>

        </div>
        <div id="alu-list-cfg" style="max-height:300px;overflow-y:auto;"></div>
      </div>
    </div>
  </div>

  <div class="cfg-section" id="cfg-rubrica">
    <div id="rubrica-body"></div>
  </div>

  <div class="cfg-section" id="cfg-visual">
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div style="font-size:13px;font-weight:600;">Mostrar notes amb icones</div>
        <div class="toggle" id="vis-toggle" onclick="toggleVis()"></div>
      </div>
      <div style="font-size:12px;color:var(--ink2);margin-bottom:12px;">En lloc del número, es mostra una icona personalitzable.</div>
      <div id="vis-editor"></div>
    </div>
  </div>
</div>

</div></div>

<!-- POPUP RÚBRICA -->
<div class="overlay" id="pop-rubrica" style="display:none;" onclick="if(event.target===this)this.style.display='none'">
  <div class="popup" style="width:440px;">
    <div class="popup-title">Rúbrica del criteri</div>
    <div class="popup-head" id="pop-rub-criteri"></div>
    <div id="pop-rub-rangs"></div>
    <button class="btn" style="width:100%;margin-top:12px;" onclick="document.getElementById('pop-rubrica').style.display='none'">Tancar</button>
  </div>
</div>

<!-- POPUP MISSATGE ALUMNE -->
<div class="overlay" id="pop-miss" style="display:none;" onclick="if(event.target===this)this.style.display='none'">
  <div class="popup">
    <div class="popup-title" id="pop-miss-nom"></div>
    <div class="popup-head">Comentari de l'alumne</div>
    <textarea class="input" id="pop-miss-text" rows="3" placeholder="Afegeix un comentari general..."></textarea>
    <div style="display:flex;gap:8px;margin-top:10px;">
      <button class="btn btn-clay" style="flex:1;" onclick="guardarMissatge()">Guardar</button>
      <button class="btn btn-ghost" onclick="document.getElementById('pop-miss').style.display='none'">Cancel·lar</button>
    </div>
  </div>
</div>

<!-- POPUP NOU EVENT CALENDARI -->
<div class="overlay" id="pop-event" style="display:none;" onclick="if(event.target===this)this.style.display='none'">
  <div class="popup">
    <div class="popup-head">Nou event</div>
    <div class="fg"><label class="flbl">Títol</label><input class="input" id="ev-titol" placeholder="Ex: Examen tema 3, Setmana del llibre..."></div>
    <div class="g2" style="gap:8px;">
      <div class="fg"><label class="flbl">Data inici</label><input class="input" type="date" id="ev-data"></div>
      <div class="fg"><label class="flbl">Data fi (opcional)</label><input class="input" type="date" id="ev-data-fi"></div>
    </div>
    <div class="fg"><label class="flbl">Tipus</label>
      <select class="input" id="ev-tipus">
        <option value="examen">Examen</option>
        <option value="activitat">Activitat</option>
        <option value="excursio">Excursió / Colònies</option>
        <option value="reunio">Reunió</option>
        <option value="altre">Altre</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-clay" style="flex:1;" onclick="guardarEvent()">Guardar</button>
      <button class="btn btn-ghost" onclick="document.getElementById('pop-event').style.display='none'">Cancel·lar</button>
    </div>
  </div>
</div>

<!-- POPUP NOU CURS -->
<div class="overlay" id="pop-nou-curs" style="display:none;z-index:600;" onclick="if(event.target===this)this.style.display='none'">
  <div class="popup" style="width:420px;">
    <div class="popup-head">Nou curs</div>
    <div class="fg"><label class="flbl">Nom del curs</label><input class="input" id="nc-nom" placeholder="Ex: 3r A, 4t B..."></div>
    <div class="fg"><label class="flbl">Assignatures (selecciona les que imparteixes)</label>
      <div class="subj-chips" id="nc-subj-chips"></div>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-clay" style="flex:1;" onclick="crearNouCurs()">Crear curs</button>
      <button class="btn btn-ghost" onclick="document.getElementById('pop-nou-curs').style.display='none'">Cancel·lar</button>
    </div>
  </div>
</div>

<script>
// ═══════════════ DADES ═══════════════
var prof = {nom:'Anna Garcia', centre:'Escola Montserrat', any:'2025-2026'};
var cursosList = ['1r A','1r B','2n A','2n B','3r A','3r B','4t A','4t B','5e A','5e B','6e A','6e B'];
var assignaturesList = ['Catala','Castella','Angles','Matematiques','Medi','Musica','Ed. Fisica','Arts'];
var trimestres = ['1r Trimestre','2n Trimestre','3r Trimestre'];

var mesCursos = [
  {curs:'3r A', assigns:['Catala','Castella','Angles']},
  {curs:'4t B', assigns:['Catala','Matematiques']}
];
var estat = {cursIdx:0, trimIdx:0, subjIdx:0};

var alumnes = [
  {ini:'MR',nom:'Marc Roca Bosch',color:'sky'},
  {ini:'SV',nom:'Sofia Vila Torrent',color:'moss'},
  {ini:'LE',nom:'Laia Esteve Mas',color:'honey'},
  {ini:'JP',nom:'Joan Puig Serra',color:'plum'},
  {ini:'AO',nom:'Arnau Oms Ferrer',color:'clay'},
  {ini:'MF',nom:'Marta Font Giro',color:'sky'},
  {ini:'PL',nom:'Pol Llopis Camps',color:'moss'},
  {ini:'NC',nom:'Neus Carbonell Costa',color:'honey'},
  {ini:'JB',nom:'Jordi Badia Valls',color:'plum'},
  {ini:'AT',nom:'Alba Trias Nadal',color:'clay'},
  {ini:'RT',nom:'Roger Torres Vila',color:'sky'},
  {ini:'IC',nom:'Irene Comas Prat',color:'moss'}
];
var missatgesAlumnes = {};

// Competències fixes + Altres personalitzable
var competencies = [
  {id:'oral',nom:'Expressio Oral',ico:'OR',color:'sky',
    criteris:['Identifica el sentit global de textos orals','Produeix intervencions orals ordenades','Participa en interaccions orals amb respecte']},
  {id:'escrita',nom:'Comprensio i Expressio Escrita',ico:'ES',color:'clay',
    criteris:['Llegeix de manera autonoma reconeixent informacio','Escriu textos organitzats amb estructura clara','Aplica correctament ortografia i puntuacio']},
  {id:'literaria',nom:'Educacio Literaria',ico:'LT',color:'plum',
    criteris:['Relaciona textos amb experiencies personals','Expressa opinions argumentades sobre lectures','Crea petits textos literaris amb models']},
  {id:'pluriling',nom:'Plurilinguisme',ico:'PL',color:'moss',
    criteris:['Valora la diversitat de llengues de l\'aula','Utilitza terminologia gramatical per revisar textos','Identifica estereotips linguistics']},
  {id:'altres',nom:'Altres competencies',ico:'AL',color:'honey',
    criteris:['Comportament i autocontrol','Participacio i motivacio','Respecte i convivencia','Autonomia i responsabilitat','Treball en equip'],
    personalitzable:true}
];

// Rúbrica per competència i criteri
var rubrica = {};
var escales = [{rang:'1-4',label:'No Assolit',color:'clay'},{rang:'5-6',label:'Assol. suficient',color:'honey'},{rang:'7-8',label:'Assol. notable',color:'sky'},{rang:'9-10',label:'Assol. excellent',color:'moss'}];
competencies.forEach(function(comp){
  rubrica[comp.id] = comp.criteris.map(function(){
    return {'1-4':'No assolit. No demostra comprensio ni aplicacio del criteri.','5-6':'Assoliment suficient. Aplica el criteri amb errors puntuals.','7-8':'Assoliment notable. Aplica el criteri adequadament.','9-10':'Assoliment excellent. Domini complet i autonom.'};
  });
});

// activitats[key] = [{id,nom,data,notes,altres,notaAltres}]
// key = cursNom + '_' + trimNom + '_' + subjNom + '_' + compId
var activitats = {};
var missatgesAlumnes = {};
var calEvents = []; // [{id,titol,data,tipus}]
var currentCompId = '';
var visualConfig = {actiu:false, emojis:{'10':'A+','9':'A','8':'B+','7':'B','6':'C+','5':'C','4':'D+','3':'D','2':'E','1':'F'}};
var calMes = new Date().getMonth();
var calAny = new Date().getFullYear();

// ─── SEED DADES ───
function getKey(compId){
  var mc = mesCursos[estat.cursIdx];
  if(!mc) return '';
  return mc.curs+'_'+trimestres[estat.trimIdx]+'_'+mc.assigns[estat.subjIdx]+'_'+compId;
}
function getActs(compId){ var k=getKey(compId); if(!activitats[k]) activitats[k]=[]; return activitats[k]; }
function getActsFor(cursNom,trimNom,subjNom,compId){ var k=cursNom+'_'+trimNom+'_'+subjNom+'_'+compId; if(!activitats[k]) activitats[k]=[]; return activitats[k]; }

function seedDemo(){
  var nivells = {'MR':8.5,'SV':7.2,'LE':6.1,'JP':7.8,'AO':4.3,'MF':9.0,'PL':6.8,'NC':7.5,'JB':5.2,'AT':8.1,'RT':6.4,'IC':7.9};
  var defActs = {
    'Catala':['Comprensio oral - Conte','Redaccio - La familia','Dictat setmana 8','Exposicio oral'],
    'Castella':['Texto narrativo','Dictado sem. 5','Expresion oral','Comprension lectora'],
    'Angles':['Oral presentation','Writing exercise','Reading comp.'],
    'Matematiques':['Fraccions','Geometria','Calcul mental','Estadistica']
  };
  var dates = ['15/01/2026','12/02/2026','05/03/2026','02/04/2026','28/04/2026'];
  var missatgesDef = {'MR':"Excel.lent actitud.","SV":"Cal reforcar l'expressio oral.","LE":"Necessita mes suport.","JP":"Molt participatiu.","AO":"Pla de reforc actiu.","MF":"Alumna destacada.","PL":"Millora progressiva.","NC":"Bona actitud.","JB":"En millora.","AT":"Molt bona alumna.","RT":"Pot millorar.","IC":"Excel.lent en tot."};
  alumnes.forEach(function(al){ missatgesAlumnes[al.nom] = missatgesDef[al.ini]||''; });

  mesCursos.forEach(function(mc){
    trimestres.forEach(function(trim){
      mc.assigns.forEach(function(subj){
        var actDef = defActs[subj]||['Activitat 1','Activitat 2'];
        competencies.forEach(function(comp){
          var k = mc.curs+'_'+trim+'_'+subj+'_'+comp.id;
          activitats[k] = actDef.map(function(nom,i){
            var act = {id:'a'+i+'_'+k,nom:nom,data:dates[i]||dates[0],notes:{},altres:{},notaAltres:{}};
            alumnes.forEach(function(al){
              act.notes[al.ini]={};
              act.altres[al.ini]='';
              act.notaAltres[al.ini]=null;
              comp.criteris.forEach(function(crit){
                var base = nivells[al.ini]||6;
                var v = (Math.random()-0.5)*2.5;
                act.notes[al.ini][crit] = Math.round(Math.min(10,Math.max(1,base+v))*10)/10;
              });
            });
            return act;
          });
        });
      });
    });
  });

  // Events de calendari demo
  calEvents = [
    {id:'e1',titol:'Examen Catala T1',data:'2026-03-15',tipus:'examen'},
    {id:'e2',titol:'Excursio museu',data:'2026-03-22',tipus:'excursio'},
    {id:'e3',titol:'Reunio de pares',data:'2026-04-05',tipus:'reunio'},
    {id:'e4',titol:'Activitat lectura',data:'2026-04-10',tipus:'activitat'},
    {id:'e5',titol:'Examen Matematiques',data:'2026-04-20',tipus:'examen'}
  ];
}
seedDemo();

// ═══════════════ HELPERS ═══════════════
function ava(al,w,fs){ return '<div class="ava" style="width:'+w+'px;height:'+w+'px;font-size:'+fs+'px;background:var(--'+al.color+'-l);color:var(--'+al.color+');">'+al.ini+'</div>'; }
function getColor(n){ if(n>=7)return 'moss'; if(n>=5)return 'sky'; if(n>=4)return 'honey'; return 'clay'; }
function notaClass(n){ if(n>=7)return 'na'; if(n>=5)return 'nb'; if(n>=4)return 'nc'; return 'nd'; }
function colorIdx(i){ return ['clay','moss','honey','sky','plum'][i%5]; }
function ini2(nom){ var p=nom.trim().split(' ').filter(function(x){return x.length>0;}); return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():nom.substring(0,2).toUpperCase(); }
function toast(msg){ var t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(function(){t.remove();},2500); }
function renderNota(n,big){
  if(n===null||n===undefined||n==='') return '<span style="color:var(--ink3);">'+(big?'—':'—')+'</span>';
  if(visualConfig.actiu){ var v=visualConfig.emojis[String(Math.round(n))]; if(v) return '<span style="font-size:'+(big?18:14)+'px;">'+v+'</span>'; }
  var col=getColor(n); var sz=big?'14':'12';
  return '<span style="font-size:'+sz+'px;font-weight:700;color:var(--'+col+');">'+n+'</span>';
}
function notaMitjana(act,comp,ini){
  var t=0,c=0;
  comp.criteris.forEach(function(crit){ var n=act.notes[ini]?act.notes[ini][crit]:null; if(n!=null){t+=parseFloat(n);c++;} });
  var ne=act.notaAltres?act.notaAltres[ini]:null; if(ne!=null){t+=parseFloat(ne);c++;}
  return c?Math.round(t/c*10)/10:null;
}
function compMitjanaAlumne(subj,compId,iniAlu){
  var trim=trimestres[estat.trimIdx]; var mc=mesCursos[estat.cursIdx]; if(!mc) return null;
  var comp=competencies.find(function(c){return c.id===compId;});
  var acts=getActsFor(mc.curs,trim,subj,compId); var t=0,c=0;
  acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[iniAlu]?act.notes[iniAlu][crit]:null; if(n!=null){t+=n;c++;} }); });
  return c?Math.round(t/c*10)/10:null;
}

// ═══════════════ GATE ═══════════════
function showGatePas(id){ document.querySelectorAll('.gate-step').forEach(function(s){s.classList.remove('on');}); document.getElementById(id).classList.add('on'); }
function initGate(){
  var grid=document.getElementById('cursos-grid');
  grid.innerHTML=cursosList.map(function(c){ return '<div class="reg-card" data-curs="'+c+'" onclick="this.classList.toggle(\'sel\')"><div class="reg-card-num">'+c+'</div></div>'; }).join('');
}
function gatePas2(){
  var nom=document.getElementById('reg-nom').value.trim();
  if(!nom){toast('Escriu el teu nom');return;}
  prof.nom=nom; prof.centre=document.getElementById('reg-centre').value.trim(); prof.any=document.getElementById('reg-any').value.trim();
  showGatePas('g-cursos');
}
function gatePas3(){
  var sels=document.querySelectorAll('#cursos-grid .reg-card.sel');
  if(!sels.length){toast('Selecciona almenys un curs');return;}
  mesCursos=[];
  sels.forEach(function(el){mesCursos.push({curs:el.dataset.curs,assigns:[]});});
  var cont=document.getElementById('assigns-container');
  cont.innerHTML=mesCursos.map(function(mc,i){
    return '<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--clay);margin-bottom:7px;">'+mc.curs+'</div>'
      +'<div class="subj-chips" data-cidx="'+i+'">'
      +assignaturesList.map(function(s){ return '<button class="subj-chip" onclick="this.classList.toggle(\'sel\')">'+s+'</button>'; }).join('')
      +'</div></div>';
  }).join('');
  showGatePas('g-assigns');
}
function toggleSubj(el){el.classList.toggle('sel');}
function gateEntrar(){
  document.querySelectorAll('#assigns-container .subj-chips').forEach(function(div,i){
    mesCursos[i].assigns=Array.from(div.querySelectorAll('.subj-chip.sel')).map(function(el){return el.textContent;});
  });
  if(mesCursos.some(function(mc){return !mc.assigns.length;})){toast('Selecciona assignatures per cada curs');return;}
  document.getElementById('gate').classList.add('hide');
  seedDemo(); updateNav(); renderAll();
}
function abrirGateSeleccio(){
  document.getElementById('gate').classList.remove('hide');
  renderGateCursos(); showGatePas('g-sel-cursos');
}
function renderGateCursos(){
  document.getElementById('g-sel-eyebrow').textContent='Bon dia, '+prof.nom+'!';
  var h='';
  mesCursos.forEach(function(mc,ci){
    var isSel=ci===estat.cursIdx;
    var bord=isSel?'var(--clay)':'var(--line)';
    var bg=isSel?'var(--clay-l)':'var(--surface)';
    var icoBg=isSel?'var(--clay)':'var(--paper)';
    var icoCol=isSel?'#fff':'var(--ink)';
    h+='<div data-ci="'+ci+'" onclick="selCurs('+ci+')" style="border:1.5px solid '+bord+';border-radius:var(--rl);padding:16px 18px;margin-bottom:10px;background:'+bg+';cursor:pointer;transition:border-color .15s;touch-action:manipulation;">';
    h+='<div style="display:flex;align-items:center;gap:14px;">';
    h+='<div style="width:44px;height:44px;border-radius:10px;background:'+icoBg+';color:'+icoCol+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;">'+mc.curs.split(' ')[0]+'</div>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:15px;font-weight:700;">'+mc.curs+'</div>';
    h+='<div style="font-size:11px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+mc.assigns.join(' · ')+'</div>';
    h+='</div>';
    h+='<div style="flex-shrink:0;" onclick="event.stopPropagation()">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Trimestre</div>';
    h+='<select data-ci="'+ci+'" onchange="selTrimSelect(this)" style="border:1.5px solid var(--line);border-radius:var(--r);padding:7px 10px;font-size:13px;font-weight:600;font-family:inherit;background:var(--surface);cursor:pointer;outline:none;min-width:150px;">';
    trimestres.forEach(function(trim,ti){
      h+='<option value="'+ti+'"'+(isSel&&ti===estat.trimIdx?' selected':'')+'>'+trim+'</option>';
    });
    h+='</select>';
    h+='</div>';
    h+='</div>';
    h+='</div>';
  });
  document.getElementById('g-sel-cursos-list').innerHTML=h;
}

function selTrimSelect(sel){
  estat.cursIdx=parseInt(sel.dataset.ci);
  estat.trimIdx=parseInt(sel.value);
}

function selCurs(ci){
  estat.cursIdx=ci;
  var mc=mesCursos[ci];
  document.getElementById('g-sel-assigns-eyebrow').textContent=mc.curs+' · '+trimestres[estat.trimIdx];
  var h='';
  mc.assigns.forEach(function(s,si){
    h+='<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:1.5px solid var(--line);border-radius:var(--rl);margin-bottom:8px;cursor:pointer;background:var(--surface);touch-action:manipulation;" onclick="selSubj('+si+')">';
    h+='<span style="font-size:14px;font-weight:700;flex:1;">'+s+'</span>';
    h+='<span style="color:var(--ink3);font-size:20px;font-weight:300;">›</span>';
    h+='</div>';
  });
  document.getElementById('g-sel-assigns-list').innerHTML=h;
  showGatePas('g-sel-assigns');
}

function selTrimDirect(ci,ti){ estat.cursIdx=ci; estat.trimIdx=ti; renderGateCursos(); }


function selSubj(si){
  estat.subjIdx=si;
  document.getElementById('gate').classList.add('hide');
  updateNav(); renderAll();
}
function updateNav(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  document.getElementById('nav-curs').textContent=mc.curs;
  document.getElementById('nav-subj').textContent=mc.assigns[estat.subjIdx]||'—';
  // Actualitzar pills de trimestre a la nav
  for(var i=0;i<3;i++){
    var btn=document.getElementById('tnb-'+i);
    if(btn) btn.className='trim-nav-btn'+(i===estat.trimIdx?' on':'');
  }
}
function selTrimDirect(ci,ti){
  estat.cursIdx=ci; estat.trimIdx=ti;
  renderGateCursos();
  var mc=mesCursos[ci];
  document.getElementById('g-sel-assigns-eyebrow').textContent=mc.curs+' · '+trimestres[ti];
}

function selTrimNav(ti){
  estat.trimIdx=ti; updateNav(); renderAll();
  toast(trimestres[ti]);
}
function obrirNouCurs(){
  document.getElementById('nc-nom').value='';
  document.getElementById('nc-subj-chips').innerHTML=assignaturesList.map(function(s){
    return '<button class="subj-chip" onclick="this.classList.toggle(\'sel\')">'+s+'</button>';
  }).join('');
  document.getElementById('pop-nou-curs').style.display='flex';
}
function crearNouCurs(){
  var nom=document.getElementById('nc-nom').value.trim();
  if(!nom){toast('Escriu el nom del curs');return;}
  var assigns=Array.from(document.querySelectorAll('#nc-subj-chips .subj-chip.sel')).map(function(el){return el.textContent;});
  if(!assigns.length){toast('Selecciona almenys una assignatura');return;}
  mesCursos.push({curs:nom,assigns:assigns});
  document.getElementById('pop-nou-curs').style.display='none';
  toast('Curs "'+nom+'" creat ✓');
  // Seleccionar el nou curs automàticament
  estat.cursIdx=mesCursos.length-1;
  estat.trimIdx=0;
  estat.subjIdx=0;
  renderGateCursos();
}

// ═══════════════ NAV ═══════════════
function navGo(btn){
  document.querySelectorAll('.ntab').forEach(function(b){b.classList.remove('on');});
  document.querySelectorAll('.scr').forEach(function(s){s.classList.remove('on');});
  btn.classList.add('on');
  document.getElementById('s-'+btn.dataset.s).classList.add('on');
  if(btn.dataset.s==='home') renderHome();
  if(btn.dataset.s==='alumnes') renderAlumnes();
  if(btn.dataset.s==='competencies') renderCompTiles();
  if(btn.dataset.s==='programacio') renderCal();
  if(btn.dataset.s==='config') renderConfig();
}
function renderAll(){ renderHome(); renderAlumnes(); renderCompTiles(); renderCal(); renderConfig(); }
function showCV(show,hide){ document.getElementById(show).style.display='block'; document.getElementById(hide).style.display='none'; }

// ═══════════════ HOME ═══════════════
function renderHome(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  document.getElementById('home-title').textContent='Resum — '+mc.curs;
  document.getElementById('home-sub').textContent=trim+' · '+subj;
  var totN=0,sumN=0,actCount=0;
  competencies.forEach(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); actCount+=acts.length;
    acts.forEach(function(act){ alumnes.forEach(function(al){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){sumN+=n;totN++;} }); }); });
  });
  var mitj=totN?Math.round(sumN/totN*10)/10:'—';
  var totalActs=0;
  competencies.forEach(function(comp){
    totalActs+=getActsFor(mc.curs,trim,subj,comp.id).length;
  });
  document.getElementById('home-metrics').innerHTML=
    '<div class="mc"><div class="mc-l">Alumnes</div><div class="mc-v">'+alumnes.length+'</div></div>'
    +'<div class="mc"><div class="mc-l">Nota mitjana</div><div class="mc-v">'+mitj+'</div></div>'
    +'<div class="mc"><div class="mc-l">Activitats</div><div class="mc-v">'+totalActs+'</div><div class="mc-s">aquest trimestre</div></div>'
    +'<div class="mc"><div class="mc-l">Trimestre</div><div class="mc-v" style="font-size:17px;">'+(estat.trimIdx+1)+'r Trim.</div></div>';

  // Barres
  document.getElementById('home-bars').innerHTML=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ alumnes.forEach(function(al){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); }); });
    var avg=c?Math.round(t/c*10)/10:null; var pct=avg?avg*10:0; var col=avg?getColor(avg):'ink3';
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">'
      +'<span style="font-size:10px;font-weight:600;color:var(--ink2);width:80px;flex-shrink:0;line-height:1.3;">'+comp.nom+'</span>'
      +'<div style="flex:1;height:7px;background:var(--line);border-radius:4px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:var(--'+col+');border-radius:4px;"></div></div>'
      +'<span style="font-size:12px;font-weight:700;width:24px;">'+( avg||'—')+'</span>'
    +'</div>';
  }).join('');

  // Gràfic d'aranya classe
  var compAvgs=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ alumnes.forEach(function(al){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); }); });
    return c?Math.round(t/c*10)/10:0;
  });
  var spiderLabels=competencies.map(function(c){
    var words=c.nom.split(' ');
    // Partir en 2 línies màxim de ~10 chars
    return words.length<=2?c.nom:(words[0]+' '+words[1]);
  });
  drawSpider('spider-home', spiderLabels, [compAvgs], ['var(--clay)'], 260, 220);
}

// ═══════════════ SPIDER CHART ═══════════════
function drawSpider(canvasId, labels, datasets, colors, W, H){
  var canvas=document.getElementById(canvasId); if(!canvas) return;
  var ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,W,H);
  var n=labels.length; var cx=W/2; var cy=H/2; var R=Math.min(W,H)/2-30;
  var angleStep=2*Math.PI/n;

  // Grids
  for(var g=2;g<=10;g+=2){
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a=angleStep*i-Math.PI/2;
      var r=R*(g/10);
      var x=cx+r*Math.cos(a); var y=cy+r*Math.sin(a);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle='rgba(0,0,0,0.07)'; ctx.lineWidth=1; ctx.stroke();
  }
  // Eixos
  for(var i=0;i<n;i++){
    var a=angleStep*i-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));
    ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=1; ctx.stroke();
    // Label
    var lx=cx+(R+18)*Math.cos(a); var ly=cy+(R+18)*Math.sin(a);
    ctx.fillStyle='#6E665E'; ctx.font='bold 11px Karla,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(labels[i],lx,ly);
  }
  // Datasets
  datasets.forEach(function(data,di){
    var col=colors[di]||'var(--clay)';
    var hex=col.startsWith('var(')? (di===0?'#B5562F':'#566B47') : col;
    ctx.beginPath();
    data.forEach(function(v,i){
      var a=angleStep*i-Math.PI/2; var r=R*(Math.min(10,Math.max(0,v))/10);
      var x=cx+r*Math.cos(a); var y=cy+r*Math.sin(a);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle=hex+'33'; ctx.fill();
    ctx.strokeStyle=hex; ctx.lineWidth=2; ctx.stroke();
    // Punts
    data.forEach(function(v,i){
      var a=angleStep*i-Math.PI/2; var r=R*(Math.min(10,Math.max(0,v))/10);
      ctx.beginPath(); ctx.arc(cx+r*Math.cos(a),cy+r*Math.sin(a),3,0,2*Math.PI);
      ctx.fillStyle=hex; ctx.fill();
    });
  });
}

// ═══════════════ ALUMNES ═══════════════
function renderAlumnes(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  var cercaEl=document.getElementById('cerca-alumnes');
  var cerca=cercaEl?cercaEl.value.toLowerCase().trim():'';
  var alumnesFiltrats=cerca?alumnes.filter(function(al){return al.nom.toLowerCase().indexOf(cerca)!==-1;}):alumnes;
  document.getElementById('alumne-detail').style.display='none';

  var compCols=competencies.map(function(comp){
    var shortNom=comp.nom.split(' ').slice(0,2).join(' ');
    return '<th style="text-align:center;padding:8px 8px;font-size:9px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.03em;line-height:1.3;white-space:normal;max-width:80px;">'+shortNom+'</th>';
  }).join('');
  var mitjaCol='<th style="text-align:center;padding:8px 8px;font-size:9px;font-weight:700;color:var(--clay);text-transform:uppercase;background:var(--clay-l);">Mitjana</th>';
  var thead='<thead><tr style="background:var(--paper);">'
    +'<th style="text-align:left;padding:8px 12px;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;min-width:160px;">Alumne</th>'
    +compCols
    +mitjaCol
    +'<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;">Comentari</th>'
    +'<th style="padding:8px 8px;"></th>'
    +'</tr></thead>';

  var tbody='<tbody>'+alumnesFiltrats.map(function(al){
    var missatge=missatgesAlumnes[al.nom]||'';
    var compCells=competencies.map(function(comp){
      var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
      acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); });
      var avg=c?Math.round(t/c*10)/10:null;
      return '<td style="text-align:center;padding:8px 8px;">'+renderNota(avg,true)+'</td>';
    }).join('');
    // Nota mitjana = mitjana de les notes per competència (les que es mostren a la fila)
    var valsG=[];
    competencies.forEach(function(comp){
      var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
      acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); });
      var avg=c?Math.round(t/c*10)/10:null;
      if(avg!==null) valsG.push(avg);
    });
    var avgG=valsG.length?Math.round(valsG.reduce(function(a,b){return a+b;},0)/valsG.length*10)/10:null;
    var mitjaCell='<td style="text-align:center;padding:8px 8px;background:var(--clay-l);font-weight:700;">'+renderNota(avgG,true)+'</td>';
    return '<tr style="cursor:pointer;" onclick="obrirAlumne(\''+al.ini+'\')">'
      +'<td style="padding:8px 12px;">'
        +'<div style="display:flex;align-items:center;gap:8px;">'
          +ava(al,26,10)
          +'<span style="font-size:13px;font-weight:600;">'+al.nom+'</span>'
        +'</div>'
      +'</td>'
      +compCells
      +mitjaCell
      +'<td style="padding:8px 10px;max-width:180px;">'
        +'<span style="font-size:11.5px;color:var(--ink2);font-style:italic;">'+
          (missatge?missatge:'<span style="color:var(--ink3);">—</span>')+
        '</span>'
      +'</td>'
      +'<td style="padding:8px 8px;">'
        +'<button class="btn btn-sm" data-nom="'+al.nom+'" onclick="event.stopPropagation();obrirMissatgeAluBtn(this)">'+
          (missatge?'Editar':'+ Nota')+
        '</button>'
      +'</td>'
    +'</tr>';
  }).join('')+'</tbody>';

  document.getElementById('alumnes-table-wrap').innerHTML=
    '<div style="background:var(--surface);border:1px solid var(--line);border-radius:var(--rl);overflow-x:auto;">'
    +'<table style="width:100%;border-collapse:collapse;">'+thead+tbody+'</table>'
    +'</div>';
}

function obrirAlumne(ini){
  var al=alumnes.find(function(a){return a.ini===ini;}); if(!al) return;
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  document.getElementById('alumnes-table-wrap').style.display='none';
  document.getElementById('alumne-detail').style.display='block';

  // Calcular notes per competència per a l'alumne
  var alumneVals=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[ini]?act.notes[ini][crit]:null; if(n!=null){t+=n;c++;} }); });
    return c?Math.round(t/c*10)/10:0;
  });
  // Calcular mitjana de classe per competència
  var classeVals=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ alumnes.forEach(function(al2){ comp.criteris.forEach(function(crit){ var n=act.notes[al2.ini]?act.notes[al2.ini][crit]:null; if(n!=null){t+=n;c++;} }); }); });
    return c?Math.round(t/c*10)/10:0;
  });

  var canvasId='spider-alu-'+ini;
  var missatge=missatgesAlumnes[al.nom]||'';

  document.getElementById('alumne-detail-body').innerHTML=
    '<div class="card" style="margin-bottom:12px;">'
      +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">'
        +ava(al,44,16)
        +'<div style="flex:1;">'
          +'<div style="font-size:17px;font-weight:700;">'+al.nom+'</div>'
          +'<div style="font-size:12px;color:var(--ink3);">'+mc.curs+' · '+trim+' · '+subj+'</div>'
        +'</div>'
        +'<button class="btn btn-sm" data-nom="'+al.nom+'" onclick="obrirMissatgeAluBtn(this)">'+(missatge?'Editar comentari':'+ Comentari')+'</button>'
      +'</div>'
      +(missatge?'<div style="font-size:13px;color:var(--ink2);background:var(--paper);border-radius:8px;padding:9px 12px;font-style:italic;margin-bottom:14px;">'+missatge+'</div>':'')
      +'<div class="g2">'
        +'<div>'
          +'<div class="sec" style="margin-bottom:4px;">Gràfic d\'aranya <span style="color:var(--clay);font-weight:700;">'+al.nom.split(' ')[0]+'</span> vs classe</div>'
          +'<div class="spider-wrap"><canvas id="'+canvasId+'" width="240" height="200"></canvas></div>'
          +'<div style="display:flex;gap:14px;justify-content:center;margin-top:6px;">'
            +'<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);"><div style="width:12px;height:3px;background:var(--clay);border-radius:2px;"></div>'+al.nom.split(' ')[0]+'</div>'
            +'<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);"><div style="width:12px;height:3px;background:var(--moss);border-radius:2px;"></div>Classe</div>'
          +'</div>'
        +'</div>'
        +'<div>'
          +'<div class="sec">Notes per competència</div>'
          +competencies.map(function(comp,ci){
            var v=alumneVals[ci]; var col=v?getColor(v):'ink3';
            return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">'
              +'<span style="font-size:10px;font-weight:600;color:var(--ink2);width:80px;flex-shrink:0;line-height:1.3;">'+comp.nom+'</span>'
              +'<div style="flex:1;height:7px;background:var(--line);border-radius:4px;overflow:hidden;">'
                +'<div style="height:100%;width:'+(v?v*10:0)+'%;background:var(--'+col+');border-radius:4px;"></div>'
              +'</div>'
              +'<span style="font-size:12px;font-weight:700;width:24px;">'+renderNota(v||null,false)+'</span>'
            +'</div>';
          }).join('')
        +'</div>'
      +'</div>'
    +'</div>';

  // Dibuixar spider
  setTimeout(function(){
    var spiderLbls=competencies.map(function(c){
      var words=c.nom.split(' ');
      return words.length<=2?c.nom:(words[0]+' '+words[1]);
    });
    drawSpider(canvasId, spiderLbls, [alumneVals, classeVals], ['var(--clay)','var(--moss)'], 240, 200);
  }, 30);
}

function obrirMissatgeAluBtn(btn){ obrirMissatgeAlu(btn.dataset.nom); }
function obrirMissatgeAlu(nom){
  document.getElementById('pop-miss-nom').textContent=nom;
  document.getElementById('pop-miss-text').value=missatgesAlumnes[nom]||'';
  document.getElementById('pop-miss').style.display='flex';
  document.getElementById('pop-miss').dataset.nom=nom;
  setTimeout(function(){document.getElementById('pop-miss-text').focus();},80);
}
function guardarMissatge(){
  var nom=document.getElementById('pop-miss').dataset.nom;
  missatgesAlumnes[nom]=document.getElementById('pop-miss-text').value.trim();
  document.getElementById('pop-miss').style.display='none';
  renderAlumnes(); toast('Comentari guardat ✓');
}

// ═══════════════ COMPETÈNCIES ═══════════════
function renderCompTiles(){
  showCV('cv-llista','cv-activitats'); showCV('cv-llista','cv-graella');
  document.getElementById('cv-llista').style.display='block';
  document.getElementById('comp-tiles').innerHTML=competencies.map(function(comp){
    var acts=getActs(comp.id);
    return '<div class="comp-tile" onclick="openComp(\''+comp.id+'\')">'
      +'<div class="comp-ico" style="background:var(--'+comp.color+'-l);color:var(--'+comp.color+');">'+comp.ico+'</div>'
      +'<div><div style="font-size:13px;font-weight:700;">'+comp.nom+'</div>'
        +'<div style="font-size:11px;color:var(--ink3);">'+acts.length+' activitats</div></div>'
      +'<span style="margin-left:auto;color:var(--ink3);">›</span>'
    +'</div>';
  }).join('');
}
function openComp(compId){
  currentCompId=compId;
  var comp=competencies.find(function(c){return c.id===compId;});
  var acts=getActs(compId);
  document.getElementById('cv-llista').style.display='none';
  document.getElementById('cv-activitats').style.display='block';
  document.getElementById('cv-graella').style.display='none';
  document.getElementById('cv-act-title').textContent=comp.ico+' '+comp.nom;

  var html='<div style="display:flex;justify-content:flex-end;margin-bottom:8px;">'
    +'<button class="btn btn-clay btn-sm" onclick="novaActivitat(\''+compId+'\')">+ Nova activitat</button></div>';

  if(!acts.length){
    html+='<div style="padding:32px;text-align:center;color:var(--ink3);border:1.5px dashed var(--line2);border-radius:var(--rl);">Sense activitats. <button class="btn btn-clay btn-sm" style="margin-left:6px;" onclick="novaActivitat(\''+compId+'\')">Crear-ne una</button></div>';
    document.getElementById('cv-act-body').innerHTML=html; return;
  }

  html+='<div style="overflow-x:auto;border:1px solid var(--line);border-radius:var(--rl);">'
    +'<table class="tbl" style="min-width:max-content;width:100%;"><thead><tr style="background:var(--paper);">'
    +'<th class="sticky" style="min-width:150px;background:var(--paper);">Alumne</th>'
    +acts.map(function(act){
      return '<th style="min-width:100px;text-align:center;vertical-align:top;padding:8px 6px;">'
        +'<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:3px;cursor:pointer;" data-cid="'+compId+'" data-aid="'+act.id+'" onclick="openGraellaBtn(this)">'
          +'<span style="font-size:10px;color:var(--clay);text-decoration:underline;line-height:1.4;">'+act.nom+'</span>'
        +'</div>'
        +'<span style="font-size:9px;color:var(--ink3);font-weight:400;display:block;margin-bottom:5px;">'+act.data+'</span>'
        +'</th>';
    }).join('')
    +'<th style="text-align:center;background:var(--paper);min-width:65px;font-size:10px;">Global</th>'
    +'</tr></thead>'
    +'<tbody>'+alumnes.map(function(al){
      var notes_al=acts.map(function(a){ return notaMitjana(a,comp,al.ini); });
      var valids=notes_al.filter(function(n){return n!==null;});
      var global=valids.length?Math.round(valids.reduce(function(a,b){return a+b;},0)/valids.length*10)/10:null;
      return '<tr>'
        +'<td class="sticky" style="padding:8px 12px;"><div style="display:flex;align-items:center;gap:7px;">'+ava(al,26,10)+'<span style="font-weight:600;font-size:13.5px;">'+al.nom+'</span></div></td>'
        +notes_al.map(function(n){ return '<td style="text-align:center;padding:9px 8px;">'+renderNota(n)+'</td>'; }).join('')
        +'<td style="text-align:center;padding:9px 8px;background:var(--paper);">'+renderNota(global,true)+'</td>'
      +'</tr>';
    }).join('')+'</tbody></table></div>';
  document.getElementById('cv-act-body').innerHTML=html;
}

function saveNota(inp){
  var val=parseFloat(inp.value.toString().replace(',','.'));
  var ini=inp.dataset.ini; var ci=parseInt(inp.dataset.ci);
  var compId=inp.dataset.compid; var actId=inp.dataset.actid;
  var comp=competencies.find(function(c){return c.id===compId;});
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  if(isNaN(val)||inp.value===''){if(act.notes[ini]) delete act.notes[ini][comp.criteris[ci]]; inp.value=''; inp.className='nota-input'; recalcGlobal(act,comp,ini); return;}
  val=Math.max(0,Math.min(10,Math.round(val*10)/10)); inp.value=val;
  if(!act.notes[ini]) act.notes[ini]={};
  act.notes[ini][comp.criteris[ci]]=val;
  inp.className='nota-input '+notaClass(val);
  recalcGlobal(act,comp,ini);
}
function recalcGlobal(act,comp,ini){
  var t=0,c=0;
  comp.criteris.forEach(function(crit){var n=act.notes[ini]?act.notes[ini][crit]:null; if(n!=null){t+=n;c++;}});
  var g=c?Math.round(t/c*10)/10:null;
  var el=document.getElementById('global-'+ini); if(el) el.innerHTML=renderNota(g,true);
}
function saveNotaAltres(inp){
  var val=parseFloat(inp.value.toString().replace(',','.'));
  var ini=inp.dataset.ini; var compId=inp.dataset.compid; var actId=inp.dataset.actid;
  var comp=competencies.find(function(c){return c.id===compId;});
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act||!comp) return;
  if(!act.notaAltres) act.notaAltres={};
  if(isNaN(val)||inp.value===''){delete act.notaAltres[ini]; inp.value=''; inp.className='nota-input'; recalcGlobal(act,comp,ini); return;}
  val=Math.max(0,Math.min(10,Math.round(val*10)/10)); inp.value=val;
  inp.className='nota-input '+notaClass(val); act.notaAltres[ini]=val;
  recalcGlobal(act,comp,ini);
}
function saveAltres(inp){
  var ini=inp.dataset.ini; var compId=inp.dataset.compid; var actId=inp.dataset.actid;
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  if(!act.altres) act.altres={}; act.altres[ini]=inp.value;
}
function navNota(event,inp){
  if(event.key!=='Enter'&&event.key!=='Tab') return;
  event.preventDefault(); saveNota(inp);
  var ci=parseInt(inp.dataset.ci); var ini=inp.dataset.ini; var compId=inp.dataset.compid;
  var comp=competencies.find(function(c){return c.id===compId;}); var ai=alumnes.findIndex(function(a){return a.ini===ini;});
  var nIni,nCi;
  if(event.key==='Tab'){if(ci+1<comp.criteris.length){nIni=ini;nCi=ci+1;}else{nIni=alumnes[(ai+1)%alumnes.length].ini;nCi=0;}}
  else{nIni=alumnes[(ai+1)%alumnes.length].ini;nCi=ci;}
  var next=document.getElementById('ni_'+nIni+'_'+nCi); if(next){next.focus();next.select();}
}
function showRubricaPopBtn(el){showRubricaPop(el.dataset.cid,parseInt(el.dataset.ci));}
function showRubricaPop(compId,ci){
  var comp=competencies.find(function(c){return c.id===compId;});
  var crit=comp.criteris[ci]; var rubRow=rubrica[compId]?rubrica[compId][ci]:null;
  document.getElementById('pop-rub-criteri').textContent=crit;
  document.getElementById('pop-rub-rangs').innerHTML=rubRow?escales.map(function(e){
    return '<div class="rub-rang" style="background:var(--'+e.color+'-l);">'
      +'<div class="rub-rang-label" style="color:var(--'+e.color+');">'+e.rang+' — '+e.label+'</div>'
      +'<div class="rub-rang-text">'+rubRow[e.rang]+'</div></div>';
  }).join(''):('<div style="color:var(--ink3);font-size:13px;">Sense rúbrica definida.</div>');
  document.getElementById('pop-rubrica').style.display='flex';
}

function tancarNovaAct(){var e=document.getElementById('pop-nova-act');if(e)e.remove();}
var _novaActCompId='';
function novaActivitat(compId){
  _novaActCompId=compId;
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-nova-act';
  var today=new Date();
  var dd=('0'+today.getDate()).slice(-2); var mm=('0'+(today.getMonth()+1)).slice(-2); var yy=today.getFullYear();
  overlay.innerHTML='<div class="popup" style="width:360px;">'
    +'<div class="popup-head">Nova activitat</div>'
    +'<div class="fg"><label class="flbl">Nom</label><input class="input" id="nova-act-nom" placeholder="Ex: Dictat setmana 10..."></div>'
    +'<div class="fg"><label class="flbl">Data</label><input class="input" id="nova-act-data" value="'+dd+'/'+mm+'/'+yy+'"></div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="crearActivitat()">Crear</button>'
      +'<button class="btn btn-ghost" onclick="tancarNovaAct()">Cancel·lar</button>'
    +'</div></div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('nova-act-nom');if(inp)inp.focus();},60);
}
function dataISO(dd_mm_yyyy){
  var parts=dd_mm_yyyy.split('/');
  if(parts.length===3) return parts[2]+'-'+('0'+parts[1]).slice(-2)+'-'+('0'+parts[0]).slice(-2);
  return dd_mm_yyyy;
}
function crearActivitat(){
  var nomInp=document.getElementById('nova-act-nom'); var dataInp=document.getElementById('nova-act-data');
  var nom=nomInp?nomInp.value.trim():''; if(!nom){toast('Escriu el nom');return;}
  var data=dataInp?dataInp.value.trim():'';
  var ov=document.getElementById('pop-nova-act'); if(ov) ov.remove();
  var id='a'+Date.now();
  var act={id:id,nom:nom,data:data,notes:{},altres:{},notaAltres:{},missatges:{}};
  alumnes.forEach(function(al){act.notes[al.ini]={};act.altres[al.ini]='';act.notaAltres[al.ini]=null;});
  var k=getKey(_novaActCompId); if(!activitats[k]) activitats[k]=[];
  activitats[k].push(act);
  var mc2=mesCursos[estat.cursIdx];
  calEvents.push({id:'ev_'+id,titol:nom+(mc2?' ('+mc2.assigns[estat.subjIdx]+')':''),data:dataISO(data),dataFi:dataISO(data),tipus:'activitat',autoGen:true});
  toast('"'+nom+'" creada ✓');
  openComp(_novaActCompId);
  setTimeout(function(){openGraella(_novaActCompId,id);},60);
}

function tancarComentariAct(){var e=document.getElementById('pop-comentari-act');if(e)e.remove();}
function obrirComentariActBtn(btn){obrirComentariAct(btn.dataset.ini,btn.dataset.act,btn.dataset.comp);}
function obrirComentariAct(ini, actId, compId){
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  var al=alumnes.find(function(a){return a.ini===ini;}); if(!al) return;
  if(!act.altres) act.altres={};
  var actual=act.altres[ini]||'';
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-comentari-act';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div class="popup-title">'+act.nom+'</div>'
    +'<div class="popup-head">Comentari — '+al.nom+'</div>'
    +'<textarea class="input" id="comentari-act-text" rows="4" placeholder="Observacions, comportament...">'+actual+'</textarea>'
    +'<div style="display:flex;gap:8px;margin-top:10px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="guardarComentariActBtn(this)" data-ini="'+ini+'" data-act="'+actId+'" data-comp="'+compId+'">Guardar</button>'
      +'<button class="btn btn-ghost" onclick="tancarComentariAct()">Cancel</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var t=document.getElementById('comentari-act-text');if(t)t.focus();},60);
}
function guardarComentariActBtn(btn){guardarComentariAct(btn.dataset.ini,btn.dataset.act,btn.dataset.comp);}
function guardarComentariAct(ini,actId,compId){
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  if(!act.altres) act.altres={};
  var text=document.getElementById('comentari-act-text').value;
  act.altres[ini]=text;
  var ov=document.getElementById('pop-comentari-act'); if(ov) ov.remove();
  openGraella(compId,actId);
  toast('Comentari guardat ✓');
}

// ═══════════════ PROGRAMACIÓ - CALENDARI ═══════════════
var evColors={examen:'clay',activitat:'sky',excursio:'moss',reunio:'plum',altre:'honey'};
function renderCal(){
  var mesNoms=['Gener','Febrer','Marc','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
  document.getElementById('cal-mes-label').textContent=mesNoms[calMes]+' '+calAny;
  var d=new Date(calAny,calMes,1);
  var startDay=(d.getDay()+6)%7;
  var daysInMes=new Date(calAny,calMes+1,0).getDate();
  var prevDays=new Date(calAny,calMes,0).getDate();
  var today=new Date();
  var html='';
  var totalCells=Math.ceil((startDay+daysInMes)/7)*7;
  for(var i=0;i<totalCells;i++){
    var day,month,year,otherMonth=false;
    if(i<startDay){day=prevDays-startDay+i+1;month=calMes===0?11:calMes-1;year=calMes===0?calAny-1:calAny;otherMonth=true;}
    else if(i>=startDay+daysInMes){day=i-startDay-daysInMes+1;month=calMes===11?0:calMes+1;year=calMes===11?calAny+1:calAny;otherMonth=true;}
    else{day=i-startDay+1;month=calMes;year=calAny;}
    var mm2=('0'+(month+1)).slice(-2); var dd2=('0'+day).slice(-2);
    var dateStr=year+'-'+mm2+'-'+dd2;
    var isToday=(!otherMonth&&day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear());
    var dayEvs=calEvents.filter(function(ev){return dateStr>=ev.data&&dateStr<=(ev.dataFi||ev.data);});
    var evHtml=dayEvs.slice(0,2).map(function(ev){
      var col=evColors[ev.tipus]||'honey';
      return '<div class="cal-event" style="background:var(--'+col+'-l);color:var(--'+col+');" title="'+ev.titol+'">'+ev.titol+'</div>';
    }).join('');
    html+='<div class="cal-day'+(isToday?' today':'')+(otherMonth?' other-month':'')+'" data-date="'+dateStr+'" onclick="obrirNouEventDiaBtn(this)">'
      +'<div class="cal-day-num">'+day+'</div>'+evHtml+'</div>';
  }
  document.getElementById('cal-grid').innerHTML=html;
  var mesEvs=calEvents.filter(function(ev){
    var d2=new Date(ev.data); return d2.getMonth()===calMes&&d2.getFullYear()===calAny;
  });
  document.getElementById('cal-events-avui').innerHTML=mesEvs.length?
    '<div class="card"><div class="sec">Events aquest mes</div>'
    +mesEvs.map(function(ev){
      var col=evColors[ev.tipus]||'honey';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);">'
        +'<span class="pill p-'+col+'" style="font-size:10px;">'+ev.tipus+'</span>'
        +'<span style="flex:1;font-size:13px;font-weight:500;">'+ev.titol+'</span>'
        +'<span style="font-size:11px;color:var(--ink3);">'+(ev.dataFi&&ev.dataFi!==ev.data?ev.data.split('-').reverse().slice(0,2).join('/')+' → '+ev.dataFi.split('-').reverse().slice(0,2).join('/'):ev.data.split('-').reverse().join('/'))+'</span>'
        +'<button class="btn btn-sm btn-danger" data-evid="'+ev.id+'" onclick="eliminarEventBtn(this)">✕</button>'
      +'</div>';
    }).join('')+'</div>':'';
}
function calNavMes(d){calMes+=d;if(calMes<0){calMes=11;calAny--;}if(calMes>11){calMes=0;calAny++;}renderCal();}
function obrirNouEvent(){
  var today=new Date();
  var ds=today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+today.getDate()).slice(-2);
  document.getElementById('ev-data').value=ds;
  document.getElementById('ev-data-fi').value='';
  document.getElementById('ev-titol').value='';
  document.getElementById('pop-event').style.display='flex';
  setTimeout(function(){document.getElementById('ev-titol').focus();},60);
}
function obrirNouEventDiaBtn(el){obrirNouEventDia(el.dataset.date);}
function obrirNouEventDia(dateStr){
  document.getElementById('ev-data').value=dateStr;
  document.getElementById('ev-data-fi').value='';
  document.getElementById('ev-titol').value='';
  document.getElementById('pop-event').style.display='flex';
  setTimeout(function(){document.getElementById('ev-titol').focus();},60);
}
function guardarEvent(){
  var titol=document.getElementById('ev-titol').value.trim();
  if(!titol){toast('Escriu el titol');return;}
  var dataInici=document.getElementById('ev-data').value;
  var dataFi=document.getElementById('ev-data-fi').value;
  if(!dataInici){toast('Cal la data');return;}
  if(dataFi&&dataFi<dataInici){toast('La data fi no pot ser anterior');return;}
  calEvents.push({id:'e'+Date.now(),titol:titol,data:dataInici,dataFi:dataFi||dataInici,tipus:document.getElementById('ev-tipus').value});
  document.getElementById('pop-event').style.display='none';
  document.getElementById('ev-data-fi').value='';
  renderCal(); toast('Event guardat ✓');
}
function eliminarEventBtn(btn){eliminarEvent(btn.dataset.evid);}
function eliminarEvent(id){calEvents=calEvents.filter(function(e){return e.id!==id;});renderCal();toast('Event eliminat');}

// ═══════════════ CONFIGURACIÓ ═══════════════
function cfgTab(btn,id){
  document.querySelectorAll('.cfg-tab').forEach(function(t){t.classList.remove('on');}); btn.classList.add('on');
  document.querySelectorAll('.cfg-section').forEach(function(s){s.classList.remove('on');});
  document.getElementById(id).classList.add('on');
  if(id==='cfg-rubrica') renderRubrica();
  if(id==='cfg-alumnes') renderCfgAlumnes();
}
function renderConfig(){ renderCfgAlumnes(); renderRubrica(); renderVis(); }
function renderVis(){}
function toggleVis(){}

function renderCfgAlumnes(){
  var cnt=document.getElementById('alu-count'); if(cnt) cnt.textContent=alumnes.length;
  var el=document.getElementById('alu-list-cfg'); if(!el) return;
  el.innerHTML=alumnes.length?alumnes.map(function(al,i){
    return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);">'
      +ava(al,26,10)
      +(al.id?'<span style="font-size:10px;font-weight:700;color:var(--clay);background:var(--clay-l);padding:2px 6px;border-radius:4px;flex-shrink:0;">'+al.id+'</span>':'')
      +'<span style="flex:1;font-size:13px;font-weight:500;">'+al.nom+'</span>'
      +'<button class="btn btn-sm btn-danger" onclick="confirmarEliminarAlumne('+i+')">Eliminar</button>'
    +'</div>';
  }).join(''):'<div style="color:var(--ink3);font-size:13px;padding:14px 0;text-align:center;">Sense alumnes</div>';
}
function addAlumneManual(){
  var inp=document.getElementById('inp-alu'); var nom=inp.value.trim();
  if(!nom){toast('Escriu el nom');return;}
  if(alumnes.find(function(a){return a.nom.toLowerCase()===nom.toLowerCase();})){toast('Ja existeix');return;}
  var parts=nom.trim().split(' ').filter(function(x){return x.length>0;});
  var ini=parts.length>=2?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():nom.substring(0,2).toUpperCase();
  alumnes.push({ini:ini,nom:nom,color:colorIdx(alumnes.length)});
  inp.value=''; inp.focus(); renderCfgAlumnes(); toast(nom+' afegit ✓');
}
function tancarDelAlu(){var e=document.getElementById('pop-del-alu');if(e)e.remove();}
function confirmarEliminarAlumne(idx){
  var al=alumnes[idx];
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-del-alu';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div style="font-size:32px;text-align:center;margin-bottom:10px;">⚠️</div>'
    +'<div class="popup-head" style="text-align:center;">Eliminar alumne</div>'
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">Eliminaras: <b>'+al.nom+'</b></div>'
    +'<div style="font-size:12.5px;color:var(--clay);background:var(--clay-l);border-radius:var(--r);padding:10px 12px;margin-bottom:16px;text-align:center;line-height:1.6;">Un cop eliminat, les notes i activitats es perdran per sempre i no es podran recuperar.</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-danger" style="flex:1;background:var(--clay);color:#fff;border-color:var(--clay);" onclick="delAlumne('+idx+')">Sí, eliminar</button>'
      +'<button class="btn" style="flex:1;" onclick="tancarDelAlu()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
}
function delAlumne(idx){
  var ov=document.getElementById('pop-del-alu'); if(ov) ov.remove();
  alumnes.splice(idx,1); renderCfgAlumnes(); toast('Alumne eliminat');
}
function handleDrop(e){ var f=e.dataTransfer.files[0]; if(f) processFile(f); }
function handleExcelFile(inp){ var f=inp.files[0]; if(f) processFile(f); inp.value=''; }
function processFile(file){
  var fb=document.getElementById('excel-feedback'); fb.innerHTML='<div style="font-size:11px;color:var(--ink3);">Llegint...</div>';
  var ext=file.name.split('.').pop().toLowerCase();
  if(ext==='csv'){var r=new FileReader();r.onload=function(e){processRows(e.target.result.split(String.fromCharCode(10)).map(function(l){return [l.trim()];}));};r.readAsText(file,'UTF-8');return;}

  if(typeof XLSX==='undefined'){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=function(){readXLSX(file);};s.onerror=function(){fb.innerHTML='<div style="color:var(--clay);">Error. Prova amb CSV.</div>';};document.head.appendChild(s);}
  else{readXLSX(file);}
}
function readXLSX(file){var r=new FileReader();r.onload=function(e){try{var wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});var ws=wb.Sheets[wb.SheetNames[0]];processRows(XLSX.utils.sheet_to_json(ws,{header:1,defval:''}));}catch(err){document.getElementById('excel-feedback').innerHTML='<div style="color:var(--clay);">Error: '+err.message+'</div>';}};r.readAsArrayBuffer(file);}
function processRows(rows){
  var nous=0,dups=0;
  rows.forEach(function(row,idx){
    var col0=String(row[0]||'').trim(); var col1=String(row[1]||'').trim(); var col2=String(row[2]||'').trim();
    if(!col0||col0.length<1) return;
    if(idx===0&&['id','nom','nombre','name','alumne','alumno','codi'].indexOf(col0.toLowerCase())!==-1) return;
    var id='',nom='',cognom='';
    var esID=/^[0-9A-Za-z]{1,4}[-_][0-9A-Za-z]{1,4}$/.test(col0)||/^\d{1,4}$/.test(col0);
    if(esID&&col1){id=col0;nom=col1;cognom=col2;}
    else{id='';nom=col0;cognom=(col1&&col1.length>1&&isNaN(col1))?col1:'';}
    var nomComplet=(cognom?nom+' '+cognom:nom).trim();
    if(nomComplet.length<2) return;
    if(id&&alumnes.find(function(a){return a.id===id;})){dups++;return;}
    if(!id&&alumnes.find(function(a){return a.nom.toLowerCase()===nomComplet.toLowerCase();})){dups++;return;}
    var parts=nomComplet.split(' ').filter(function(x){return x.length>0;});
    var ini2=parts.length>=2?(parts[0][0]+parts[parts.length-1][0]).toUpperCase():nomComplet.substring(0,2).toUpperCase();
    alumnes.push({id:id,ini:ini2,nom:nomComplet,color:colorIdx(alumnes.length)}); nous++;
  });
  renderCfgAlumnes();
  document.getElementById('excel-feedback').innerHTML='<div style="padding:8px 10px;background:var(--moss-l);color:var(--moss);border-radius:var(--r);font-size:12px;font-weight:500;">✓ '+nous+' importats'+(dups?' · '+dups+' duplicats':'')+' </div>';
  toast(nous+' alumnes importats ✓');
}

function renderRubrica(){
  var container = document.getElementById('rubrica-body');
  container.innerHTML = '';
  competencies.forEach(function(comp){
    var rubComp = rubrica[comp.id] || [];
    var esP = !!comp.personalitzable;

    var card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '10px';

    // Capçalera
    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1.5px solid var(--line);';
    var ico = document.createElement('div');
    ico.style.cssText = 'width:28px;height:28px;border-radius:7px;background:var(--'+comp.color+'-l);color:var(--'+comp.color+');display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;';
    ico.textContent = comp.ico;
    var info = document.createElement('div');
    info.style.flex = '1';
    var nomEl = document.createElement('div');
    nomEl.style.cssText = 'font-size:13px;font-weight:700;';
    nomEl.textContent = comp.nom;
    info.appendChild(nomEl);
    if(esP){
      var subEl = document.createElement('div');
      subEl.style.cssText = 'font-size:10px;color:var(--ink3);';
      subEl.textContent = 'Criteris personalitzables';
      info.appendChild(subEl);
    }
    header.appendChild(ico);
    header.appendChild(info);
    var addBtn = document.createElement('button');
    addBtn.className = 'btn btn-sm btn-clay';
    addBtn.textContent = '+ Criteri';
    addBtn.onclick = (function(cid){ return function(){ afegirCriteri(cid); }; })(comp.id);
    header.appendChild(addBtn);
    card.appendChild(header);

    // Taula
    var wrap = document.createElement('div');
    wrap.style.overflowX = 'auto';
    var table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;min-width:480px;';

    // Capçalera taula
    var thead = document.createElement('thead');
    var trHead = document.createElement('tr');
    var thCrit = document.createElement('th');
    thCrit.style.cssText = 'text-align:left;padding:7px 10px;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;border-bottom:1px solid var(--line);min-width:160px;';
    thCrit.textContent = 'Criteri';
    trHead.appendChild(thCrit);
    escales.forEach(function(e){
      var th = document.createElement('th');
      th.style.cssText = 'padding:8px;text-align:center;border-bottom:1px solid var(--line);min-width:120px;';
      var d1 = document.createElement('div');
      d1.style.cssText = 'font-size:13px;font-weight:700;color:var(--'+e.color+');';
      d1.textContent = e.rang;
      var d2 = document.createElement('div');
      d2.style.cssText = 'font-size:10px;color:var(--'+e.color+');font-weight:500;';
      d2.textContent = e.label;
      th.appendChild(d1); th.appendChild(d2);
      trHead.appendChild(th);
    });
    var thDel = document.createElement('th');
    thDel.style.cssText = 'border-bottom:1px solid var(--line);width:36px;';
    trHead.appendChild(thDel);
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Files per criteri
    var tbody = document.createElement('tbody');
    comp.criteris.forEach(function(crit, ci){
      var rubRow = rubComp[ci] || {};
      var tr = document.createElement('tr');

      // Nom del criteri
      var tdCrit = document.createElement('td');
      tdCrit.style.cssText = 'padding:5px 8px;border-bottom:1px solid var(--line);vertical-align:top;';
      // Tots els criteris son editables (fixes per defecte, editables si cal)
      var inp = document.createElement('input');
      inp.className = 'input';
      inp.style.cssText = 'font-size:12px;padding:5px 8px;';
      inp.value = crit;
      inp.dataset.compid = comp.id;
      inp.dataset.ci = ci;
      inp.onchange = function(){ editarNomCriteri(this); };
      inp.title = 'Pots editar el nom del criteri';
      tdCrit.appendChild(inp);
      tr.appendChild(tdCrit);

      // Cel·les de rúbrica
      escales.forEach(function(e){
        var td = document.createElement('td');
        td.style.cssText = 'padding:4px 5px;border-bottom:1px solid var(--line);vertical-align:top;';
        var ta = document.createElement('textarea');
        ta.rows = 3;
        ta.style.cssText = 'width:100%;font-size:12px;line-height:1.5;border:1.5px solid var(--line);border-radius:6px;padding:5px 6px;font-family:inherit;resize:vertical;background:var(--'+e.color+'-l);outline:none;';
        ta.dataset.compid = comp.id;
        ta.dataset.ci = ci;
        ta.dataset.rang = e.rang;
        ta.value = rubRow[e.rang] || '';
        ta.onfocus = function(){ this.style.borderColor='#aaa'; };
        ta.onblur = function(){ saveRubrica(this); };
        td.appendChild(ta);
        tr.appendChild(td);
      });

      // Botó eliminar (tots els criteris, mínim 1)
      var tdDel = document.createElement('td');
      tdDel.style.cssText = 'padding:4px;border-bottom:1px solid var(--line);vertical-align:middle;text-align:center;';
      var delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm';
      delBtn.style.cssText = 'color:var(--clay);padding:3px 7px;';
      delBtn.textContent = '✕';
      delBtn.onclick = (function(cid, idx){ return function(){ eliminarCriteri(cid, idx); }; })(comp.id, ci);
      tdDel.appendChild(delBtn);
      tr.appendChild(tdDel);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    card.appendChild(wrap);
    container.appendChild(card);
  });
}

function saveRubrica(ta){
  var compId=ta.dataset.compid; var ci=parseInt(ta.dataset.ci); var rang=ta.dataset.rang;
  if(!rubrica[compId]) rubrica[compId]=[];
  if(!rubrica[compId][ci]) rubrica[compId][ci]={};
  rubrica[compId][ci][rang]=ta.value.trim();
  toast('Guardat ✓');
}
function afegirCriteriBtn(b){afegirCriteri(b.dataset.cid);}
function eliminarCriteriBtn(b){eliminarCriteri(b.dataset.cid,parseInt(b.dataset.ci));}
function editarNomCriteri(inp){
  var comp=competencies.find(function(c){return c.id===inp.dataset.compid;}); if(!comp) return;
  comp.criteris[parseInt(inp.dataset.ci)]=inp.value;
}
function afegirCriteri(compId){
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  comp.criteris.push('Nou criteri');
  if(!rubrica[compId]) rubrica[compId]=[];
  rubrica[compId].push({'1-4':'','5-6':'','7-8':'','9-10':''});
  renderRubrica(); toast('Criteri afegit ✓');
}
function eliminarCriteri(compId,ci){
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  if(comp.criteris.length<=1){toast('Cal tenir almenys un criteri');return;}
  comp.criteris.splice(ci,1);
  if(rubrica[compId]) rubrica[compId].splice(ci,1);
  renderRubrica(); toast('Criteri eliminat');
}

function exportarJSON(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-json-nom';
  overlay.innerHTML='<div class="popup" style="width:360px;">'
    +'<div class="popup-head">Exportar JSON</div>'
    +'<div class="fg"><label class="flbl">Nom de l&#39;informe</label>'
    +'<input class="input" id="json-nom-inp" value="'+mc.curs+'"></div>'
    +'<div style="font-size:11px;color:var(--ink3);margin-bottom:12px;">Nom per al fitxer exportat.</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="exportarJSONConfirmar()">Exportar</button>'
      +'<button class="btn btn-ghost" onclick="tancarJSONNom()">Cancel</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('json-nom-inp');if(inp){inp.focus();inp.select();}},60);
}
function tancarJSONNom(){var e=document.getElementById('pop-json-nom');if(e)e.remove();}
function exportarJSONConfirmar(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  var nomInforme=(document.getElementById('json-nom-inp')||{}).value||mc.curs;
  var ov=document.getElementById('pop-json-nom'); if(ov) ov.remove();
  var dades={versio:'1.0',exportat:new Date().toISOString(),nomInforme:nomInforme,professor:prof.nom,centre:prof.centre,any:prof.any,curs:mc.curs,trimestre:trim,assignatura:subj,
    alumnes:alumnes.map(function(al){
      var notesPerComp={};
      competencies.forEach(function(comp){
        var acts=getActsFor(mc.curs,trim,subj,comp.id);
        var notesPerAct=acts.map(function(act){
          var notesPerCrit={};
          comp.criteris.forEach(function(crit){notesPerCrit[crit]=act.notes[al.ini]?act.notes[al.ini][crit]:null;});
          var t=0,c=0; comp.criteris.forEach(function(crit){var n=notesPerCrit[crit];if(n!=null){t+=n;c++;}});
          return {id:act.id,nom:act.nom,data:act.data,notesCriteris:notesPerCrit,mitjana:c?Math.round(t/c*10)/10:null,comentari:act.altres?act.altres[al.ini]:''};
        });
        var tC=0,cC=0; notesPerAct.forEach(function(a){if(a.mitjana!=null){tC+=a.mitjana;cC++;}});
        notesPerComp[comp.id]={nom:comp.nom,activitats:notesPerAct,mitjana:cC?Math.round(tC/cC*10)/10:null};
      });
      var vals=Object.values(notesPerComp).map(function(c){return c.mitjana;}).filter(function(v){return v!==null;});
      var global=vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;
      return {id:al.id||'',ini:al.ini,nom:al.nom,global:global,competencies:notesPerComp,comentari:missatgesAlumnes[al.nom]||''};
    })
  };
  var blob=new Blob([JSON.stringify(dades,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a'); a.href=url;
  a.download=nomInforme.replace(/[^a-zA-Z0-9_-]/g,'_')+'_'+subj+'_notes.json';
  a.click(); URL.revokeObjectURL(url);
  toast('JSON exportat ✓');
}

function exportarPDF(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  var cont='<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px;color:#222;}table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:11px;}th,td{border:1px solid #ddd;padding:6px 8px;}th{background:#f0ece4;font-weight:700;font-size:10px;text-transform:uppercase;}h1{font-size:18px;margin-bottom:4px;}p{color:#888;font-size:11px;margin-bottom:14px;}.v{color:#566B47;font-weight:700;}.m{color:#B98627;font-weight:700;}.d{color:#B5562F;font-weight:700;}@media print{body{padding:10px;}}</style></head><body>';
  cont+='<h1>Quadern — '+subj+'</h1>';
  cont+='<p>'+mc.curs+' · '+trim+' · '+prof.centre+' · '+prof.any+' · '+prof.nom+'</p>';
  cont+='<table><thead><tr><th>Alumne</th>';
  competencies.forEach(function(comp){ cont+='<th>'+comp.nom+'</th>'; });
  cont+='<th>Comentari</th></tr></thead><tbody>';
  alumnes.forEach(function(al){
    cont+='<tr><td><b>'+al.nom+'</b></td>';
    competencies.forEach(function(comp){
      var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
      acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); });
      var avg=c?Math.round(t/c*10)/10:null;
      var cls=avg>=7?'v':avg>=5?'m':'d';
      cont+='<td style="text-align:center;" class="'+(avg?cls:'')+'">'+(avg||'—')+'</td>';
    });
    cont+='<td style="font-size:10px;color:#666;">'+(missatgesAlumnes[al.nom]||'')+'</td></tr>';
  });
  cont+='</tbody></table>';
  cont+='<p style="margin-top:20px;color:#aaa;font-size:10px;">Generat amb Quadern · '+new Date().toLocaleDateString('ca-ES')+'</p>';
  cont+='</body></html>';
  var blob=new Blob([cont],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a'); a.href=url; a.target='_blank'; a.click();
  setTimeout(function(){URL.revokeObjectURL(url);},5000);
  toast('PDF obert en nova pestanya — usa Ctrl+P per imprimir');
}

// Informe JSON
var infJSONs=[];
function infHandleDrop(e){infLlegirFitxers(Array.from(e.dataTransfer.files).filter(function(f){return f.name.endsWith('.json');}));}
function infHandleFiles(inp){infLlegirFitxers(Array.from(inp.files));inp.value='';}
function infLlegirFitxers(files){
  var pending=files.length; if(!pending){toast('Cap fitxer JSON');return;}
  files.forEach(function(file){
    var r=new FileReader();
    r.onload=function(e){
      try{var d=JSON.parse(e.target.result);var key=(d.curs||'')+'_'+(d.trimestre||'')+'_'+(d.assignatura||'');infJSONs=infJSONs.filter(function(j){return j.key!==key;});infJSONs.push({key:key,nom:file.name,dades:d});}
      catch(err){toast('Error llegint '+file.name);}
      pending--; if(pending===0) infRenderFitxers();
    };
    r.readAsText(file,'UTF-8');
  });
}
function infRenderFitxers(){
  var el=document.getElementById('inf-fitxers-list'); if(!el) return;
  var btn=document.getElementById('inf-gen-btn');
  if(!infJSONs.length){el.innerHTML='';if(btn)btn.disabled=true;return;}
  el.innerHTML=infJSONs.map(function(j,i){
    var d=j.dades;
    return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);">'
      +'<div style="flex:1;"><div style="font-size:12.5px;font-weight:600;">'+(d.assignatura||'?')+'</div>'
        +'<div style="font-size:11px;color:var(--ink3);">'+(d.curs||'')+(d.trimestre?' · '+d.trimestre:'')+' · '+(d.professor||'')+'</div></div>'
      +'<button class="btn btn-sm btn-danger" onclick="infJSONs.splice('+i+',1);infRenderFitxers()">✕</button>'
    +'</div>';
  }).join('');
  if(btn) btn.disabled=false;
}
function generarInforme(){
  var trimFilt=document.getElementById('inf-trim-sel').value;
  var jsonsFilt=trimFilt?infJSONs.filter(function(j){return j.dades.trimestre===trimFilt;}):infJSONs;
  if(!jsonsFilt.length){toast('Cap fitxer');return;}
  var alumnesMap={};
  jsonsFilt.forEach(function(j){
    var d=j.dades;
    (d.alumnes||[]).forEach(function(al){
      var uid=al.id||al.nom;
      if(!alumnesMap[uid]) alumnesMap[uid]={nom:al.nom,id:al.id||'',assigns:{}};
      alumnesMap[uid].assigns[d.assignatura]={nota:al.global,trim:d.trimestre};
    });
  });
  var totsSubjs=[]; jsonsFilt.forEach(function(j){if(totsSubjs.indexOf(j.dades.assignatura)===-1)totsSubjs.push(j.dades.assignatura);});
  var noms=Object.keys(alumnesMap).sort(function(a,b){return alumnesMap[a].nom.localeCompare(alumnesMap[b].nom);});
  var cont='<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px;}table{width:100%;border-collapse:collapse;margin-bottom:20px;}th,td{border:1px solid #ddd;padding:6px 8px;text-align:center;}th{background:#f0ece4;font-size:10px;text-transform:uppercase;font-weight:700;}td:first-child{text-align:left;font-weight:bold;}.v{color:#566B47;font-weight:700;}.m{color:#B98627;font-weight:700;}.d{color:#B5562F;font-weight:700;}h1{font-size:18px;margin-bottom:4px;}p{color:#888;font-size:11px;margin-bottom:14px;}</style></head><body>';
  cont+='<h1>Informe de notes consolidades</h1>';
  cont+='<p>'+(trimFilt||'Mitjana anual')+' · Generat: '+new Date().toLocaleDateString('ca-ES')+'</p>';
  cont+='<table><thead><tr><th>Alumne</th>'+totsSubjs.map(function(s){return '<th>'+s+'</th>';}).join('')+'<th>Global</th></tr></thead><tbody>';
  noms.forEach(function(uid){
    var al=alumnesMap[uid]; cont+='<tr><td>'+al.nom+'</td>';
    var vals=[];
    totsSubjs.forEach(function(s){var n=al.assigns[s]?al.assigns[s].nota:null;if(n!==null)vals.push(n);var cls=n>=7?'v':n>=5?'m':'d';cont+='<td class="'+(n?cls:'')+'">'+(n||'—')+'</td>';});
    var global=vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;
    var gcls=global>=7?'v':global>=5?'m':'d';
    cont+='<td class="'+(global?gcls:'')+'" style="font-size:14px;">'+(global||'—')+'</td></tr>';
  });
  cont+='</tbody></table></body></html>';
  var blob=new Blob([cont],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a'); a.href=url; a.target='_blank'; a.click();
  setTimeout(function(){URL.revokeObjectURL(url);},5000);
  toast('Informe generat ✓');
}

// ─── FUNCIONS QUE FALTAVEN ───
function renderEntradaRapida(){
  // Ja no s'usa (entrada rapida eliminada), funció buida per compatibilitat
}

function openGraellaBtn(el){openGraella(el.dataset.cid,el.dataset.aid);}
function openGraella(compId, actId){
  var comp=competencies.find(function(c){return c.id===compId;});
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  if(!act.notaAltres) act.notaAltres={};
  if(!act.altres) act.altres={};
  alumnes.forEach(function(al){
    if(!act.notes[al.ini]) act.notes[al.ini]={};
    if(act.notaAltres[al.ini]===undefined) act.notaAltres[al.ini]=null;
    if(!act.altres[al.ini]) act.altres[al.ini]='';
  });
  document.getElementById('cv-activitats').style.display='none';
  document.getElementById('cv-graella').style.display='block';
  document.getElementById('cv-gr-title').textContent=act.nom;
  document.getElementById('cv-gr-data').textContent=act.data;
  var swEl=document.getElementById('cv-gr-switch');
  if(swEl) swEl.innerHTML='';

  var thead='<thead><tr style="background:var(--paper);">'
    +'<th class="sticky" style="min-width:150px;background:var(--paper);">Alumne</th>'
    +comp.criteris.map(function(crit,ci){
      return '<th style="min-width:110px;max-width:140px;text-align:center;padding:9px 8px;white-space:normal;line-height:1.4;vertical-align:top;cursor:pointer;" data-cid="'+compId+'" data-ci="'+ci+'" onclick="showRubricaPopBtn(this)">'
        +'<span style="font-size:10px;color:var(--clay);text-decoration:underline;line-height:1.5;">'+crit+'</span></th>';
    }).join('')
    +'<th style="text-align:center;background:var(--paper);min-width:65px;font-size:10px;">Global</th>'
    +'<th style="min-width:140px;font-size:10px;color:var(--ink2);">Comentari</th>'
    +'</tr></thead>';

  var tbody='<tbody>'+alumnes.map(function(al){
    var total=0,count=0;
    comp.criteris.forEach(function(crit){
      var n=act.notes[al.ini]?act.notes[al.ini][crit]:null;
      if(n!=null){total+=parseFloat(n);count++;}
    });
    var global=count?Math.round(total/count*10)/10:null;
    var altres=act.altres[al.ini]||'';
    return '<tr>'
      +'<td class="sticky" style="padding:7px 12px;"><div style="display:flex;align-items:center;gap:7px;">'+ava(al,26,10)+'<span style="font-weight:600;font-size:13.5px;">'+al.nom+'</span></div></td>'
      +comp.criteris.map(function(crit,ci){
        var n=act.notes[al.ini]?act.notes[al.ini][crit]:null;
        var id='ni_'+al.ini+'_'+ci;
        return '<td style="text-align:center;padding:5px 6px;">'
          +'<input type="number" id="'+id+'" class="nota-input '+(n!==null?notaClass(n):'')+'" value="'+(n!==null?n:'')+'" placeholder="—" min="0" max="10" step="0.1"'
          +' data-ini="'+al.ini+'" data-ci="'+ci+'" data-compid="'+compId+'" data-actid="'+actId+'"'
          +' onfocus="this.select()" onblur="saveNota(this)" onkeydown="navNota(event,this)">'
          +'</td>';
      }).join('')
      +'<td style="text-align:center;padding:5px 6px;background:var(--paper);" id="global-'+al.ini+'">'+renderNota(global,true)+'</td>'
      +'<td style="padding:5px 8px;">'
        +'<button class="btn btn-sm" style="font-size:11px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" '
          +'data-ini="'+al.ini+'" data-act="'+actId+'" data-comp="'+compId+'" onclick="obrirComentariActBtn(this)">'
          +(altres?altres.substring(0,15)+(altres.length>15?'...':''):'+ Nota')
        +'</button>'
      +'</td>'
    +'</tr>';
  }).join('')+'</tbody>';

  document.getElementById('cv-table').innerHTML=thead+tbody;
}

// ═══════════════ INIT ═══════════════
initGate();
updateNav(); renderAll();
abrirGateSeleccio();
setTimeout(function(){ renderEntradaRapida(); }, 10);
</script>
</body>
</html>