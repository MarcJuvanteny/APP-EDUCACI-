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

var AUTH_KEY = 'arrel_auth_v1';
var PERFIL_KEY = 'arrel_perfil_v1';
var authState = { isLogged: false, user: null };

function normTxt(s){
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
}
function comp(id, nom, ico, color, criteri, na, as, an, ae){
  return {
    id:id,
    nom:nom,
    ico:ico,
    color:color,
    criteris:[criteri],
    rubrica:{'1-4':na,'5-6':as,'7-8':an,'9-10':ae}
  };
}

var competenciesByArea = {
  llengues: [
    comp('lleng-comp-1','Comprensio Oral','CO','sky','Escoltar i comprendre idees clau','No ho entén o demana molta repetició','Entén les idees clau i dades directes','Entén detalls i el sentit global','Interpreta intencions i fa inferències'),
    comp('lleng-comp-2','Comprensio Escrita','CE','clay','Lectura i interpretació de textos','Li costa descodificar o no s\'aclareix','Llegeix amb fluïdesa i troba dades directes','Fa inferències i comprèn l\'estructura','Llegeix amb esperit crític i total autonomia'),
    comp('lleng-comp-3','Expressio Oral','EO','plum','Parla i interacció (debats, exposicions)','Discurs incomprensible o molt limitat','S\'expressa de forma senzilla i entenedora','Parla amb fluïdesa, ordre i bon lèxic','Discurs ric, estructurat i interactua molt bé'),
    comp('lleng-comp-4','Expressio Escrita','EE','moss','Redacció de textos i ortografia','Idees desordenades i molts errors','Text senzill i coherent amb errors bàsics','Text ben estructurat, connectors i ortografia bona','Text molt creatiu, ric i ortografia impecable'),
    comp('lleng-comp-5','Plurilinguisme','PL','honey','Relació entre llengües i diversitat','No connecta llengües ni mostra interès','Detecta paraules similars entre llengües','Transfereix estratègies i valora la diversitat','Fa de mediador i compara llengües de forma innata')
  ],
  matematiques: [
    comp('mates-comp-1','Resolucio de problemes','RP','sky','Identificar dades i aplicar operacions','No sap identificar dades ni l\'operació','Identifica dades i l\'operació amb èxit','Resol provant diferents estratègies i comprova','Cerca diferents vies i formula nous problemes'),
    comp('mates-comp-2','Raonament i connexions','RC','clay','Buscar patrons i connectar conceptes','No veu relacions ni justifica què fa','Descriu patrons i relacions evidents','Argumenta decisions i connecta amb altres àrees','Generalitza regles i fa raonaments complexos'),
    comp('mates-comp-3','Comunicacio','CM','plum','Expressar processos matemàtics','No sap explicar com ha fet el càlcul','S\'explica de forma bàsica i usa algun dibuix','Explica amb claredat el procés i el representa','Comunica idees abstractes amb rigor i precisió'),
    comp('mates-comp-4','Sentit matematic','SM','moss','Domini del càlcul, mesura i geometria','Moltes dificultats en operacions bàsiques','Domina el càlcul escrit i conceptes comuns','Àgil en càlcul mental, mesura i gràfics','Excel·lent flexibilitat numèrica i visualització')
  ],
  medi: [
    comp('medi-comp-1','Indagacio i ciencia','IC','sky','Preguntes, experiments i conclusions','No té iniciativa per observar ni indagar','Segueix l\'experiment de classe i en descriu el resultat','Planteja hipòtesis, experimenta i treu conclusions','Dissenya recerques amb gran rigor científic'),
    comp('medi-comp-2','Tecnologia i disseny','TD','clay','Crear prototips i ús d\'eines digitals','No sap utilitzar tecnologia ni crear objectes','Fa anar dispositius i participa en maquetes senzilles','Cerca a la xarxa i dissenya maquetes funcionals','Resol reptes tècnics o digitals de forma innovadora'),
    comp('medi-comp-3','Ciutadania i historia','CH','plum','Fets històrics i convivència democràtica','No ubica fets en el temps ni respecta normes','Ubica canvis en la història i conviu amb respecte','Ordena etapes històriques i s\'implica a l\'aula','Analitza el passat de forma crítica i és ciutadà actiu'),
    comp('medi-comp-4','Salut i sostenibilitat','SS','moss','Hàbits saludables i consum responsable','No té cura d\'ell mateix ni de l\'entorn','Aplica hàbits bàsics i directrius de reciclatge','Manté estils de vida sans i col·labora en el medi','Lidera i proposa campanyes de sostenibilitat')
  ],
  educacioFisica: [
    comp('ef-comp-1','Resolucio motriu','RM','sky','Habilitats de moviment i tàctiques de joc','Dificultats de coordinació o desorientació','Controla habilitats bàsiques en jocs pautats','Adapta el cos a canvis de ritme, espai i tàctica','Domina i anticipa qualsevol moviment o joc tàctic'),
    comp('ef-comp-2','Salut i seguretat','SS','clay','Benestar físic, escalfament i higiene','Mostra rebuig a l\'esforç i oblida la higiene','Participa en l\'escalfament i té cura de la higiene','Regula l\'esforç i entén els beneficis de l\'esport','Gestiona de forma autònoma la seva salut i seguretat'),
    comp('ef-comp-3','Expressio corporal','EC','plum','Comunicació gestual i ritme musical','Inhibit en gestos i no segueix el ritme','Expressa coses bàsiques i fa danses pautades','Comunica sentiments i es mou a tempo','Crea moviments i coreografies amb gran originalitat'),
    comp('ef-comp-4','Interaccio social','IS','moss','Joc net, respecte i cooperació en grup','Provoca disputes, no accepta regles ni ajuda','Respecta les regles i tolera el resultat del joc','Ajuda els companys i resol conflictes dialogant','Lidera el joc net (fair play) i fomenta la inclusió')
  ],
  educacioArtistica: [
    comp('art-comp-1','Recepcio i analisi','RA','sky','Observar i valorar elements de l\'art','Desinterès o incapaç de descriure una obra','Identifica colors o formes evidents en imatges','Analitza obres explicant l\'emoció que transmeten','Fa valoracions crítiques i documentades molt riques'),
    comp('art-comp-2','Creacio i expressio','CE','clay','Ús de tècniques i creativitat pròpia','Poc acurat amb materials o deixa feines a mitges','Aplica la tècnica pautada amb prou destresa','Experimenta amb materials i mostra estil propi','Combina tècniques amb gran originalitat i plasticitat'),
    comp('art-comp-3','Proces i col·laboracio','PC','plum','Planificació i treball cooperatiu','No planifica, no comparteix i no acaba el treball','Segueix els passos de l\'activitat i respecta l\'equip','Esbossa abans d\'actuar i col·labora activament','Executa projectes des de la idea fins a l\'exposició')
  ]
};

function areaForSubject(subj){
  var n=normTxt(subj);
  if(['catala','castella','angles','catalan','castellano','ingles'].indexOf(n)!==-1) return 'llengues';
  if(['matematiques','matematicas'].indexOf(n)!==-1) return 'matematiques';
  if(['medi','medinatural','medisocial'].indexOf(n)!==-1) return 'medi';
  if(['educaciofisica','edfisica','edfisi','edfisica','edfísica'].indexOf(n)!==-1) return 'educacioFisica';
  if(['educacioartistica','artsplastiques','music','musica','visualiplastica','arts'].indexOf(n)!==-1) return 'educacioArtistica';
  return 'llengues';
}

function getCompetenciesForSubject(subj){
  return competenciesByArea[areaForSubject(subj)] || competenciesByArea.llengues;
}

function getCurrentSubject(){
  var mc=mesCursos[estat.cursIdx];
  return mc&&mc.assigns&&mc.assigns.length?mc.assigns[estat.subjIdx]:'';
}

var competencies = getCompetenciesForSubject(getCurrentSubject());

// Rúbrica per competència i criteri
var rubrica = {};
var escales = [{rang:'1-4',label:'No Assolit',color:'clay'},{rang:'5-6',label:'Assol. suficient',color:'honey'},{rang:'7-8',label:'Assol. notable',color:'sky'},{rang:'9-10',label:'Assol. excellent',color:'moss'}];
Object.keys(competenciesByArea).forEach(function(area){
  competenciesByArea[area].forEach(function(comp){
    rubrica[comp.id] = comp.criteris.map(function(){
      return {'1-4':comp.rubrica['1-4'],'5-6':comp.rubrica['5-6'],'7-8':comp.rubrica['7-8'],'9-10':comp.rubrica['9-10']};
    });
  });
});

function syncCompetenciesForCurrentSubject(){
  competencies = getCompetenciesForSubject(getCurrentSubject());
  if(currentCompId && !competencies.some(function(c){ return c.id===currentCompId; })){
    currentCompId='';
  }
}

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
        var compsSubj = getCompetenciesForSubject(subj);
        var actDef = defActs[subj]||['Activitat 1','Activitat 2'];
        compsSubj.forEach(function(comp){
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
function escHtml(txt){
  return String(txt||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function colorCurs(cursNom){
  var idx=mesCursos.findIndex(function(c){return c.curs===cursNom;});
  return idx===-1?'var(--line2)':'var(--'+colorIdx(idx)+')';
}
function afegirAssignaturaGlobal(nom){
  if(!nom) return;
  var n=nom.trim();
  if(!n) return;
  var ja=assignaturesList.some(function(s){ return s.toLowerCase()===n.toLowerCase(); });
  if(!ja) assignaturesList.push(n);
}
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
  var comp=getCompetenciesForSubject(subj).find(function(c){return c.id===compId;});
  if(!comp) return null;
  var acts=getActsFor(mc.curs,trim,subj,compId); var t=0,c=0;
  acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[iniAlu]?act.notes[iniAlu][crit]:null; if(n!=null){t+=n;c++;} }); });
  return c?Math.round(t/c*10)/10:null;
}

function lsGet(key){
  try{
    var raw=window.localStorage.getItem(key);
    return raw?JSON.parse(raw):null;
  }catch(err){ return null; }
}
function lsSet(key,val){
  try{ window.localStorage.setItem(key, JSON.stringify(val)); }catch(err){}
}
function guardarAuth(){ lsSet(AUTH_KEY, authState); }
function carregarAuth(){
  var saved=lsGet(AUTH_KEY);
  if(saved&&saved.isLogged&&saved.user&&saved.user.email){
    authState=saved;
  }
}
function guardarPerfil(){
  lsSet(PERFIL_KEY, { prof: prof, mesCursos: mesCursos, estat: estat, assignaturesList: assignaturesList });
}
function carregarPerfil(){
  var saved=lsGet(PERFIL_KEY);
  if(!saved) return false;
  if(saved.prof) prof=saved.prof;
  if(saved.mesCursos&&saved.mesCursos.length) mesCursos=saved.mesCursos;
  if(saved.assignaturesList&&saved.assignaturesList.length){
    assignaturesList=saved.assignaturesList.slice();
  }
  if(saved.estat){
    estat.cursIdx=parseInt(saved.estat.cursIdx||0);
    estat.trimIdx=parseInt(saved.estat.trimIdx||0);
    estat.subjIdx=parseInt(saved.estat.subjIdx||0);
  }
  if(estat.cursIdx<0) estat.cursIdx=0;
  if(estat.trimIdx<0||estat.trimIdx>2) estat.trimIdx=0;
  if(estat.subjIdx<0) estat.subjIdx=0;
  if(estat.cursIdx>=mesCursos.length) estat.cursIdx=0;
  if(mesCursos[estat.cursIdx]&&estat.subjIdx>=mesCursos[estat.cursIdx].assigns.length) estat.subjIdx=0;
  return true;
}
function tePerfilConfigurat(){
  if(!mesCursos||!mesCursos.length) return false;
  return mesCursos.every(function(mc){ return mc.assigns&&mc.assigns.length; });
}
function anarAPasPostAuth(){
  document.getElementById('gate').classList.remove('hide');
  if(carregarPerfil()&&tePerfilConfigurat()){
    renderGateCursos();
    showGatePas('g-sel-cursos');
    return;
  }
  if(authState.user&&authState.user.nom){
    prof.nom=authState.user.nom;
    var inpNom=document.getElementById('reg-nom');
    if(inpNom) inpNom.value=authState.user.nom;
  }
  showGatePas('g-dades');
}
function validarEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function hashPassword(pass){
  if(!(window.crypto&&window.crypto.subtle)) return Promise.resolve(pass);
  var data=new TextEncoder().encode(pass);
  return window.crypto.subtle.digest('SHA-256',data).then(function(buf){
    return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  });
}
function registrarCompte(){
  var nom=(document.getElementById('reg-user-nom').value||'').trim();
  var email=(document.getElementById('reg-user-email').value||'').trim().toLowerCase();
  var pass=(document.getElementById('reg-user-pass').value||'').trim();
  if(!nom){toast('Escriu el nom i cognoms');return;}
  if(!validarEmail(email)){toast('Correu electrònic no vàlid');return;}
  if(pass.length<6){toast('La contrasenya ha de tenir mínim 6 caràcters');return;}
  hashPassword(pass).then(function(passHash){
    authState={isLogged:true,user:{nom:nom,email:email,pass:passHash}};
    guardarAuth();
    prof.nom=nom;
    toast('Compte creat ✓');
    anarAPasPostAuth();
  });
}
function iniciarSessio(){
  var email=(document.getElementById('login-email').value||'').trim().toLowerCase();
  var pass=(document.getElementById('login-pass').value||'').trim();
  var saved=lsGet(AUTH_KEY);
  if(!saved||!saved.user){toast('No hi ha cap compte. Registra\'t primer');return;}
  hashPassword(pass).then(function(passHash){
    if(saved.user.email!==email||saved.user.pass!==passHash){toast('Correu o contrasenya incorrectes');return;}
    authState=saved;
    authState.isLogged=true;
    guardarAuth();
    toast('Sessió iniciada ✓');
    anarAPasPostAuth();
  });
}
function entrarModeDev(){
  authState={
    isLogged:true,
    user:{nom:'Desenvolupador Arrel',email:'dev@arrel.local',pass:'devmode',dev:true}
  };
  guardarAuth();
  if(!lsGet(PERFIL_KEY)){
    prof.nom=authState.user.nom;
    guardarPerfil();
  }
  toast('Mode desenvolupador actiu ✓');
  anarAPasPostAuth();
}
function obrirEditarPerfil(){
  var overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.id='pop-edit-perfil';
  overlay.innerHTML='<div class="popup" style="width:420px;">'
    +'<div class="popup-head">Editar perfil</div>'
    +'<div class="fg"><label class="flbl">Nom complet</label><input class="input" id="ep-nom" value="'+escHtml(prof.nom)+'"></div>'
    +'<div class="g2" style="gap:8px;">'
      +'<div class="fg"><label class="flbl">Centre</label><input class="input" id="ep-centre" value="'+escHtml(prof.centre)+'"></div>'
      +'<div class="fg"><label class="flbl">Any escolar</label><input class="input" id="ep-any" value="'+escHtml(prof.any)+'"></div>'
    +'</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="guardarEdicioPerfil()">Guardar</button>'
      +'<button class="btn btn-ghost" onclick="tancarEditPerfil()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('ep-nom');if(inp)inp.focus();},60);
}
function tancarEditPerfil(){
  var e=document.getElementById('pop-edit-perfil');
  if(e) e.remove();
}
function guardarEdicioPerfil(){
  var nom=(document.getElementById('ep-nom').value||'').trim();
  if(!nom){toast('Escriu el nom');return;}
  prof.nom=nom;
  prof.centre=(document.getElementById('ep-centre').value||'').trim();
  prof.any=(document.getElementById('ep-any').value||'').trim();
  guardarPerfil();
  tancarEditPerfil();
  renderGateCursos();
  updateNav();
  toast('Perfil actualitzat ✓');
}
function tancarSessio(){
  // Manté el compte guardat (email+contrasenya) perquè es pugui tornar a iniciar sessió;
  // només es tanca la sessió activa.
  authState={isLogged:false,user:authState.user};
  guardarAuth();
  document.getElementById('gate').classList.remove('hide');
  showGatePas('g-login');
  toast('Sessió tancada');
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
    return '<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:var(--clay);margin-bottom:7px;">'+escHtml(mc.curs)+'</div>'
      +'<div class="subj-chips" data-cidx="'+i+'">'
      +assignaturesList.map(function(s){ return '<button class="subj-chip" onclick="this.classList.toggle(\'sel\')">'+escHtml(s)+'</button>'; }).join('')
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
  guardarPerfil();
  document.getElementById('gate').classList.add('hide');
  seedDemo(); updateNav(); renderAll();
}
function abrirGateSeleccio(){
  if(!authState.isLogged){
    document.getElementById('gate').classList.remove('hide');
    showGatePas('g-login');
    return;
  }
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
    h+='<div style="width:44px;height:44px;border-radius:10px;background:'+icoBg+';color:'+icoCol+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;">'+escHtml(mc.curs.split(' ')[0])+'</div>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:15px;font-weight:700;">'+escHtml(mc.curs)+'</div>';
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
    h+='<span style="font-size:14px;font-weight:700;flex:1;">'+escHtml(s)+'</span>';
    h+='<span style="color:var(--ink3);font-size:20px;font-weight:300;">›</span>';
    h+='</div>';
  });
  h+='<div style="display:flex;justify-content:flex-end;margin-top:10px;">'
    +'<button class="btn btn-sm" onclick="obrirAfegirAssignatura('+ci+')">+ Afegir assignatura</button>'
  +'</div>';
  document.getElementById('g-sel-assigns-list').innerHTML=h;
  showGatePas('g-sel-assigns');
}

function obrirAfegirAssignatura(ci){
  var mc=mesCursos[ci];
  if(!mc) return;
  var opcions=assignaturesList.filter(function(s){
    return !mc.assigns.some(function(ex){ return ex.toLowerCase()===s.toLowerCase(); });
  });
  var overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.id='pop-afegir-assign';
  overlay.innerHTML='<div class="popup" style="width:420px;">'
    +'<div class="popup-head">Afegir assignatura a '+escHtml(mc.curs)+'</div>'
    +'<div class="fg"><label class="flbl">Assignatura</label>'
      +'<input class="input" id="aa-nom" list="aa-llista" placeholder="Ex: Historia, Tecnologia...">'
      +'<datalist id="aa-llista">'+opcions.map(function(s){return '<option value="'+escHtml(s)+'">';}).join('')+'</datalist>'
    +'</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="guardarNovaAssignatura('+ci+')">Afegir</button>'
      +'<button class="btn btn-ghost" onclick="tancarAfegirAssignatura()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('aa-nom');if(inp)inp.focus();},60);
}
function tancarAfegirAssignatura(){
  var e=document.getElementById('pop-afegir-assign');
  if(e) e.remove();
}
function guardarNovaAssignatura(ci){
  var mc=mesCursos[ci];
  if(!mc) return;
  var nom=(document.getElementById('aa-nom').value||'').trim();
  if(!nom){toast('Escriu l\'assignatura');return;}
  var existeix=mc.assigns.some(function(s){return s.toLowerCase()===nom.toLowerCase();});
  if(existeix){toast('Aquesta assignatura ja existeix');return;}
  mc.assigns.push(nom);
  afegirAssignaturaGlobal(nom);
  guardarPerfil();
  tancarAfegirAssignatura();
  selCurs(ci);
  updateNav();
  toast('Assignatura afegida ✓');
}


function selSubj(si){
  estat.subjIdx=si;
  guardarPerfil();
  document.getElementById('gate').classList.add('hide');
  syncCompetenciesForCurrentSubject();
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
  estat.trimIdx=ti; guardarPerfil(); updateNav(); renderAll();
  toast(trimestres[ti]);
}
function obrirNouCurs(){
  document.getElementById('nc-nom').value='';
  document.getElementById('nc-subj-chips').innerHTML=assignaturesList.map(function(s){
    return '<button class="subj-chip" onclick="this.classList.toggle(\'sel\')">'+escHtml(s)+'</button>';
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
  guardarPerfil();
  renderGateCursos();
}

// ═══════════════ NAV ═══════════════
function navGo(btn){
  syncCompetenciesForCurrentSubject();
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
function renderAll(){ syncCompetenciesForCurrentSubject(); renderHome(); renderAlumnes(); renderCompTiles(); renderCal(); renderConfig(); }
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

  // Mitjana per competència (usada tant per les barres com pel gràfic d'aranya)
  var compAvgs=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ alumnes.forEach(function(al){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); }); });
    return c?Math.round(t/c*10)/10:null;
  });

  // Barres
  document.getElementById('home-bars').innerHTML=competencies.map(function(comp,i){
    var avg=compAvgs[i]; var pct=avg?avg*10:0; var col=avg?getColor(avg):'ink3';
    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">'
      +'<span style="font-size:10px;font-weight:600;color:var(--ink2);width:80px;flex-shrink:0;line-height:1.3;">'+comp.nom+'</span>'
      +'<div style="flex:1;height:7px;background:var(--line);border-radius:4px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:var(--'+col+');border-radius:4px;"></div></div>'
      +'<span style="font-size:12px;font-weight:700;width:24px;">'+( avg||'—')+'</span>'
    +'</div>';
  }).join('');

  // Gràfic d'aranya classe
  var spiderVals=compAvgs.map(function(v){ return v||0; });
  var spiderLabels=competencies.map(function(c){
    var words=c.nom.split(' ');
    // Partir en 2 línies màxim de ~10 chars
    return words.length<=2?c.nom:(words[0]+' '+words[1]);
  });
  drawSpider('spider-home', spiderLabels, [spiderVals], ['var(--clay)'], 260, 220);
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
    +'<th style="text-align:center;padding:8px 6px;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;width:30px;">#</th>'
    +'<th style="text-align:left;padding:8px 12px;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;min-width:160px;">Alumne</th>'
    +compCols
    +mitjaCol
    +'<th style="text-align:left;padding:8px 10px;font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;">Comentari</th>'
    +'<th style="padding:8px 8px;"></th>'
    +'</tr></thead>';

  var tbody='<tbody>'+alumnesFiltrats.map(function(al){
    var missatge=missatgesAlumnes[al.nom]||'';
    var compAvgs=competencies.map(function(comp){
      var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
      acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); });
      return c?Math.round(t/c*10)/10:null;
    });
    var compCells=compAvgs.map(function(avg){
      return '<td style="text-align:center;padding:8px 8px;">'+renderNota(avg,true)+'</td>';
    }).join('');
    // Nota mitjana = mitjana de les notes per competència (les que es mostren a la fila)
    var valsG=compAvgs.filter(function(avg){ return avg!==null; });
    var avgG=valsG.length?Math.round(valsG.reduce(function(a,b){return a+b;},0)/valsG.length*10)/10:null;
    var mitjaCell='<td style="text-align:center;padding:8px 8px;background:var(--clay-l);font-weight:700;">'+renderNota(avgG,true)+'</td>';
    return '<tr style="cursor:pointer;" onclick="obrirAlumne(\''+al.ini+'\')">'
      +'<td style="text-align:center;padding:8px 6px;font-size:11px;color:var(--ink3);font-weight:700;">'+(alumnes.indexOf(al)+1)+'</td>'
      +'<td style="padding:8px 12px;">'
        +'<div style="display:flex;align-items:center;gap:8px;">'
          +ava(al,26,10)
          +'<span style="font-size:13px;font-weight:600;">'+escHtml(al.nom)+'</span>'
        +'</div>'
      +'</td>'
      +compCells
      +mitjaCell
      +'<td style="padding:8px 10px;max-width:180px;">'
        +'<span style="font-size:11.5px;color:var(--ink2);font-style:italic;">'+
          (missatge?escHtml(missatge):'<span style="color:var(--ink3);">—</span>')+
        '</span>'
      +'</td>'
      +'<td style="padding:8px 8px;">'
        +'<button class="btn btn-sm" data-nom="'+escHtml(al.nom)+'" onclick="event.stopPropagation();obrirMissatgeAluBtn(this)">'+
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
          +'<div style="font-size:17px;font-weight:700;">'+escHtml(al.nom)+'</div>'
          +'<div style="font-size:12px;color:var(--ink3);">'+escHtml(mc.curs)+' · '+trim+' · '+escHtml(subj)+'</div>'
        +'</div>'
        +'<button class="btn btn-sm" data-nom="'+escHtml(al.nom)+'" onclick="obrirMissatgeAluBtn(this)">'+(missatge?'Editar comentari':'+ Comentari')+'</button>'
      +'</div>'
      +(missatge?'<div style="font-size:13px;color:var(--ink2);background:var(--paper);border-radius:8px;padding:9px 12px;font-style:italic;margin-bottom:14px;">'+escHtml(missatge)+'</div>':'')
      +'<div class="g2">'
        +'<div>'
          +'<div class="sec" style="margin-bottom:4px;">Gràfic d\'aranya <span style="color:var(--clay);font-weight:700;">'+escHtml(al.nom.split(' ')[0])+'</span> vs classe</div>'
          +'<div class="spider-wrap"><canvas id="'+canvasId+'" width="240" height="200"></canvas></div>'
          +'<div style="display:flex;gap:14px;justify-content:center;margin-top:6px;">'
            +'<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);"><div style="width:12px;height:3px;background:var(--clay);border-radius:2px;"></div>'+escHtml(al.nom.split(' ')[0])+'</div>'
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

  html+='<div class="tbl-wrap" style="border:1px solid var(--line);border-radius:var(--rl);">'
    +'<table class="tbl" style="min-width:max-content;width:100%;"><thead><tr style="background:var(--paper);">'
    +'<th class="sticky" style="min-width:150px;background:var(--paper);">Alumne</th>'
    +acts.map(function(act){
      return '<th style="min-width:100px;text-align:center;vertical-align:top;padding:8px 6px;">'
        +'<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:3px;cursor:pointer;" data-cid="'+compId+'" data-aid="'+act.id+'" onclick="openGraellaBtn(this)">'
          +'<span style="font-size:10px;color:var(--clay);text-decoration:underline;line-height:1.4;">'+escHtml(act.nom)+'</span>'
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
        +'<td class="sticky" style="padding:8px 12px;"><div style="display:flex;align-items:center;gap:7px;">'+ava(al,26,10)+'<span style="font-weight:600;font-size:13.5px;">'+escHtml(al.nom)+'</span></div></td>'
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
  var iso=yy+'-'+mm+'-'+dd;
  var hh=('0'+today.getHours()).slice(-2); var min=today.getMinutes()<30?'00':'30';
  overlay.innerHTML='<div class="popup" style="width:360px;">'
    +'<div class="popup-head">Nova activitat</div>'
    +'<div class="fg"><label class="flbl">Nom</label><input class="input" id="nova-act-nom" placeholder="Ex: Dictat setmana 10..."></div>'
    +'<div class="g2" style="gap:8px;">'
      +'<div class="fg"><label class="flbl">Dia</label><input class="input" type="date" id="nova-act-dia" value="'+iso+'"></div>'
      +'<div class="fg"><label class="flbl">Hora</label><input class="input" type="time" id="nova-act-hora" step="1800" value="'+hh+':'+min+'"></div>'
    +'</div>'
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
  var nomInp=document.getElementById('nova-act-nom');
  var diaInp=document.getElementById('nova-act-dia');
  var horaInp=document.getElementById('nova-act-hora');
  var nom=nomInp?nomInp.value.trim():''; if(!nom){toast('Escriu el nom');return;}
  var dia=diaInp?diaInp.value.trim():'';
  var hora=horaInp?horaInp.value.trim():'';
  if(!dia){toast('Selecciona el dia');return;}
  if(hora && !/^([01]\d|2[0-3]):(00|30)$/.test(hora)){toast('L\'hora ha de ser en franges de :00 o :30');return;}
  var data=dia.split('-').reverse().join('/')+(hora?' · '+hora:'');
  var ov=document.getElementById('pop-nova-act'); if(ov) ov.remove();
  var id='a'+Date.now();
  var act={id:id,nom:nom,data:data,notes:{},altres:{},notaAltres:{},missatges:{}};
  alumnes.forEach(function(al){act.notes[al.ini]={};act.altres[al.ini]='';act.notaAltres[al.ini]=null;});
  var k=getKey(_novaActCompId); if(!activitats[k]) activitats[k]=[];
  activitats[k].push(act);
  var mc2=mesCursos[estat.cursIdx];
  calEvents.push({
    id:'ev_'+id,
    titol:nom+(mc2?' ('+mc2.assigns[estat.subjIdx]+')':''),
    data:dia,
    dataFi:dia,
    hora:hora,
    tipus:'activitat',
    source:'auto',
    curs:mc2?mc2.curs:'',
    assignatura:mc2?mc2.assigns[estat.subjIdx]:''
  });
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
  overlay.innerHTML='<div class="popup" style="width:460px;max-height:86vh;overflow:auto;">'
    +'<div class="popup-title">'+escHtml(act.nom)+'</div>'
    +'<div class="popup-head">Comentari — '+escHtml(al.nom)+'</div>'
    +'<textarea class="input" id="comentari-act-text" rows="9" style="min-height:190px;line-height:1.55;" placeholder="Observacions, comportament, aspectes de millora...">'+escHtml(actual)+'</textarea>'
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
  var reactFrame=document.getElementById('programacio-react-frame');
  if(reactFrame){
    if(!reactFrame.getAttribute('src')) reactFrame.setAttribute('src','/programacio');
    return;
  }
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
      var lbl=(ev.hora?ev.hora+' · ':'')+ev.titol;
      var mode=ev.source==='auto'?'auto':'manual';
      var bord=colorCurs(ev.curs);
      return '<div class="cal-event '+mode+'" style="background:var(--'+col+'-l);color:var(--'+col+');border-left:3px solid '+bord+';" title="'+escHtml(lbl)+'">'+escHtml(lbl)+'</div>';
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
      var dataTxt=(ev.dataFi&&ev.dataFi!==ev.data?ev.data.split('-').reverse().slice(0,2).join('/')+' → '+ev.dataFi.split('-').reverse().slice(0,2).join('/'):ev.data.split('-').reverse().join('/'));
      if(ev.hora) dataTxt+=' · '+ev.hora;
      var origen=ev.source==='auto'?'Activitat':'Manual';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);">'
        +'<span class="pill p-'+col+'" style="font-size:10px;">'+ev.tipus+'</span>'
        +'<span style="flex:1;font-size:13px;font-weight:500;line-height:1.35;">'
          +(ev.curs?'<span class="cal-course-dot" style="background:'+colorCurs(ev.curs)+';"></span>':'')
          +escHtml(ev.titol)
          +(ev.curs?'<span style="display:block;font-size:10px;color:var(--ink3);">'+escHtml(ev.curs)+(ev.assignatura?' · '+escHtml(ev.assignatura):'')+' · '+origen+'</span>':'')
        +'</span>'
        +'<span style="font-size:11px;color:var(--ink3);">'+dataTxt+'</span>'
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
  var mc=mesCursos[estat.cursIdx];
  calEvents.push({
    id:'e'+Date.now(),
    titol:titol,
    data:dataInici,
    dataFi:dataFi||dataInici,
    tipus:document.getElementById('ev-tipus').value,
    source:'manual',
    curs:mc?mc.curs:'',
    assignatura:mc&&mc.assigns?mc.assigns[estat.subjIdx]:''
  });
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
      +'<span style="font-size:11px;color:var(--ink3);font-weight:700;width:18px;flex-shrink:0;text-align:right;">'+(i+1)+'</span>'
      +ava(al,26,10)
      +(al.id?'<span style="font-size:10px;font-weight:700;color:var(--clay);background:var(--clay-l);padding:2px 6px;border-radius:4px;flex-shrink:0;">'+al.id+'</span>':'')
      +'<span style="flex:1;font-size:13px;font-weight:500;">'+escHtml(al.nom)+'</span>'
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
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">Eliminaras: <b>'+escHtml(al.nom)+'</b></div>'
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
    +'<input class="input" id="json-nom-inp" value="'+escHtml(mc.curs)+'"></div>'
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
// Construeix l'objecte de dades exportables (mateixa forma que fa servir exportarJSONConfirmar)
// per a un curs/assignatura/trimestre concrets. Es reutilitza per generar automaticament
// les propies assignatures del tutor a "Generar informe" sense haver de exportar-les a ma.
function construirDadesInforme(mc, subj, trim, nomInforme){
  var comps=getCompetenciesForSubject(subj);
  return {versio:'1.0',exportat:new Date().toISOString(),nomInforme:nomInforme||mc.curs,professor:prof.nom,centre:prof.centre,any:prof.any,curs:mc.curs,trimestre:trim,assignatura:subj,
    alumnes:alumnes.map(function(al){
      var notesPerComp={};
      comps.forEach(function(comp){
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
}
function exportarJSONConfirmar(){
  var mc=mesCursos[estat.cursIdx]; if(!mc) return;
  var subj=mc.assigns[estat.subjIdx]; var trim=trimestres[estat.trimIdx];
  var nomInforme=(document.getElementById('json-nom-inp')||{}).value||mc.curs;
  var ov=document.getElementById('pop-json-nom'); if(ov) ov.remove();
  var dades=construirDadesInforme(mc, subj, trim, nomInforme);
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
  cont+='<h1>Arrel — '+escHtml(subj)+'</h1>';
  cont+='<p>'+escHtml(mc.curs)+' · '+trim+' · '+escHtml(prof.centre)+' · '+escHtml(prof.any)+' · '+escHtml(prof.nom)+'</p>';
  cont+='<table><thead><tr><th>Alumne</th>';
  competencies.forEach(function(comp){ cont+='<th>'+comp.nom+'</th>'; });
  cont+='<th>Comentari</th></tr></thead><tbody>';
  alumnes.forEach(function(al){
    cont+='<tr><td><b>'+escHtml(al.nom)+'</b></td>';
    competencies.forEach(function(comp){
      var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
      acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[al.ini]?act.notes[al.ini][crit]:null; if(n!=null){t+=n;c++;} }); });
      var avg=c?Math.round(t/c*10)/10:null;
      var cls=avg>=7?'v':avg>=5?'m':'d';
      cont+='<td style="text-align:center;" class="'+(avg?cls:'')+'">'+(avg||'—')+'</td>';
    });
    cont+='<td style="font-size:10px;color:#666;">'+escHtml(missatgesAlumnes[al.nom]||'')+'</td></tr>';
  });
  cont+='</tbody></table>';
  cont+='<p style="margin-top:20px;color:#aaa;font-size:10px;">Generat amb Arrel · '+new Date().toLocaleDateString('ca-ES')+'</p>';
  cont+='</body></html>';
  var blob=new Blob([cont],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a'); a.href=url; a.target='_blank'; a.click();
  setTimeout(function(){URL.revokeObjectURL(url);},5000);
  toast('PDF obert en nova pestanya — usa Ctrl+P per imprimir');
}

// Informe JSON
var infJSONs=[];
function obrirGenerarInforme(){
  var sel=document.getElementById('inf-curs-sel');
  sel.innerHTML='<option value="">— Selecciona un curs —</option>'
    +mesCursos.map(function(mc,i){ return '<option value="'+i+'">'+escHtml(mc.curs)+'</option>'; }).join('');
  sel.value='';
  // Neteja qualsevol assignatura propia afegida en una obertura anterior
  infJSONs=infJSONs.filter(function(j){ return !j.propi; });
  var titolInp=document.getElementById('inf-titol'); if(titolInp) titolInp.value='';
  document.getElementById('inf-curs-body').style.display='none';
  infRenderFitxers();
  showGatePas('g-informe');
}
function infSeleccionarCurs(){
  var sel=document.getElementById('inf-curs-sel');
  var body=document.getElementById('inf-curs-body');
  infJSONs=infJSONs.filter(function(j){ return !j.propi; });
  var idx=sel.value;
  if(idx===''){
    body.style.display='none';
    infRenderFitxers();
    return;
  }
  var mc=mesCursos[parseInt(idx,10)];
  if(!mc){ body.style.display='none'; return; }
  mc.assigns.forEach(function(subj){
    trimestres.forEach(function(trim){
      var dades=construirDadesInforme(mc,subj,trim,mc.curs);
      var key=mc.curs+'_'+trim+'_'+subj;
      infJSONs=infJSONs.filter(function(j){ return j.key!==key; });
      infJSONs.push({key:key,nom:'Les meves dades ('+subj+')',dades:dades,propi:true});
    });
  });
  document.getElementById('inf-propi-info').innerHTML='✓ Ja s\'han afegit les teves assignatures de <b>'+escHtml(mc.curs)+'</b>: '+escHtml(mc.assigns.join(', '))+'.';
  var titolInp=document.getElementById('inf-titol'); if(titolInp&&!titolInp.value) titolInp.value='Informe '+mc.curs;
  var dzTitol=document.getElementById('inf-dropzone-titol'); if(dzTitol) dzTitol.textContent='Puja aquí els JSON de la resta de professors de '+mc.curs;
  body.style.display='block';
  infRenderFitxers();
}
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
      +'<div style="flex:1;"><div style="font-size:12.5px;font-weight:600;">'+escHtml(d.assignatura||'?')
        +(j.propi?' <span class="pill p-moss" style="font-size:9px;margin-left:4px;">Propi</span>':'')+'</div>'
        +'<div style="font-size:11px;color:var(--ink3);">'+escHtml(d.curs||'')+(d.trimestre?' · '+escHtml(d.trimestre):'')+' · '+escHtml(d.professor||'')+'</div></div>'
      +'<button class="btn btn-sm btn-danger" onclick="infJSONs.splice('+i+',1);infRenderFitxers()">✕</button>'
    +'</div>';
  }).join('');
  if(btn) btn.disabled=false;
}
function generarInforme(){
  var trimFilt=document.getElementById('inf-trim-sel').value;
  var jsonsFilt=trimFilt?infJSONs.filter(function(j){return j.dades.trimestre===trimFilt;}):infJSONs;
  if(!jsonsFilt.length){toast('Cap fitxer');return;}

  // Tots els fitxers han de ser del mateix curs: l'emparellament d'alumnes es fa
  // per ordre d'entrada (posicio 1,2,3...) dins la llista, no per nom ni codi,
  // aixi que nomes te sentit si tots venen de la mateixa llista de classe.
  var cursos=[]; jsonsFilt.forEach(function(j){ var c=j.dades.curs||''; if(cursos.indexOf(c)===-1) cursos.push(c); });
  if(cursos.length>1){ toast('Els fitxers son de cursos diferents ('+cursos.join(', ')+'). Han de ser tots del mateix curs.'); return; }

  var titolInforme=(document.getElementById('inf-titol')||{}).value.trim()||'Informe de notes consolidades';

  var alumnesMap={};
  jsonsFilt.forEach(function(j){
    var d=j.dades;
    (d.alumnes||[]).forEach(function(al,idx){
      var uid=idx; // ordre d'entrada dins la llista de classe, no nom ni codi
      if(!alumnesMap[uid]) alumnesMap[uid]={ordre:idx+1,nom:al.nom,assigns:{}};
      alumnesMap[uid].assigns[d.assignatura]={nota:al.global,trim:d.trimestre};
    });
  });
  var totsSubjs=[]; jsonsFilt.forEach(function(j){if(totsSubjs.indexOf(j.dades.assignatura)===-1)totsSubjs.push(j.dades.assignatura);});
  var ordres=Object.keys(alumnesMap).map(Number).sort(function(a,b){return a-b;});
  var cont='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+escHtml(titolInforme)+'</title><style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px;}table{width:100%;border-collapse:collapse;margin-bottom:20px;}th,td{border:1px solid #ddd;padding:6px 8px;text-align:center;}th{background:#f0ece4;font-size:10px;text-transform:uppercase;font-weight:700;}td:first-child{text-align:center;color:#999;}td:nth-child(2){text-align:left;font-weight:bold;}.v{color:#566B47;font-weight:700;}.m{color:#B98627;font-weight:700;}.d{color:#B5562F;font-weight:700;}h1{font-size:18px;margin-bottom:4px;}p{color:#888;font-size:11px;margin-bottom:14px;}</style></head><body>';
  cont+='<h1>'+escHtml(titolInforme)+'</h1>';
  cont+='<p>'+(cursos[0]?escHtml(cursos[0])+' · ':'')+(trimFilt||'Mitjana anual')+' · Generat: '+new Date().toLocaleDateString('ca-ES')+'</p>';
  cont+='<table><thead><tr><th>#</th><th>Alumne</th>'+totsSubjs.map(function(s){return '<th>'+escHtml(s)+'</th>';}).join('')+'<th>Global</th></tr></thead><tbody>';
  ordres.forEach(function(uid){
    var al=alumnesMap[uid]; cont+='<tr><td>'+al.ordre+'</td><td>'+escHtml(al.nom)+'</td>';
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
        +'<span style="font-size:10px;color:var(--clay);text-decoration:underline;line-height:1.5;">'+escHtml(crit)+'</span></th>';
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
      +'<td class="sticky" style="padding:7px 12px;"><div style="display:flex;align-items:center;gap:7px;">'+ava(al,26,10)+'<span style="font-weight:600;font-size:13.5px;">'+escHtml(al.nom)+'</span></div></td>'
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
        +'<button class="btn btn-sm" style="font-size:11px;max-width:220px;" title="'+escHtml(altres)+'" '
          +'data-ini="'+al.ini+'" data-act="'+actId+'" data-comp="'+compId+'" onclick="obrirComentariActBtn(this)">'
          +(altres?'<span class="act-comment-preview">'+escHtml(altres.substring(0,120))+(altres.length>120?'...':'')+'</span>':'+ Nota')
        +'</button>'
      +'</td>'
    +'</tr>';
  }).join('')+'</tbody>';

  document.getElementById('cv-table').innerHTML=thead+tbody;
}

// ═══════════════ INIT ═══════════════
initGate();
carregarAuth();
carregarPerfil();
syncCompetenciesForCurrentSubject();
updateNav(); renderAll();
if(authState.isLogged){
  anarAPasPostAuth();
}else{
  document.getElementById('gate').classList.remove('hide');
  showGatePas('g-login');
}
setTimeout(function(){ renderEntradaRapida(); }, 10);
