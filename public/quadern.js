// ═══════════════ DADES ═══════════════
var prof = {nom:'Anna Garcia', centre:'Escola Montserrat', any:'2025-2026'};
var cursosList = ['1r A','1r B','2n A','2n B','3r A','3r B','4t A','4t B','5e A','5e B','6e A','6e B'];
var assignaturesList = ['Català','Castellà','Anglès','Matemàtiques','Medi','Música','Ed. Física','Arts','Valors','Competències transversals'];
var trimestres = ['1r Trimestre','2n Trimestre','3r Trimestre'];

var mesCursos = [
  {curs:'3r A', assigns:['Català','Castellà','Anglès']},
  {curs:'4t B', assigns:['Català','Matemàtiques']}
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

var PERFIL_KEY = 'arrel_perfil_v1';
var authState = { isLogged: false, user: null };

// Peticions de guardat (notes, comentaris...) que encara no han confirmat contra
// Supabase. Cal esperar-les abans de tornar a carregar dades del context (canvi
// d'assignatura/curs) o abans de deixar tancar la pestanya, sino una recarrega pot
// arribar abans que el guardat i "esborrar" (revertir) el que s'acaba d'escriure.
var pendingSaves = [];
function trackSave(promise){
  pendingSaves.push(promise);
  var neteja=function(){ var idx=pendingSaves.indexOf(promise); if(idx!==-1) pendingSaves.splice(idx,1); };
  promise.then(neteja,neteja);
  return promise;
}
window.addEventListener('beforeunload', function(e){
  if(pendingSaves.length){ e.preventDefault(); e.returnValue=''; }
});

function normTxt(s){
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
}
// Un criteri d'avaluacio te el seu propi text i la seva propia rubrica de 4 nivells
// (a diferencia d'una rubrica unica compartida per tots els criteris d'una competencia).
function crit(text,na,as,an,ae){
  return {text:text,na:na,as:as,an:an,ae:ae};
}
function comp(id, nom, ico, color, criteris){
  return {
    id:id,
    nom:nom,
    ico:ico,
    color:color,
    criteris:criteris.map(function(c){return c.text;}),
    rubriques:criteris.map(function(c){return {'1-4':c.na,'5-6':c.as,'7-8':c.an,'9-10':c.ae};})
  };
}

// Competencies, criteris d'avaluacio i rubriques per defecte — Decret 175/2022
// (Currículum de Catalunya, Primària). Font: app/docs/Competencies.md
var competenciesByArea = {
  llengues: [
    comp('lleng-ce1','Diversitat lingüística','DL','sky',[
      crit('Reconèixer i respectar la diversitat lingüística.','Mostra rebuig o indiferència cap a altres llengües i cultures.','Reconeix les llengües de l\'aula i les respecta si se li recorda.','Mostra interès actiu i respecte cap a les diferents llengües.','Promou i valora activament la diversitat com una riquesa col·lectiva.'),
      crit('Identificar prejudicis lingüístics i cohesió.','Reprodueix prejudicis lingüístics sense qüestionar-los.','Identifica alguns prejudicis quan l\'adult el guia.','Detecta prejudicis de forma autònoma i hi argumenta en contra.','Analitza de forma crítica els usos i proposa alternatives inclusives.')
    ]),
    comp('lleng-ce2','Comprensió oral','CO','clay',[
      crit('Comprendre idees principals de textos orals.','No capta la idea global del text oral ni amb suport.','Identifica la idea principal si rep preguntes o guiatge directament.','Extreu les idees principals i secundàries de forma autònoma.','Sintetitza el discurs amb precisió, captant detalls subtils i relacions.'),
      crit('Valorar la intenció del discurs oral.','Es queda en la literalitat i confon la intenció de l\'emissor.','Reconeix la intenció bàsica (informar, convèncer) amb pautes.','Detecta la intenció de l\'emissor i en fa una valoració raonada.','Analitza de forma crítica la intenció, detectant biaixos o ironies.')
    ]),
    comp('lleng-ce3','Expressió oral','EO','plum',[
      crit('Produir textos orals coherents i estructurats.','Expressa idees de forma desordenada, incomprensible o molt pobre.','S\'expressa de forma entenedora, tot i que amb dubtes o repeticions.','Exposa idees amb ordre, fluïdesa i un vocabulari variat i adequat.','Construeix un discurs estructurat, ric, fluid i adaptat a l\'audiència.'),
      crit('Participar en converses i debats respectant normes.','Interromp sistemàticament, no escolta o es nega a participar.','Participa en la conversa i manté el torn si se li recorda.','Intervé activament, escolta els altres i manté un diàleg fluid.','Lidera el diàleg de forma empàtica, integrant les aportacions d\'altres.')
    ]),
    comp('lleng-ce4','Comprensió lectora','CL','moss',[
      crit('Extreure informació directa i implícita de textos.','No extreu la informació bàsica del text encara que tingui suport.','Troba la informació literal directa, però li costa fer deduccions.','Extreu informació explícita i implícita de manera autònoma.','Interpreta el sentit profund, establint relacions complexes i crítiques.'),
      crit('Aplicar estratègies de lectura per la comprensió.','Abandona la lectura en trobar un bloqueig o paraula desconeguda.','Utilitza el context o rellegeix si l\'adult el guia en el procés.','Aplica trucs i estratègies autònomament quan no entén alguna cosa.','Selecciona i combina estratègies segons la complexitat del text.')
    ]),
    comp('lleng-ce5','Expressió escrita','EE','honey',[
      crit('Escriure textos estructurats segons la tipologia.','Redacta textos incoherents que no mantenen l\'estructura.','Escriu textos entenedors que mantenen l\'estructura bàsica.','Redacta de forma coherent, organitzada i ajustada a la tipologia.','Organitza el text amb una estructura impecable, estil fluid i creatiu.'),
      crit('Aplicar el procés d\'escriptura (planificar, revisar).','Escriu directament sense planificar i no revisa mai el text.','Planifica amb ajuts visuals i corregeix errors ortogràfics evidents.','Planifica el text i en revisa l\'ortografia i gramàtica autònomament.','Mostra un procés d\'auto-revisió rigorós, polint el text per millorar-lo.')
    ]),
    comp('lleng-ce6','Cerca d\'informació','CI','sky',[
      crit('Cercar informació en fonts analògiques i digitals.','Es perd en la cerca i no troba informació rellevant o útil.','Localitza informació si se li donen fonts i pautes molt concretes.','Cerca i selecciona informació rellevant en fonts fiables autònomament.','Contrasta diferents fonts, n\'avalua la fiabilitat i selecciona el millor contingut.'),
      crit('Processar i sintetitzar la informació (no plagiar).','Copia i enganxa literalment fragments del text sense processar.','Reescriu la informació canviant només algunes paraules soltes.','Redacta la informació amb les seves pròpies paraules organitzant idees.','Sintetitza i personalitza la informació elaborant un discurs propi.')
    ]),
    comp('lleng-ce7','Educació literària','EL','clay',[
      crit('Llegir de manera autònoma obres literàries.','Rebutja la lectura de forma sistemàtica.','Llegeix els llibres proposats a classe, però no en tria per iniciativa.','Mostra hàbit lector, triant obres segons els seus gustos i interessos.','Té un hàbit lector consolidat i comparteix recomanacions.'),
      crit('Reconèixer elements bàsics del relat.','No sap identificar els personatges ni el context de la història.','Identifica els personatges principals i el lloc si són evidents.','Reconeix clarament personatges, espai, temps i el gènere.','Analitza l\'evolució dels personatges, el narrador i recursos expressius.')
    ]),
    comp('lleng-ce8','Plurilingüisme','PL','plum',[
      crit('Transferir estratègies d\'una llengua a una altra.','Bloqueja l\'aprenentatge sense relacionar-ho amb el que coneix.','Reconeix semblances lingüístiques simples quan se li fan notar.','Transfereix estructures, vocabulari i estratègies entre llengües.','Utilitza el repertori multilingüe de manera estratègica per resoldre reptes.'),
      crit('Actitud oberta cap a diferents llengües.','Rebutja aprendre o escoltar llengües diferents a la pròpia.','Tolera diferents llengües a l\'aula sense mostrar iniciativa activa.','Manifesta interès i curiositat per aprendre paraules noves.','Es mostra entusiasta i actua com a pont lingüístic a l\'aula.')
    ]),
    comp('lleng-ce9','Reflexió lingüística','RL','moss',[
      crit('Formular hipòtesis i usar terminologia gramatical.','No reconeix les categories gramaticals ni la funció de paraules.','Identifica elements gramaticals bàsics amb suport de la pauta.','Utilitza els termes gramaticals bàsics per explicar la llengua.','Aplica la reflexió metalingüística de forma precisa per argumentar la tria.'),
      crit('Revisar i auto-corregir les produccions.','No detecta els seus propis errors ni quan se li assenyalen.','Corregeix errors quan el docent li indica exactament on són.','Revisa el text autònomament i detecta i corregeix errades.','Autocorregeix i millora la cohesió, la precisió i la sintaxi amb criteri.')
    ])
  ],
  matematiques: [
    comp('mates-ce1','Resolució de problemes','RP','sky',[
      crit('Comprendre enunciats i identificar dades.','Es bloqueja davant l\'enunciat i no sap quines dades calen.','Identifica les dades principals del problema amb lectura guiada.','Extreu i organitza les dades rellevants de l\'enunciat autònomament.','Interpreta enunciats complexos, extreu dades implícites i descarta no rellevants.'),
      crit('Aplicar estratègies i operacions.','Aplica operacions a l\'atzar sense cap lògica ni sentit.','Tria l\'operació correcta quan rep orientació en l\'estratègia.','Selecciona l\'estratègia adequada i resol operacions amb precisió.','Descobreix i utilitza diferents camins de resolució eficients.'),
      crit('Comprovar la validesa de la solució.','Dóna una xifra com a resposta sense comprovar si té sentit.','Verifica el resultat si el docent li demana explícitament.','Revisa si la solució té sentit respecte a la pregunta plantejada.','Comprova la validesa del resultat i argumenta la solidesa.')
    ]),
    comp('mates-ce2','Raonament','RA','clay',[
      crit('Identificar patrons i relacions lògiques.','No identifica relacions ni continuïtat en sèries.','Detecta la continuació d\'un patró senzill si se li donen pistes.','Reconeix i descriu patrons i relacions lògiques autònomament.','Generalitza patrons complexos i crea noves estructures lògiques.'),
      crit('Justificar resultats amb arguments lògics.','Realitza els procediments mecànicament sense explicar-los.','Explica els passos del seu càlcul si se li fan preguntes directes.','Argumenta i justifica de manera lògica la decisió en el càlcul.','Ofereix demostracions estructurades i avalua raonaments d\'altres.')
    ]),
    comp('mates-ce3','Connexions','CN','plum',[
      crit('Relacionar diferents conceptes matemàtics.','Veu les matemàtiques com a blocs aïllats sense connexió.','Reconeix connexions evidents entre blocs quan se li posen exemples.','Connecta idees de diferents blocs de forma espontània.','Aplica conceptes d\'un bloc per resoldre problemes d\'un altre.'),
      crit('Aplicar matemàtiques a la vida quotidiana.','No sap utilitzar les matemàtiques fora de la matèria.','Aplica la mesura o càlcul en altres àrees si se li indica pas a pas.','Utilitza les eines matemàtiques com a recurs natural en la vida diària.','Modela i resol situacions complexes de la vida real amb matemàtiques.')
    ]),
    comp('mates-ce4','Representació','RE','moss',[
      crit('Representar situacions (dibuixos, gràfics).','Incapaç de passar una dada numèrica a suport visual.','Dibuixa o fa un esquema senzill si se li demana explícitament.','Tradueix el problema a una taula, gràfic o model simbòlic.','Dissenya representacions visuals molt clares de dades complexes.'),
      crit('Canviar entre formats de representació.','Es bloqueja en demanar-li un format no habitual.','Passa d\'un format a un altre seguint un model molt fix.','Canvia de format de representació amb fluïdesa i autonomia.','Selecciona i combina el format de representació més eficient.')
    ]),
    comp('mates-ce5','Comunicació','CM','honey',[
      crit('Explicar processos amb vocabulari adequat.','Utilitza un llenguatge ambigu o no matemàtic.','Utilitza termes matemàtics bàsics barrejats amb informal.','Empra el vocabulari propi de l\'àrea amb precisió.','Comunica idees amb claredat, rigor i precisió tècnica.'),
      crit('Comprendre raonaments dels companys.','No segueix ni entén les explicacions dels companys.','Entén el procés d\'un company només si és molt lent i senzill.','Comprèn els raonaments exposats pels companys a l\'aula.','Identifica encerts, errors o camins alternatius en els companys.')
    ]),
    comp('mates-ce6','Socioafectiva','SA','sky',[
      crit('Mostrar perseverança i aprendre de l\'error.','S\'abandona davant la dificultat i es frustra amb l\'error.','Persisteix en la tasca si rep suport o ànims continus.','Afronta els reptes amb actitud positiva i accepta l\'error.','Mostra alta resiliència i reconstrueix la seva estratègia des de l\'error.'),
      crit('Treballar cooperativament en equip.','Imposa idees, no escolta o es nega a treballar en equip.','Participa en el grup, tot i que li costa coordinar-se amb els ritmes.','Treballa de manera cooperativa, respectant opinions i ritmes.','Fomenta un treball en equip inclusiu i potencia el grup.')
    ])
  ],
  medi: [
    comp('medi-ce1','Mètode científic','MC','sky',[
      crit('Formular preguntes i hipòtesis.','No fa preguntes ni és capaç de predir què passarà.','Formula preguntes molt guiades i hipòtesis de "sí/no".','Planteja preguntes investigables i hipòtesis lògiques.','Formula hipòtesis ben fonamentades amb pensament científic.'),
      crit('Realitzar experiments o investigacions.','No segueix les instruccions ni manipula el material bé.','Realitza l\'experiment seguint una pauta pas a pas dirigida.','Aplica els passos del mètode experimental amb ordre i seguretat.','Proposa o ajusta el disseny experimental introduint variables.'),
      crit('Recollir dades i extreure conclusions.','No anota dades o ho fa de forma caòtica sense conclusions.','Anota les dades en una taula donada i diu conclusions amb ajut.','Organitza les dades en suports adequats i redacta conclusions.','Analitza dades críticament i redacta conclusions científiques.')
    ]),
    comp('medi-ce2','Tecnologia','TE','clay',[
      crit('Dissenyar i construir prototips.','Incapaç de planificar o construir un objecte per a un repte.','Construeix un prototip bàsic si se li dóna un model a copiar.','Dissenya i construeix un prototip funcional que respon al repte.','Crea solucions tecnològiques innovadores i ben executades.'),
      crit('Avaluar el disseny i millorar-lo.','No avalua si el seu objecte funciona ni com millorar-lo.','Identifica si funciona, però li costa trobar la causa de l\'error.','Posa a prova el prototip, detecta fallades i proposa canvis.','Realitza proves sistemàtiques i redissenya optimitzant el resultat.')
    ]),
    comp('medi-ce3','Salut i benestar','SB','plum',[
      crit('Aplicar hàbits de vida saludable.','Manté hàbits poc saludables sense adonar-se dels riscos.','Reconeix hàbits saludables en la teoria, però li costa aplicar-los.','Aplica hàbits d\'higiene, alimentació, descans i activitat diària.','Argumenta els beneficis de la salut i en promou la pràctica.'),
      crit('Gestionar emocions pel benestar.','No identifica el que sent ni com afecta la seva salut.','Identifica emocions bàsiques i demana ajut quan no està bé.','Relaciona l\'estat emocional amb el benestar i s\'autoregula.','Gestiona emocions i accions promovent el benestar de tots.')
    ]),
    comp('medi-ce4','Ecosocial','EC','moss',[
      crit('Identificar relacions als ecosistemes.','No distingeix els éssers vius principals ni les relacions.','Identifica éssers vius i en reconeix la funció bàsica si se\'l guia.','Classifica els éssers vius i explica les relacions a l\'ecosistema.','Analitza l\'equilibri dels ecosistemes i la biodiversitat.'),
      crit('Consum responsable i estalvi de recursos.','Mostra conductes de malbaratament i no recicla.','Recicla i estalvia recursos només quan se li recorda.','Actua conscientment reciclant i reduint el consum de recursos.','Promou iniciatives sostenibles i raona la transició ecològica.'),
      crit('Accions locals per al medi ambient.','Es mostra indiferent davant els problemes mediambientals.','Reconeix problemes de contaminació si se li mostren imatges.','Proposa accions concretes i realistes per millorar el medi.','Dissenya i lidera accions de sensibilització ambiental a l\'escola.')
    ]),
    comp('medi-ce5','Història','HI','honey',[
      crit('Ordenar fets i etapes històriques.','Incapaç de situar-se en el temps o confon passat i present.','Ordena fets cronològics evidents de la seva vida o etapes.','Situa correctament esdeveniments en les grans etapes.','Relaciona causes i conseqüències entre diferents etapes.'),
      crit('Valorar el patrimoni històric i cultural.','Desconeix o menysprea el patrimoni i les tradicions.','Identifica els monuments o festes més populars de la localitat.','Valora i explica l\'origen i importància dels elements culturals.','Investiga sobre el patrimoni, en defensa la conservació i en difon el valor.'),
      crit('Analitzar causes i conseqüències històriques.','Veu els fets històrics com a esdeveniments aïllats.','Identifica una causa senzilla d\'un fet històric quan se li explica.','Explica causes i conseqüències dels fets treballats.','Analitza múltiples factors (socials, econòmics) de la història.')
    ]),
    comp('medi-ce6','Geografia','GE','sky',[
      crit('Utilitzar eines d\'orientació i mapes.','No s\'orienta en l\'espai ni interpreta un plànol bàsic.','Se situa en un plànol o mapa senzill amb la guia de l\'adult.','Utilitza mapes, plànols, llegendes i coordenades autònomament.','Interpreta mapes complexos, en creua informació i fa plànols.'),
      crit('Relació paisatge, clima i activitat humana.','No relaciona l\'entorn natural amb les formes de vida.','Explica relacions senzilles (ex: fa fred, ens cobrim).','Relaciona clima i relleu amb l\'activitat econòmica i paisatge.','Analitza com l\'acció humana transforma el paisatge i proposa millores.')
    ]),
    comp('medi-ce7','Ciutadania','CI','clay',[
      crit('Normes de convivència i diàleg.','Incompleix normes i respon amb agressivitat o bloqueig.','Respecta normes la major part del temps i accepta el diàleg.','Segueix les normes i utilitza el diàleg per resoldre desacords.','Actua com a mediador natural afavorint un clima democràtic.'),
      crit('Respectar Drets de la Infància i diversitat.','Ignora els drets dels altres i manté actituds d\'exclusió.','Reconeix els drets bàsics de la infància i tolera la diferència.','Respecta els Drets de la Infància i conviu amb empatia.','Defensa activament els drets de tothom i enriqueix el grup.')
    ])
  ],
  educacioFisica: [
    comp('ef-ce1','Motricitat','MO','sky',[
      crit('Controlar el cos (coordinació i equilibri).','Té dificultats de coordinació i perd l\'equilibri fàcilment.','Executa moviments de forma acceptable, tot i mostrar rigidesa.','Executa habilitats motrius (carreres, salts, girs) de forma fluida.','Demostra un domini corporal excel·lent amb moviments molt precisos.'),
      crit('Adaptar moviments a entorns canviants.','Es mostra molt insegur i es bloqueja quan canvia l\'espai.','S\'adapta a espais nous anant amb molta precaució i pautes.','Ajusta els seus moviments de forma ràpida a l\'entorn.','Respon amb gran habilitat i seguretat davant qualsevol obstacle.')
    ]),
    comp('ef-ce2','Hàbits saludables','HS','clay',[
      crit('Reconèixer els beneficis de l\'activitat.','No mostra interès per l\'exercici i busca estar inactiu.','Participa en les sessions reconeixent que és bo per la salut.','Valora l\'exercici i manté una actitud activa tota la sessió.','Promou l\'activitat física com un estil de vida essencial.'),
      crit('Aplicar escalfament, seguretat i higiene.','Oblida la roba d\'esport, no fa escalfament o actua amb risc.','Fa escalfament i segueix normes si el docent ho indica.','Realitza l\'escalfament de forma responsable i té cura de la higiene.','Gestiona l\'escalfament autònomament i preveu riscos.')
    ]),
    comp('ef-ce3','Interacció','IN','plum',[
      crit('Cooperar en jocs acceptant regles i resultat.','S\'enfada si perd, fa trampes o exclou companys.','Juga en equip respectant les regles, tot i costar-li la derrota.','Coopera activament, demostra esportivitat i accepta el resultat.','Destaca pel joc net, anima els companys i afavoreix la inclusió.'),
      crit('Aplicar estratègies i pautes tàctiques.','Es desplaça pel camp sense cap sentit tàctic.','Manté la seva posició bàsica si se li recorda constantment.','Aplica trucs i estratègies d\'equip per assolir l\'objectiu.','Modifica la tàctica individual i col·lectiva en temps real.')
    ]),
    comp('ef-ce4','Expressió corporal','EC','moss',[
      crit('Crear i executar seqüències de moviment.','Es nega a moure\'s al ritme de la música o a la dansa.','Repeteix una seqüència de passos dissenyada per l\'adult/grup.','Aporta passos i idees per muntar una coreografia en grup.','Dissenya coreografies riques, originals i amb molt de ritme.'),
      crit('Emprar el cos com a mitjà d\'expressió.','Mostra una rigidesa o vergonya que impedeix l\'expressió.','Utilitza el gest i el cos per fer mímica o dramatització guiada.','Comunica històries i emocions a través del cos amb claredat.','Transmet estats d\'ànim complexos amb gran riquesa gestual.')
    ])
  ],
  educacioArtistica: [
    comp('art-ce1','Recepció','RC','sky',[
      crit('Escoltar i observar manifestacions artístiques.','No manté l\'atenció ni el silenci durant les obres.','Escolta o observa les obres durant un temps breu si se\'l dirigeix.','Mostra atenció, concentració i interès actiu davant l\'art.','Analitza detalls tècnics, d\'estil i d\'expressió de forma madura.'),
      crit('Expressar sensacions amb vocabulari adequat.','No sap expressar què li transmet l\'obra o desqualifica.','Diu si una obra li agrada o no amb termes molt bàsics.','Expressa emocions i opinions sobre l\'obra emprant vocabulari adequat.','Elabora comentaris crítics argumentats respectant la diversitat.')
    ]),
    comp('art-ce2','Exploració','EX','clay',[
      crit('Experimentar amb eines i mitjans digitals.','Es nega a manipular materials o en fa un ús destructiu.','Utilitza eines i tècniques plàstiques seguint el model donat.','Experimenta amb diferents materials, tècniques i eines digitals.','Domina i combina tècniques plàstiques i digitals de forma innovadora.'),
      crit('Utilitzar la veu, el cos i els instruments.','Es mostra descompassat, no canta ni segueix la música.','Canta o toca mantenint el ritme quan va acompanyat pel grup.','Ajusta la veu, l\'afinació, el ritme i el moviment autònomament.','Demostra gran precisió rítmica, oïda i expressivitat.')
    ]),
    comp('art-ce3','Creació','CR','plum',[
      crit('Crear obres visuals o musicals originals.','Copia el treball dels companys sense aportar res propi.','Realitza produccions senzilles que compleixen el mínim de la tasca.','Elabora produccions originals aportant idees pròpies i creatives.','Destaca per la seva gran creativitat, estil propi i cura en detalls.'),
      crit('Participar en projectes artístics col·lectius.','Es desentén del grup, destorba o es nega a participar.','Participa en la creació col·lectiva fent el paper bàsic assignat.','S\'implica en el projecte comú, coopera en assajos i aporta idees.','Lidera la producció col·lectiva ajudant a coordinar el grup.'),
      crit('Presentar creacions artístiques.','Es nega a mostrar el seu treball als altres per vergonya.','Mostra la seva creació si se li demana i rep suport directe.','Presenta la seva producció explicant el procés amb claredat.','Exposa i comunica el significat de la seva obra amb seguretat i orgull.')
    ])
  ],
  valorsCivics: [
    comp('valors-ce1','Autoconeixement','AC','sky',[
      crit('Expressar opinions i emocions assertivament.','Reacciona amb crits o es tanca en banda quan opina.','Diu el que pensa o sent, tot i que de vegades ho fa de forma impulsiva.','Expressa opinions i emocions de forma calmada, clara i educada.','Demostra gran intel·ligència emocional en idees complexes.'),
      crit('Reflexionar sobre dilemes morals.','No veu cap dimensió ètica en els conflictes ("m\'és igual").','Distingeix el que està bé o malament si l\'adult li analitza el cas.','Reflexiona i aporta raons lògiques sobre el que és just.','Demostra pensament crític profund cercant el bé comú.')
    ]),
    comp('valors-ce2','Compromís ètic','CE','clay',[
      crit('Mostrar empatia i respecte a la igualtat.','Fa comentaris intolerants, masclistes o no es posa a l\'altre lloc.','Respecta els companys, tot i costar-li empatitzar amb el diferent.','Se situa al lloc dels altres i respecta tothom sense distinció.','Actua com a motor d\'inclusió defensant els qui ho necessiten.'),
      crit('Resoldre conflictes amb el diàleg.','Recorre a la força, l\'insult o la fugida per solucionar problemes.','S\'asseu a parlar del conflicte quan el docent l\'obliga.','Escolta la versió de l\'altre i busca un pacte negociat parlant.','Aplica tècniques de mediació espontània per calmar tensions.'),
      crit('Valorar normes democràtiques i drets.','Ignora les normes de convivència i els drets bàsics.','Comprèn la necessitat de les normes si se li expliquen.','Valora i respecta les normes col·lectives i els drets humans.','Promou el funcionament democràtic i proposa millores.')
    ])
  ],
  transversals: [
    comp('trans-ce1','Competència digital','CD','sky',[
      crit('Utilitzar dispositius i eines digitals de forma segura i responsable.','No sap fer servir els dispositius digitals bàsics ni amb ajuda.','Utilitza dispositius i eines digitals senzilles si rep ajuda constant.','Utilitza dispositius i eines digitals de forma autònoma i responsable.','Domina diverses eines digitals i n\'ajuda els companys a fer-ne un bon ús.'),
      crit('Cercar, contrastar i tractar informació digital de manera crítica.','Accepta com a certa qualsevol informació que troba a internet.','Cerca informació digital senzilla si rep pautes molt concretes.','Cerca, contrasta i selecciona informació digital fiable de forma autònoma.','Analitza críticament la informació digital i en detecta biaixos o falsedats.')
    ]),
    comp('trans-ce2','Competència personal, social i d\'aprendre a aprendre','PSA','clay',[
      crit('Regular les pròpies emocions i mantenir la motivació per aprendre.','Es bloqueja o abandona la tasca davant la primera dificultat.','Persisteix en la tasca si rep suport o ànims continus.','Regula les seves emocions i manté la motivació davant els reptes.','Mostra alta resiliència i ajuda els companys a gestionar les seves emocions.'),
      crit('Organitzar el propi procés d\'aprenentatge i treballar en equip.','No planifica la feina ni sap treballar de forma coordinada amb altres.','Organitza tasques senzilles i participa en el grup si se li guia.','Planifica el seu aprenentatge i col·labora activament en equip.','Gestiona el seu aprenentatge amb autonomia i lidera el treball en equip.')
    ]),
    comp('trans-ce3','Competència ciutadana','CC','plum',[
      crit('Participar de forma activa i respectuosa en la vida col·lectiva.','Ignora les normes de convivència i els drets dels altres.','Respecta les normes bàsiques de convivència la major part del temps.','Participa activament en la vida del grup respectant drets i normes.','Promou activament la convivència democràtica i defensa els drets de tothom.'),
      crit('Comprendre i valorar la diversitat social i cultural.','Mostra actituds d\'exclusió o rebuig cap a la diversitat.','Tolera la diversitat de l\'entorn sense mostrar-hi interès actiu.','Valora i respecta la diversitat social i cultural de l\'entorn.','Defensa activament la inclusió i enriqueix el grup amb la seva mirada oberta.')
    ]),
    comp('trans-ce4','Competència emprenedora','CE','moss',[
      crit('Generar idees i planificar-ne la posada en pràctica.','No proposa idees pròpies ni sap com dur-les a terme.','Aporta idees senzilles si rep un model o guia clara.','Genera idees pròpies i en planifica els passos per portar-les a terme.','Proposa idees originals i en lidera una planificació sòlida i realista.'),
      crit('Assumir riscos i aprendre dels errors en un projecte.','Abandona el projecte davant el primer entrebanc o error.','Continua el projecte amb suport quan sorgeix una dificultat.','Assumeix riscos raonables i aprèn dels errors per millorar el projecte.','Mostra iniciativa, persevera davant els errors i optimitza el projecte.')
    ])
  ],
  anglesLleng: [
    comp('angl-ce1','Linguistic diversity','LD','sky',[
      crit('Reconèixer i respectar la diversitat lingüística.','Mostra rebuig o indiferència cap a altres llengües i cultures.','Reconeix les llengües de l\'aula i les respecta si se li recorda.','Mostra interès actiu i respecte cap a les diferents llengües.','Promou i valora activament la diversitat com una riquesa col·lectiva.'),
      crit('Identificar prejudicis lingüístics i cohesió.','Reprodueix prejudicis lingüístics sense qüestionar-los.','Identifica alguns prejudicis quan l\'adult el guia.','Detecta prejudicis de forma autònoma i hi argumenta en contra.','Analitza de forma crítica els usos i proposa alternatives inclusives.')
    ]),
    comp('angl-ce2','Listening','LI','clay',[
      crit('Comprendre idees principals de textos orals.','No capta la idea global del text oral ni amb suport.','Identifica la idea principal si rep preguntes o guiatge directament.','Extreu les idees principals i secundàries de forma autònoma.','Sintetitza el discurs amb precisió, captant detalls subtils i relacions.'),
      crit('Valorar la intenció del discurs oral.','Es queda en la literalitat i confon la intenció de l\'emissor.','Reconeix la intenció bàsica (informar, convèncer) amb pautes.','Detecta la intenció de l\'emissor i en fa una valoració raonada.','Analitza de forma crítica la intenció, detectant biaixos o ironies.')
    ]),
    comp('angl-ce3','Speaking','SP','plum',[
      crit('Produir textos orals coherents i estructurats.','Expressa idees de forma desordenada, incomprensible o molt pobre.','S\'expressa de forma entenedora, tot i que amb dubtes o repeticions.','Exposa idees amb ordre, fluïdesa i un vocabulari variat i adequat.','Construeix un discurs estructurat, ric, fluid i adaptat a l\'audiència.'),
      crit('Participar en converses i debats respectant normes.','Interromp sistemàticament, no escolta o es nega a participar.','Participa en la conversa i manté el torn si se li recorda.','Intervé activament, escolta els altres i manté un diàleg fluid.','Lidera el diàleg de forma empàtica, integrant les aportacions d\'altres.')
    ]),
    comp('angl-ce4','Reading','RE','moss',[
      crit('Extreure informació directa i implícita de textos.','No extreu la informació bàsica del text encara que tingui suport.','Troba la informació literal directa, però li costa fer deduccions.','Extreu informació explícita i implícita de manera autònoma.','Interpreta el sentit profund, establint relacions complexes i crítiques.'),
      crit('Aplicar estratègies de lectura per la comprensió.','Abandona la lectura en trobar un bloqueig o paraula desconeguda.','Utilitza el context o rellegeix si l\'adult el guia en el procés.','Aplica trucs i estratègies autònomament quan no entén alguna cosa.','Selecciona i combina estratègies segons la complexitat del text.')
    ]),
    comp('angl-ce5','Writing','WR','honey',[
      crit('Escriure textos estructurats segons la tipologia.','Redacta textos incoherents que no mantenen l\'estructura.','Escriu textos entenedors que mantenen l\'estructura bàsica.','Redacta de forma coherent, organitzada i ajustada a la tipologia.','Organitza el text amb una estructura impecable, estil fluid i creatiu.'),
      crit('Aplicar el procés d\'escriptura (planificar, revisar).','Escriu directament sense planificar i no revisa mai el text.','Planifica amb ajuts visuals i corregeix errors ortogràfics evidents.','Planifica el text i en revisa l\'ortografia i gramàtica autònomament.','Mostra un procés d\'auto-revisió rigorós, polint el text per millorar-lo.')
    ]),
    comp('angl-ce6','Information search','IS','sky',[
      crit('Cercar informació en fonts analògiques i digitals.','Es perd en la cerca i no troba informació rellevant o útil.','Localitza informació si se li donen fonts i pautes molt concretes.','Cerca i selecciona informació rellevant en fonts fiables autònomament.','Contrasta diferents fonts, n\'avalua la fiabilitat i selecciona el millor contingut.'),
      crit('Processar i sintetitzar la informació (no plagiar).','Copia i enganxa literalment fragments del text sense processar.','Reescriu la informació canviant només algunes paraules soltes.','Redacta la informació amb les seves pròpies paraules organitzant idees.','Sintetitza i personalitza la informació elaborant un discurs propi.')
    ]),
    comp('angl-ce7','Literary education','LE','clay',[
      crit('Llegir de manera autònoma obres literàries.','Rebutja la lectura de forma sistemàtica.','Llegeix els llibres proposats a classe, però no en tria per iniciativa.','Mostra hàbit lector, triant obres segons els seus gustos i interessos.','Té un hàbit lector consolidat i comparteix recomanacions.'),
      crit('Reconèixer elements bàsics del relat.','No sap identificar els personatges ni el context de la història.','Identifica els personatges principals i el lloc si són evidents.','Reconeix clarament personatges, espai, temps i el gènere.','Analitza l\'evolució dels personatges, el narrador i recursos expressius.')
    ]),
    comp('angl-ce8','Plurilingualism','PL','plum',[
      crit('Transferir estratègies d\'una llengua a una altra.','Bloqueja l\'aprenentatge sense relacionar-ho amb el que coneix.','Reconeix semblances lingüístiques simples quan se li fan notar.','Transfereix estructures, vocabulari i estratègies entre llengües.','Utilitza el repertori multilingüe de manera estratègica per resoldre reptes.'),
      crit('Actitud oberta cap a diferents llengües.','Rebutja aprendre o escoltar llengües diferents a la pròpia.','Tolera diferents llengües a l\'aula sense mostrar iniciativa activa.','Manifesta interès i curiositat per aprendre paraules noves.','Es mostra entusiasta i actua com a pont lingüístic a l\'aula.')
    ]),
    comp('angl-ce9','Language reflection','LR','moss',[
      crit('Formular hipòtesis i usar terminologia gramatical.','No reconeix les categories gramaticals ni la funció de paraules.','Identifica elements gramaticals bàsics amb suport de la pauta.','Utilitza els termes gramaticals bàsics per explicar la llengua.','Aplica la reflexió metalingüística de forma precisa per argumentar la tria.'),
      crit('Revisar i auto-corregir les produccions.','No detecta els seus propis errors ni quan se li assenyalen.','Corregeix errors quan el docent li indica exactament on són.','Revisa el text autònomament i detecta i corregeix errades.','Autocorregeix i millora la cohesió, la precisió i la sintaxi amb criteri.')
    ])
  ],
  castellaLleng: [
    comp('cast-ce1','Diversidad lingüística','DL','sky',[
      crit('Reconocer y respetar la diversidad lingüística.','Muestra rechazo o indiferencia hacia otras lenguas y culturas.','Reconoce las lenguas del aula y las respeta si se le recuerda.','Muestra interés activo y respeto hacia las diferentes lenguas.','Promueve y valora activamente la diversidad como una riqueza colectiva.'),
      crit('Identificar prejuicios lingüísticos y cohesión.','Reproduce prejuicios lingüísticos sin cuestionarlos.','Identifica algunos prejuicios cuando el adulto lo guía.','Detecta prejuicios de forma autónoma y argumenta en contra.','Analiza de forma crítica los usos y propone alternativas inclusivas.')
    ]),
    comp('cast-ce2','Comprensión oral','CO','clay',[
      crit('Comprender ideas principales de textos orales.','No capta la idea global del texto oral ni con apoyo.','Identifica la idea principal si recibe preguntas o guía directa.','Extrae las ideas principales y secundarias de forma autónoma.','Sintetiza el discurso con precisión, captando detalles sutiles y relaciones.'),
      crit('Valorar la intención del discurso oral.','Se queda en la literalidad y confunde la intención del emisor.','Reconoce la intención básica (informar, convencer) con pautas.','Detecta la intención del emisor y hace una valoración razonada.','Analiza de forma crítica la intención, detectando sesgos o ironías.')
    ]),
    comp('cast-ce3','Expresión oral','EO','plum',[
      crit('Producir textos orales coherentes y estructurados.','Expresa ideas de forma desordenada, incomprensible o muy pobre.','Se expresa de forma comprensible, aunque con dudas o repeticiones.','Expone ideas con orden, fluidez y un vocabulario variado y adecuado.','Construye un discurso estructurado, rico, fluido y adaptado a la audiencia.'),
      crit('Participar en conversaciones y debates respetando las normas.','Interrumpe sistemáticamente, no escucha o se niega a participar.','Participa en la conversación y mantiene el turno si se le recuerda.','Interviene activamente, escucha a los demás y mantiene un diálogo fluido.','Lidera el diálogo de forma empática, integrando las aportaciones de otros.')
    ]),
    comp('cast-ce4','Comprensión lectora','CL','moss',[
      crit('Extraer información directa e implícita de textos.','No extrae la información básica del texto aunque tenga apoyo.','Encuentra la información literal directa, pero le cuesta hacer deducciones.','Extrae información explícita e implícita de manera autónoma.','Interpreta el sentido profundo, estableciendo relaciones complejas y críticas.'),
      crit('Aplicar estrategias de lectura para la comprensión.','Abandona la lectura al encontrar un bloqueo o una palabra desconocida.','Utiliza el contexto o relee si el adulto lo guía en el proceso.','Aplica trucos y estrategias de forma autónoma cuando no entiende algo.','Selecciona y combina estrategias según la complejidad del texto.')
    ]),
    comp('cast-ce5','Expresión escrita','EE','honey',[
      crit('Escribir textos estructurados según la tipología.','Redacta textos incoherentes que no mantienen la estructura.','Escribe textos comprensibles que mantienen la estructura básica.','Redacta de forma coherente, organizada y ajustada a la tipología.','Organiza el texto con una estructura impecable, estilo fluido y creativo.'),
      crit('Aplicar el proceso de escritura (planificar, revisar).','Escribe directamente sin planificar y nunca revisa el texto.','Planifica con ayudas visuales y corrige errores ortográficos evidentes.','Planifica el texto y revisa la ortografía y la gramática de forma autónoma.','Muestra un proceso de autorrevisión riguroso, puliendo el texto para mejorarlo.')
    ]),
    comp('cast-ce6','Búsqueda de información','BI','sky',[
      crit('Buscar información en fuentes analógicas y digitales.','Se pierde en la búsqueda y no encuentra información relevante o útil.','Localiza información si se le dan fuentes y pautas muy concretas.','Busca y selecciona información relevante en fuentes fiables de forma autónoma.','Contrasta diferentes fuentes, evalúa su fiabilidad y selecciona el mejor contenido.'),
      crit('Procesar y sintetizar la información (sin plagiar).','Copia y pega literalmente fragmentos del texto sin procesarlos.','Reescribe la información cambiando solo algunas palabras sueltas.','Redacta la información con sus propias palabras organizando ideas.','Sintetiza y personaliza la información elaborando un discurso propio.')
    ]),
    comp('cast-ce7','Educación literaria','EL','clay',[
      crit('Leer de manera autónoma obras literarias.','Rechaza la lectura de forma sistemática.','Lee los libros propuestos en clase, pero no elige por iniciativa propia.','Muestra hábito lector, eligiendo obras según sus gustos e intereses.','Tiene un hábito lector consolidado y comparte recomendaciones.'),
      crit('Reconocer elementos básicos del relato.','No sabe identificar los personajes ni el contexto de la historia.','Identifica los personajes principales y el lugar si son evidentes.','Reconoce claramente personajes, espacio, tiempo y género.','Analiza la evolución de los personajes, el narrador y los recursos expresivos.')
    ]),
    comp('cast-ce8','Plurilingüismo','PL','plum',[
      crit('Transferir estrategias de una lengua a otra.','Bloquea el aprendizaje sin relacionarlo con lo que conoce.','Reconoce semejanzas lingüísticas simples cuando se le hacen notar.','Transfiere estructuras, vocabulario y estrategias entre lenguas.','Utiliza el repertorio plurilingüe de manera estratégica para resolver retos.'),
      crit('Mostrar una actitud abierta hacia diferentes lenguas.','Rechaza aprender o escuchar lenguas diferentes a la propia.','Tolera diferentes lenguas en el aula sin mostrar iniciativa activa.','Manifiesta interés y curiosidad por aprender palabras nuevas.','Se muestra entusiasta y actúa como puente lingüístico en el aula.')
    ]),
    comp('cast-ce9','Reflexión lingüística','RL','moss',[
      crit('Formular hipótesis y usar terminología gramatical.','No reconoce las categorías gramaticales ni la función de las palabras.','Identifica elementos gramaticales básicos con apoyo de la pauta.','Utiliza los términos gramaticales básicos para explicar la lengua.','Aplica la reflexión metalingüística de forma precisa para argumentar la elección.'),
      crit('Revisar y autocorregir las producciones.','No detecta sus propios errores ni cuando se le señalan.','Corrige errores cuando el docente le indica exactamente dónde están.','Revisa el texto de forma autónoma y detecta y corrige errores.','Se autocorrige y mejora la cohesión, la precisión y la sintaxis con criterio.')
    ])
  ]
};

function areaForSubject(subj){
  var n=normTxt(subj);
  if(['catala','catalan'].indexOf(n)!==-1) return 'llengues';
  if(['angles','ingles','english'].indexOf(n)!==-1) return 'anglesLleng';
  if(['castella','castellano','espanyol','espanol'].indexOf(n)!==-1) return 'castellaLleng';
  if(['matematiques','matematicas'].indexOf(n)!==-1) return 'matematiques';
  if(['medi','medinatural','medisocial'].indexOf(n)!==-1) return 'medi';
  if(['educaciofisica','edfisica','edfisi','edfisica','edfísica'].indexOf(n)!==-1) return 'educacioFisica';
  if(['educacioartistica','artsplastiques','music','musica','visualiplastica','arts'].indexOf(n)!==-1) return 'educacioArtistica';
  if(['valors','valorscivics','educacioenvalors','valorsciviciseticscritics'].indexOf(n)!==-1) return 'valorsCivics';
  if(['competenciestransversals','comptransversals','transversals'].indexOf(n)!==-1) return 'transversals';
  return 'llengues';
}

function getCompetenciesForSubject(subj){
  return competenciesByArea[areaForSubject(subj)] || competenciesByArea.llengues;
}
// Tots els id de competencia vigents al curriculum actual — serveix per detectar
// activitats "orfes" que apunten a competencies d'una versio anterior del curriculum.
function totesLesCompetenciesIds(){
  var ids=[];
  Object.keys(competenciesByArea).forEach(function(area){
    competenciesByArea[area].forEach(function(c){ ids.push(c.id); });
  });
  return ids;
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
    rubrica[comp.id] = comp.rubriques;
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
var currentCompId = '';

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
    'Català':['Comprensió oral - Conte','Redacció - La família','Dictat setmana 8','Exposició oral'],
    'Castellà':['Texto narrativo','Dictado sem. 5','Expresion oral','Comprension lectora'],
    'Anglès':['Oral presentation','Writing exercise','Reading comp.'],
    'Matemàtiques':['Fraccions','Geometria','Càlcul mental','Estadística']
  };
  var dates = ['15/01/2026','12/02/2026','05/03/2026','02/04/2026','28/04/2026'];
  var missatgesDef = {'MR':"Excel·lent actitud.","SV":"Cal reforçar l'expressió oral.","LE":"Necessita més suport.","JP":"Molt participatiu.","AO":"Pla de reforç actiu.","MF":"Alumna destacada.","PL":"Millora progressiva.","NC":"Bona actitud.","JB":"En millora.","AT":"Molt bona alumna.","RT":"Pot millorar.","IC":"Excel·lent en tot."};
  // Nomes es posa el comentari de mostra a la primera assignatura de cada curs,
  // per deixar clar que es un comentari individual per assignatura i no compartit.
  mesCursos.forEach(function(mc){
    var primeraSubj=mc.assigns[0];
    alumnes.forEach(function(al){ setComentariAlumne(al,primeraSubj,missatgesDef[al.ini]||''); });
  });

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

}
// Amb Supabase configurat, els cursos/alumnes/notes reals es carreguen a anarAPasPostAuth();
// aquest seed generic nomes cal per al mode sense base de dades (fallback local).
if(!window.__QUADERN_SUPABASE__) seedDemo();

// ═══════════════ HELPERS ═══════════════
function ava(al,w,fs){ return '<div class="ava" style="width:'+w+'px;height:'+w+'px;font-size:'+fs+'px;background:var(--'+al.color+'-l);color:var(--'+al.color+');">'+al.ini+'</div>'; }
// El comentari general d'un alumne es individual per assignatura (Catala,
// Castella, Angles...) — es guarda a al.comentaris[assignatura], no en un
// unic camp compartit per tot el curs.
function comentariAlumne(al,subj){ return (al.comentaris&&al.comentaris[subj])||''; }
function setComentariAlumne(al,subj,text){ if(!al.comentaris) al.comentaris={}; al.comentaris[subj]=text; }
function subjActual(){ var mc=mesCursos[estat.cursIdx]; return mc?mc.assigns[estat.subjIdx]:null; }
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
function afegirAssignaturaGlobal(nom){
  if(!nom) return;
  var n=nom.trim();
  if(!n) return;
  // Comparacio sense accents (normTxt) perque "Catala" i "Català" es
  // considerin la mateixa assignatura i no es creïn duplicats.
  var ja=assignaturesList.some(function(s){ return normTxt(s)===normTxt(n); });
  if(!ja) assignaturesList.push(n);
}
function renderNota(n,big){
  if(n===null||n===undefined||n==='') return '<span style="color:var(--ink3);">'+(big?'—':'—')+'</span>';
  var col=getColor(n); var sz=big?'14':'12';
  return '<span style="font-size:'+sz+'px;font-weight:700;color:var(--'+col+');">'+n+'</span>';
}
function notaMitjana(act,comp,ini){
  var t=0,c=0;
  comp.criteris.forEach(function(crit){ var n=act.notes[ini]?act.notes[ini][crit]:null; if(n!=null){t+=parseFloat(n);c++;} });
  var ne=act.notaAltres?act.notaAltres[ini]:null; if(ne!=null){t+=parseFloat(ne);c++;}
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
function carregarAuth(){
  var sb=window.__QUADERN_SUPABASE__;
  if(!sb) return Promise.resolve();
  return sb.auth.getSession().then(function(res){
    var session=res.data&&res.data.session;
    if(session&&session.user){
      authState={isLogged:true,user:{id:session.user.id,email:session.user.email,nom:(session.user.user_metadata&&session.user.user_metadata.nom)||''}};
    }
  }).catch(function(){});
}
function escoltarCanvisAuthSupabase(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return;
  sb.auth.onAuthStateChange(function(event){
    if(event==='PASSWORD_RECOVERY'){
      document.getElementById('gate').classList.remove('hide');
      showGatePas('g-nova-contrasenya');
    }
  });
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
    // Fusiona (no sobreescriu) perque les assignatures noves que s'afegeixin
    // al codi en el futur (com "Competencies transversals") apareguin tambe
    // als comptes que ja tenien una llista desada d'una sessio anterior.
    // Abans de fusionar, substituïm qualsevol nom desat sense accent per la
    // seva forma canonica accentuada (p.ex. "Catala" -> "Català"), perque
    // llistes antigues desades abans que el fix de dedup existis no arrosseguin
    // per sempre l'entrada duplicada sense accent.
    var mergedList=saved.assignaturesList.map(function(s){
      var canonica=assignaturesList.find(function(c){ return normTxt(c)===normTxt(s); });
      return canonica||s;
    });
    assignaturesList.forEach(function(s){
      var ja=mergedList.some(function(m){ return normTxt(m)===normTxt(s); });
      if(!ja) mergedList.push(s);
    });
    // Dedup final (per si la llista desada ja tenia accentuada i sense accent alhora)
    var vist={};
    mergedList=mergedList.filter(function(m){
      var k=normTxt(m); if(vist[k]) return false; vist[k]=true; return true;
    });
    assignaturesList=mergedList;
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
var DADES_KEY = 'arrel_dades_v1';
function guardarDades(){
  lsSet(DADES_KEY, {
    alumnes: alumnes,
    activitats: activitats,
    rubrica: rubrica,
    competenciesByArea: competenciesByArea
  });
}
function carregarDades(){
  var saved=lsGet(DADES_KEY);
  if(!saved) return false;
  if(saved.alumnes && saved.alumnes.length) alumnes=saved.alumnes;
  if(saved.activitats) activitats=saved.activitats;
  // La rubrica i les competencies per defecte nomes es restauren del localStorage en
  // mode sense base de dades. Amb Supabase connectat, els valors per defecte vius al
  // codi son l'unica font de veritat, i les personalitzacions del professor arriben
  // despres via dbCarregarRubricaCustom() — sino, una copia antiga desada al navegador
  // tornaria a tapar qualsevol actualitzacio del currículum per defecte.
  if(!window.__QUADERN_SUPABASE__){
    if(saved.rubrica) rubrica=saved.rubrica;
    if(saved.competenciesByArea){
      Object.keys(saved.competenciesByArea).forEach(function(area){
        if(competenciesByArea[area]) competenciesByArea[area]=saved.competenciesByArea[area];
      });
    }
  }
  return true;
}
function tePerfilConfigurat(){
  if(!mesCursos||!mesCursos.length) return false;
  return mesCursos.every(function(mc){ return mc.assigns&&mc.assigns.length; });
}

// ═══════════════ BASE DE DADES (Supabase): cursos, assignatures, alumnes ═══════════════
function dbUid(){ return authState.user && authState.user.id; }
// Embolcall obligatori per a qualsevol escriptura a Supabase (insert/update/
// upsert/delete) que es dispara des d'una acció d'usuari. supabase-js MAI
// rebutja la promesa per un error de consulta (RLS, columna inexistent...) —
// sempre la resol amb {error:{...}}. Fer servir nomes .then(exit) o .catch()
// per tant NO detecta aquests errors: l'usuari es queda creient que s'ha
// guardat quan no és cert. Aquest helper centralitza la comprovació.
// Retorna una promesa que resol a `true` si ha anat bé i `false` si hi ha
// hagut error (ja mostrat amb toast) — el crida qui nomes necessita saber
// si pot continuar, sense preocupar-se de com detecta l'error supabase-js.
// Ús: dbEscriu(dbEliminarCurs(id), 'Error eliminant el curs').then(function(ok){ if(ok) ... });
function dbEscriu(promesa,missatgeError){
  return promesa.then(function(res){
    if(res&&res.error){
      console.warn('[Arrel]',res.error.message);
      toast(missatgeError+': '+res.error.message);
      return false;
    }
    return true;
  },function(err){
    console.warn('[Arrel]',err.message);
    toast(missatgeError+': '+err.message);
    return false;
  });
}
function dbCarregarPerfil(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return Promise.resolve(null);
  return sb.from('profiles').select('*').eq('id',dbUid()).maybeSingle().then(function(res){
    if(res.error){ console.warn('[Arrel]',res.error.message); return null; }
    return res.data;
  });
}
function dbGuardarPerfil(nom,centre,anyEscolar){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('profiles').upsert({id:dbUid(),nom:nom,centre:centre,any_escolar:anyEscolar});
}
// Límit d'informes amb IA: 4 per any escolar, comptant tots els cursos junts.
function dbComptarInformesGenerats(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return Promise.resolve(0);
  return sb.from('informes_generats').select('id',{count:'exact',head:true}).eq('professor_id',dbUid()).eq('any_escolar',prof.any||'').then(function(res){
    if(res.error){ console.warn('[Arrel]',res.error.message); return 0; }
    return res.count||0;
  });
}
function dbRegistrarInformeGenerat(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return Promise.resolve();
  return sb.from('informes_generats').insert({professor_id:dbUid(),any_escolar:prof.any||''});
}
function trobarCompetencia(compId){
  var trobada=null;
  Object.keys(competenciesByArea).some(function(area){
    var found=competenciesByArea[area].find(function(c){return c.id===compId;});
    if(found){ trobada=found; return true; }
    return false;
  });
  return trobada;
}
function dbCarregarRubricaCustom(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return Promise.resolve();
  return sb.from('rubrica_custom').select('*').eq('professor_id',dbUid()).then(function(res){
    if(res.error){ console.warn('[Arrel]',res.error.message); return; }
    (res.data||[]).forEach(function(row){
      var comp=trobarCompetencia(row.competencia_id);
      if(!comp||!row.criteris||!row.criteris.length) return;
      comp.criteris=row.criteris.map(function(c){return c.nom;});
      rubrica[row.competencia_id]=row.criteris.map(function(c){return c.rubrica||{'1-4':'','5-6':'','7-8':'','9-10':''};});
    });
  });
}
function dbGuardarRubricaCustom(compId){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return;
  var comp=trobarCompetencia(compId); if(!comp) return;
  var rubComp=rubrica[compId]||[];
  var criteris=comp.criteris.map(function(nom,i){ return {nom:nom, rubrica:rubComp[i]||{'1-4':'','5-6':'','7-8':'','9-10':''}}; });
  sb.from('rubrica_custom').upsert({professor_id:dbUid(),competencia_id:compId,criteris:criteris,updated_at:new Date().toISOString()},{onConflict:'professor_id,competencia_id'}).then(function(res){
    if(res.error) console.warn('[Arrel]',res.error.message);
  });
}
function dbCarregarCursosComplet(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return Promise.resolve([]);
  return sb.from('cursos').select('id,nom,promocio,assignatures(id,nom)').eq('professor_id',dbUid()).order('created_at').then(function(res){
    if(res.error){ console.warn('[Arrel]',res.error.message); return []; }
    return (res.data||[]).map(function(c){
      var assigs=c.assignatures||[];
      return {id:c.id, curs:c.nom, promocio:c.promocio||null, assigns:assigs.map(function(a){return a.nom;}), assignsIds:assigs.map(function(a){return a.id;})};
    });
  });
}
function dbCrearCurs(nom,assigns,promocio){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('cursos').insert({professor_id:dbUid(),nom:nom,promocio:promocio||null}).select().single().then(function(res){
    if(res.error) throw res.error;
    var cursId=res.data.id;
    if(!assigns.length) return {id:cursId,curs:nom,promocio:promocio||null,assigns:[],assignsIds:[]};
    var files=assigns.map(function(a){ return {curs_id:cursId,professor_id:dbUid(),nom:a}; });
    return sb.from('assignatures').insert(files).select().then(function(res2){
      if(res2.error) throw res2.error;
      var ids=assigns.map(function(a){ var row=res2.data.find(function(r){return r.nom===a;}); return row?row.id:null; });
      return {id:cursId,curs:nom,promocio:promocio||null,assigns:assigns.slice(),assignsIds:ids};
    });
  });
}
function dbEliminarCurs(cursId){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('cursos').delete().eq('id',cursId);
}
function dbAfegirAssignatura(cursId,nom){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('assignatures').insert({curs_id:cursId,professor_id:dbUid(),nom:nom}).select().single();
}
function dbEliminarAssignatura(cursId,nom){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('assignatures').delete().eq('curs_id',cursId).eq('nom',nom);
}
function dbCarregarAlumnes(cursId){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return Promise.resolve([]);
  return sb.from('alumnes').select('*').eq('curs_id',cursId).order('ordre').then(function(res){
    if(res.error){ console.warn('[Arrel]',res.error.message); return []; }
    return (res.data||[]).map(function(a,i){
      return {dbId:a.id,id:'',ini:ini2(a.nom),nom:a.nom,color:colorIdx(i),comentaris:a.comentaris||{},actiu:a.actiu!==false};
    });
  });
}
function carregarAlumnesDelCursActiu(){
  var mc=mesCursos[estat.cursIdx];
  var sb=window.__QUADERN_SUPABASE__;
  if(!sb||!mc||!mc.id){ return Promise.resolve(); }
  return dbCarregarAlumnes(mc.id).then(function(llista){
    alumnes=llista;
  });
}
// Data DB (yyyy-mm-dd) -> format de visualitzacio de l'app (dd/mm/yyyy [· hh:mm])
function formatarDataActivitat(dataISO,hora){
  if(!dataISO) return '';
  return dataISO.split('-').reverse().join('/')+(hora?' · '+hora:'');
}
function carregarActivitatsDelContext(){
  var sb=window.__QUADERN_SUPABASE__;
  var mc=mesCursos[estat.cursIdx];
  if(!sb||!mc||!mc.id) return Promise.resolve();
  var subj=mc.assigns[estat.subjIdx];
  var assignaturaId=mc.assignsIds&&mc.assignsIds[estat.subjIdx];
  if(!subj||!assignaturaId) return Promise.resolve();
  return sb.from('activitats').select('*').eq('curs_id',mc.id).eq('assignatura_id',assignaturaId).then(function(res){
    if(res.error){ console.warn('[Arrel]',res.error.message); return; }
    // Neteja nomes les claus d'aquest curs+assignatura, per no perdre el que ja hi hagi carregat d'altres
    Object.keys(activitats).forEach(function(k){
      if(k.indexOf(mc.curs+'_')===0 && k.indexOf('_'+subj+'_')!==-1) delete activitats[k];
    });
    (res.data||[]).forEach(function(row){
      var k=mc.curs+'_'+row.trimestre+'_'+subj+'_'+row.competencia_id;
      if(!activitats[k]) activitats[k]=[];
      activitats[k].push({
        dbId:row.id, id:row.id, nom:row.nom,
        data:formatarDataActivitat(row.data,row.hora), dataISO:row.data, hora:row.hora,
        notes:row.notes||{}, altres:row.comentaris||{}, notaAltres:{}, provaGroupId:row.grup_prova_id||null
      });
    });
  });
}
function dbCrearActivitat(cursId,assignaturaId,compId,trim,nom,dataISO,hora,grupProvaId){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('activitats').insert({
    curs_id:cursId,assignatura_id:assignaturaId,professor_id:dbUid(),
    competencia_id:compId,trimestre:trim,nom:nom,data:dataISO||null,hora:hora||null,
    notes:{},comentaris:{}, grup_prova_id:grupProvaId||null
  }).select().single();
}
function dbActualitzarNotesActivitat(actDbId,notes){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('activitats').update({notes:notes}).eq('id',actDbId);
}
function dbActualitzarComentarisActivitat(actDbId,comentaris){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('activitats').update({comentaris:comentaris}).eq('id',actDbId);
}
function dbEliminarActivitat(actDbId){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('activitats').delete().eq('id',actDbId);
}
function dbAfegirAlumne(cursId,nom,ordre){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('alumnes').insert({curs_id:cursId,professor_id:dbUid(),nom:nom,ordre:ordre}).select().single();
}
function dbActualitzarComentariAlumne(alumneDbId,comentaris){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('alumnes').update({comentaris:comentaris}).eq('id',alumneDbId);
}
function dbActualitzarActiuAlumne(alumneDbId,actiu){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('alumnes').update({actiu:actiu}).eq('id',alumneDbId);
}
function dbActualitzarNomAlumne(alumneDbId,nom){
  var sb=window.__QUADERN_SUPABASE__;
  return sb.from('alumnes').update({nom:nom}).eq('id',alumneDbId);
}
function anarAPasPostAuth(){
  document.getElementById('gate').classList.remove('hide');
  carregarPerfil();
  if(authState.user&&authState.user.nom) prof.nom=authState.user.nom;
  var sb=window.__QUADERN_SUPABASE__;
  if(!sb){
    // Sense base de dades configurada: mode antic, nomes local
    if(tePerfilConfigurat()){ renderGateCursos(); showGatePas('g-sel-cursos'); return; }
    var inpNom=document.getElementById('reg-nom'); if(inpNom) inpNom.value=prof.nom;
    showGatePas('g-dades');
    return;
  }
  dbCarregarPerfil().then(function(perfil){
    if(perfil){ prof.nom=perfil.nom||prof.nom; prof.centre=perfil.centre||''; prof.any=perfil.any_escolar||''; }
    return dbCarregarRubricaCustom();
  }).then(function(){
    return dbCarregarCursosComplet();
  }).then(function(cursos){
    // Un compte nou comença totalment buit: sense cursos, assignatures ni
    // alumnes de mostra — el professor els crea ell mateix des de zero.
    mesCursos=cursos;
    if(estat.cursIdx>=mesCursos.length) estat.cursIdx=0;
    if(estat.subjIdx>=(mesCursos[estat.cursIdx]?mesCursos[estat.cursIdx].assigns.length:0)) estat.subjIdx=0;
    return carregarAlumnesDelCursActiu();
  }).then(function(){
    renderGateCursos();
    showGatePas('g-sel-cursos');
    // Un compte nou de Supabase no passa per "g-dades" (aixo nomes existeix al
    // mode local) — si encara no ha triat centre/any escolar, li ho demanem ara
    // amb el mateix popup d'editar perfil, en lloc de deixar-ho en blanc en
    // silenci fins que generi un informe i el trobi buit.
    if(!prof.centre||!prof.any) obrirEditarPerfil();
  }).catch(function(err){
    toast('Error carregant les dades: '+err.message);
  });
}
function validarEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function registrarCompte(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb){toast('Base de dades no configurada');return;}
  var nom=(document.getElementById('reg-user-nom').value||'').trim();
  var email=(document.getElementById('reg-user-email').value||'').trim().toLowerCase();
  var pass=(document.getElementById('reg-user-pass').value||'').trim();
  if(!nom){toast('Escriu el nom i cognoms');return;}
  if(!validarEmail(email)){toast('Correu electrònic no vàlid');return;}
  if(pass.length<6){toast('La contrasenya ha de tenir mínim 6 caràcters');return;}
  var termsCheck=document.getElementById('reg-terms-check');
  if(!termsCheck||!termsCheck.checked){toast('Cal acceptar els termes i condicions i la política de privacitat');return;}
  ambBotoCarregant('reg-user-submit-btn','Creant compte…',function(){
    return sb.auth.signUp({email:email,password:pass,options:{data:{nom:nom}}}).then(function(res){
      if(res.error){toast(res.error.message);return;}
      // Per no filtrar quins correus estan registrats, Supabase respon "sense error"
      // fins i tot si el correu ja te un compte — es distingeix perque "identities"
      // ve buit en aquest cas (un compte nou de veritat sempre en te com a minim 1).
      var jaExisteix=res.data.user&&res.data.user.identities&&res.data.user.identities.length===0;
      if(jaExisteix){
        toast('Ja hi ha un compte amb aquest correu. Inicia sessió o recupera la contrasenya.');
        showGatePas('g-login');
        return;
      }
      if(!res.data.session){
        toast('Compte creat ✓ Revisa el teu correu per confirmar-lo');
        showGatePas('g-login');
        return;
      }
      authState={isLogged:true,user:{id:res.data.user.id,email:res.data.user.email,nom:nom}};
      prof.nom=nom;
      toast('Compte creat ✓');
      anarAPasPostAuth();
    });
  });
}
function iniciarSessio(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb){toast('Base de dades no configurada');return;}
  var email=(document.getElementById('login-email').value||'').trim().toLowerCase();
  var pass=(document.getElementById('login-pass').value||'').trim();
  if(!email||!pass){toast('Escriu el correu i la contrasenya');return;}
  sb.auth.signInWithPassword({email:email,password:pass}).then(function(res){
    if(res.error){toast(res.error.message);return;}
    authState={isLogged:true,user:{id:res.data.user.id,email:res.data.user.email,nom:(res.data.user.user_metadata&&res.data.user.user_metadata.nom)||''}};
    toast('Sessió iniciada ✓');
    anarAPasPostAuth();
  });
}
function demanarRecuperacio(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb){toast('Base de dades no configurada');return;}
  var email=(document.getElementById('rec-email').value||'').trim().toLowerCase();
  if(!validarEmail(email)){toast('Correu electrònic no vàlid');return;}
  sb.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/recuperar-contrasenya'}).then(function(res){
    if(res.error){toast(res.error.message);return;}
    toast('T\'hem enviat un correu amb l\'enllaç ✓');
    showGatePas('g-login');
  });
}
function guardarNovaContrasenya(){
  var sb=window.__QUADERN_SUPABASE__; if(!sb){toast('Base de dades no configurada');return;}
  var pass=(document.getElementById('nova-pass').value||'').trim();
  if(pass.length<6){toast('La contrasenya ha de tenir mínim 6 caràcters');return;}
  sb.auth.updateUser({password:pass}).then(function(res){
    if(res.error){toast(res.error.message);return;}
    toast('Contrasenya actualitzada ✓');
    authState={isLogged:true,user:{id:res.data.user.id,email:res.data.user.email,nom:(res.data.user.user_metadata&&res.data.user.user_metadata.nom)||''}};
    anarAPasPostAuth();
  });
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
  var sb=window.__QUADERN_SUPABASE__;
  if(sb) dbEscriu(dbGuardarPerfil(prof.nom,prof.centre,prof.any),'Error desant el perfil');
}
function tancarSessio(){
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(){
    authState={isLogged:false,user:null};
    if(sb){
      // Neteja l'estat en memoria i la copia local (nomes en mode Supabase,
      // on aquesta cache es un mirall de la BD): si algu inicia sessio amb un
      // altre compte en aquest mateix navegador, no ha de veure cap resta
      // d'aquest (cursos, alumnes, notes...). En mode local sense backend
      // aquesta cache ES l'unica copia de les dades, no es pot esborrar.
      mesCursos=[]; alumnes=[]; activitats={};
      estat={cursIdx:0,trimIdx:0,subjIdx:0};
      try{ window.localStorage.removeItem(PERFIL_KEY); window.localStorage.removeItem(DADES_KEY); }catch(err){}
    }
    document.getElementById('gate').classList.remove('hide');
    showGatePas('g-login');
    toast('Sessió tancada');
  };
  var sortir=function(){ if(sb) sb.auth.signOut().then(acabar); else acabar(); };
  if(pendingSaves.length) Promise.all(pendingSaves).catch(function(){}).then(sortir); else sortir();
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
    h+='<div style="width:44px;height:44px;border-radius:10px;background:'+icoBg+';color:'+icoCol+';display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0;overflow:hidden;">'+escHtml(mc.curs.trim().substring(0,3).trim())+'</div>';
    h+='<div style="flex:1;min-width:0;">';
    h+='<div style="font-size:15px;font-weight:700;">'+escHtml(mc.curs)+(mc.promocio?' <span style="font-size:11px;font-weight:600;color:var(--ink3);">· Promoció '+mc.promocio+'</span>':'')+'</div>';
    h+='<div style="font-size:11px;color:var(--ink3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+mc.assigns.join(' · ')+'</div>';
    h+='</div>';
    h+='<div style="flex-shrink:0;" onclick="event.stopPropagation()">';
    h+='<div style="font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Trimestre</div>';
    h+='<select data-ci="'+ci+'" onchange="selTrimSelect(this)" style="border:1.5px solid var(--line);border-radius:var(--r);padding:7px 10px;font-size:13px;font-weight:600;font-family:inherit;background:var(--surface);cursor:pointer;outline:none;min-width:150px;">';
    trimestres.forEach(function(trim,ti){
      h+='<option value="'+ti+'"'+(isSel&&ti===estat.trimIdx?' selected':'')+'>'+trim+'</option>';
    });
    h+='</select>';
    h+='<button class="btn btn-danger" style="margin-top:6px;width:150px;border-radius:var(--r);padding:7px 10px;font-size:13px;font-weight:600;background:var(--surface);" onclick="confirmarEliminarCurs('+ci+')">Eliminar curs</button>';
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

// ─── Eliminar curs (accio perillosa: cal escriure el nom exacte per confirmar) ───
function confirmarEliminarCurs(ci){
  var mc=mesCursos[ci]; if(!mc) return;
  if(mesCursos.length<=1){ toast('Cal tenir almenys un curs'); return; }
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-del-curs';
  overlay.dataset.nomEsperat=mc.curs;
  overlay.innerHTML='<div class="popup" style="width:400px;">'
    +'<div style="font-size:32px;text-align:center;margin-bottom:10px;">⚠️</div>'
    +'<div class="popup-head" style="text-align:center;">Eliminar curs</div>'
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">Eliminaràs: <b>'+escHtml(mc.curs)+'</b></div>'
    +'<div style="font-size:12.5px;color:var(--clay);background:var(--clay-l);border-radius:var(--r);padding:10px 12px;margin-bottom:16px;text-align:center;line-height:1.6;">Es perdran totes les notes, activitats i events d\'aquest curs. Aquesta acció no es pot desfer.</div>'
    +'<div class="fg"><label class="flbl">Per confirmar, escriu el nom del curs: <b>'+escHtml(mc.curs)+'</b></label><input class="input" id="del-curs-confirm" oninput="checkDelCursInput(this)" autocomplete="off"></div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-danger" id="del-curs-btn" disabled style="flex:1;background:var(--clay);color:#fff;border-color:var(--clay);" onclick="eliminarCursConfirmat('+ci+')">Sí, eliminar</button>'
      +'<button class="btn" style="flex:1;" onclick="tancarDelCurs()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('del-curs-confirm'); if(inp) inp.focus();},60);
}
function checkDelCursInput(inp){
  var overlay=document.getElementById('pop-del-curs'); var btn=document.getElementById('del-curs-btn');
  if(btn&&overlay) btn.disabled = inp.value.trim()!==overlay.dataset.nomEsperat;
}
function tancarDelCurs(){ var e=document.getElementById('pop-del-curs'); if(e) e.remove(); }
function eliminarCursConfirmat(ci){
  var mc=mesCursos[ci]; if(!mc) return;
  if(mesCursos.length<=1){ toast('Cal tenir almenys un curs'); return; }
  Object.keys(activitats).forEach(function(k){
    if(k.indexOf(mc.curs+'_')===0) delete activitats[k];
  });
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(){
    mesCursos.splice(ci,1);
    if(estat.cursIdx>=mesCursos.length) estat.cursIdx=0;
    estat.subjIdx=0;
    tancarDelCurs();
    guardarPerfil(); guardarDades();
    renderGateCursos();
    carregarAlumnesDelCursActiu().then(function(){ updateNav(); renderAll(); });
    toast('Curs eliminat');
  };
  if(sb&&mc.id){
    dbEscriu(dbEliminarCurs(mc.id),'Error eliminant el curs').then(function(ok){ if(ok) acabar(); });
  }else{
    acabar();
  }
}

function selCurs(ci){
  estat.cursIdx=ci;
  var mc=mesCursos[ci];
  document.getElementById('g-sel-assigns-eyebrow').textContent=mc.curs+' · '+trimestres[estat.trimIdx];
  var h='';
  mc.assigns.forEach(function(s,si){
    h+='<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:1.5px solid var(--line);border-radius:var(--rl);margin-bottom:8px;cursor:pointer;background:var(--surface);touch-action:manipulation;" onclick="selSubj('+si+')">';
    h+='<span style="font-size:14px;font-weight:700;flex:1;">'+escHtml(s)+'</span>';
    h+='<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();confirmarEliminarAssignatura('+ci+','+si+')">Eliminar</button>';
    h+='<span style="color:var(--ink3);font-size:20px;font-weight:300;">›</span>';
    h+='</div>';
  });
  h+='<div style="display:flex;justify-content:flex-end;margin-top:10px;">'
    +'<button class="btn btn-sm" onclick="obrirAfegirAssignatura('+ci+')">+ Afegir assignatura</button>'
  +'</div>';
  document.getElementById('g-sel-assigns-list').innerHTML=h;
  showGatePas('g-sel-assigns');
}

// ─── Eliminar assignatura (accio perillosa: cal escriure el nom exacte per confirmar) ───
function confirmarEliminarAssignatura(ci,si){
  var mc=mesCursos[ci]; if(!mc) return;
  if(mc.assigns.length<=1){ toast('Cal tenir almenys una assignatura'); return; }
  var subj=mc.assigns[si];
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-del-assig';
  overlay.dataset.nomEsperat=subj;
  overlay.innerHTML='<div class="popup" style="width:400px;">'
    +'<div style="font-size:32px;text-align:center;margin-bottom:10px;">⚠️</div>'
    +'<div class="popup-head" style="text-align:center;">Eliminar assignatura</div>'
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">Eliminaràs <b>'+escHtml(subj)+'</b> de <b>'+escHtml(mc.curs)+'</b></div>'
    +'<div style="font-size:12.5px;color:var(--clay);background:var(--clay-l);border-radius:var(--r);padding:10px 12px;margin-bottom:16px;text-align:center;line-height:1.6;">Es perdran totes les notes i activitats d\'aquesta assignatura per a aquest curs. Aquesta acció no es pot desfer.</div>'
    +'<div class="fg"><label class="flbl">Per confirmar, escriu el nom de l\'assignatura: <b>'+escHtml(subj)+'</b></label><input class="input" id="del-assig-confirm" oninput="checkDelAssigInput(this)" autocomplete="off"></div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-danger" id="del-assig-btn" disabled style="flex:1;background:var(--clay);color:#fff;border-color:var(--clay);" onclick="eliminarAssignaturaConfirmat('+ci+','+si+')">Sí, eliminar</button>'
      +'<button class="btn" style="flex:1;" onclick="tancarDelAssig()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('del-assig-confirm'); if(inp) inp.focus();},60);
}
function checkDelAssigInput(inp){
  var overlay=document.getElementById('pop-del-assig'); var btn=document.getElementById('del-assig-btn');
  if(btn&&overlay) btn.disabled = inp.value.trim()!==overlay.dataset.nomEsperat;
}
function tancarDelAssig(){ var e=document.getElementById('pop-del-assig'); if(e) e.remove(); }
function eliminarAssignaturaConfirmat(ci,si){
  var mc=mesCursos[ci]; if(!mc) return;
  if(mc.assigns.length<=1){ toast('Cal tenir almenys una assignatura'); return; }
  var subj=mc.assigns[si];
  Object.keys(activitats).forEach(function(k){
    if(k.indexOf(mc.curs+'_')===0 && k.indexOf('_'+subj+'_')!==-1) delete activitats[k];
  });
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(){
    mc.assigns.splice(si,1);
    if(mc.assignsIds) mc.assignsIds.splice(si,1);
    if(estat.cursIdx===ci && estat.subjIdx>=mc.assigns.length) estat.subjIdx=0;
    tancarDelAssig();
    guardarPerfil(); guardarDades();
    selCurs(ci);
    updateNav(); renderAll();
    toast('Assignatura eliminada');
  };
  if(sb&&mc.id){
    dbEscriu(dbEliminarAssignatura(mc.id,subj),'Error eliminant').then(function(ok){ if(ok) acabar(); });
  }else{
    acabar();
  }
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
  if(!opcions.length){
    overlay.innerHTML='<div class="popup" style="width:420px;">'
      +'<div class="popup-head">Afegir assignatura a '+escHtml(mc.curs)+'</div>'
      +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:16px;">Ja tens totes les assignatures disponibles afegides a aquest curs.</div>'
      +'<button class="btn" style="width:100%;" onclick="tancarAfegirAssignatura()">Tancar</button>'
    +'</div>';
  }else{
    overlay.innerHTML='<div class="popup" style="width:420px;">'
      +'<div class="popup-head">Afegir assignatura a '+escHtml(mc.curs)+'</div>'
      +'<div class="fg"><label class="flbl">Assignatura</label>'
        +'<select class="input" id="aa-nom">'
          +opcions.map(function(s){return '<option value="'+escHtml(s)+'">'+escHtml(s)+'</option>';}).join('')
        +'</select>'
      +'</div>'
      +'<div style="display:flex;gap:8px;">'
        +'<button class="btn btn-clay" style="flex:1;" onclick="guardarNovaAssignatura('+ci+')">Afegir</button>'
        +'<button class="btn btn-ghost" onclick="tancarAfegirAssignatura()">Cancel·lar</button>'
      +'</div>'
    +'</div>';
  }
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
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
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(novaId){
    mc.assigns.push(nom);
    if(!mc.assignsIds) mc.assignsIds=[];
    mc.assignsIds.push(novaId||null);
    afegirAssignaturaGlobal(nom);
    guardarPerfil();
    tancarAfegirAssignatura();
    selCurs(ci);
    updateNav();
    toast('Assignatura afegida ✓');
  };
  if(sb&&mc.id){
    dbAfegirAssignatura(mc.id,nom).then(function(res){
      if(res.error){ toast('Error afegint: '+res.error.message); return; }
      acabar(res.data.id);
    });
  }else{
    acabar();
  }
}


function toggleSubjDropdown(e){
  if(e) e.stopPropagation();
  var dd=document.getElementById('nav-subj-dd'); if(!dd) return;
  if(dd.classList.contains('open')){ dd.classList.remove('open'); return; }
  var mc=mesCursos[estat.cursIdx];
  if(!mc||!mc.assigns||mc.assigns.length<2){ abrirGateSeleccio(); return; }
  dd.innerHTML=mc.assigns.map(function(s,si){
    return '<div class="nav-subj-opt'+(si===estat.subjIdx?' on':'')+'" onclick="event.stopPropagation();canviarSubjNav('+si+')">'+escHtml(s)+'</div>';
  }).join('')+'<div class="nav-subj-opt nav-subj-more" onclick="event.stopPropagation();document.getElementById(\'nav-subj-dd\').classList.remove(\'open\');abrirGateSeleccio();">Canviar de curs…</div>';
  // S'ancora amb position:fixed i es mou al <body> perque nav (overflow-x:auto)
  // no el retalli verticalment — l'overflow-x fa que l'overflow-y efectiu tambe sigui auto.
  if(dd.parentNode!==document.body) document.body.appendChild(dd);
  var anchor=(e&&e.currentTarget)||document.querySelector('.nav-ctx');
  var r=anchor.getBoundingClientRect();
  dd.style.top=(r.bottom+6)+'px';
  dd.style.left=r.left+'px';
  dd.classList.add('open');
  setTimeout(function(){document.addEventListener('click',tancarSubjDropdown);},0);
}
function tancarSubjDropdown(){
  var dd=document.getElementById('nav-subj-dd'); if(dd) dd.classList.remove('open');
  document.removeEventListener('click',tancarSubjDropdown);
}
function canviarSubjNav(si){
  var dd=document.getElementById('nav-subj-dd'); if(dd) dd.classList.remove('open');
  selSubj(si);
}
function selSubj(si){
  estat.subjIdx=si;
  guardarPerfil();
  document.getElementById('gate').classList.add('hide');
  syncCompetenciesForCurrentSubject();
  // Espera que qualsevol guardat en curs (notes, comentaris...) confirmi contra
  // Supabase abans de tornar a carregar dades del context, sino la recarrega pot
  // arribar abans que el guardat i mostrar dades antigues (com si s'haguessin esborrat).
  Promise.all(pendingSaves).catch(function(){}).then(function(){
    return Promise.all([carregarAlumnesDelCursActiu(), carregarActivitatsDelContext()]);
  }).then(function(){
    updateNav(); renderAll();
  });
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
function selTrimNav(ti){
  estat.trimIdx=ti; guardarPerfil(); updateNav(); renderAll();
  toast(trimestres[ti]);
}
function obrirNouCurs(){
  document.getElementById('nc-nom').value='';
  document.getElementById('nc-promocio').value='';
  document.getElementById('nc-subj-chips').innerHTML=assignaturesList.map(function(s){
    return '<button class="subj-chip" onclick="this.classList.toggle(\'sel\')">'+escHtml(s)+'</button>';
  }).join('');
  document.getElementById('pop-nou-curs').style.display='flex';
}
function crearNouCurs(){
  var nom=document.getElementById('nc-nom').value.trim();
  if(!nom){toast('Escriu el nom del curs');return;}
  var promocioVal=document.getElementById('nc-promocio').value.trim();
  var promocio=promocioVal?parseInt(promocioVal,10):null;
  var assigns=Array.from(document.querySelectorAll('#nc-subj-chips .subj-chip.sel')).map(function(el){return el.textContent;});
  if(!assigns.length){toast('Selecciona almenys una assignatura');return;}
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(nouCurs){
    mesCursos.push(nouCurs);
    document.getElementById('pop-nou-curs').style.display='none';
    toast('Curs "'+nom+'" creat ✓');
    estat.cursIdx=mesCursos.length-1;
    estat.trimIdx=0;
    estat.subjIdx=0;
    guardarPerfil();
    renderGateCursos();
  };
  if(sb){
    dbCrearCurs(nom,assigns,promocio).then(acabar).catch(function(err){ toast('Error creant el curs: '+err.message); });
  }else{
    acabar({curs:nom,assigns:assigns,promocio:promocio});
  }
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
    +'<div class="mc"><div class="mc-l">'+pv('mot')+'</div><div class="mc-v">'+getProves().length+'</div><div class="mc-s">aquest trimestre</div></div>'
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

  // Gràfic d'aranya classe (drawSpider ja abrevia i parteix les etiquetes llargues).
  // Nomes s'hi inclouen les competencies amb alguna nota — sino l'eix es dibuixaria
  // a 0, indistingible visualment d'un assoliment realment nul.
  var spiderIdx=compAvgs.map(function(v,i){return i;}).filter(function(i){ return compAvgs[i]!==null; });
  var spiderVals=spiderIdx.map(function(i){ return compAvgs[i]; });
  var spiderLabels=spiderIdx.map(function(i){ return competencies[i].nom; });
  drawSpider('spider-home', spiderLabels, [spiderVals], ['var(--clay)'], 260, 220);
}

// ═══════════════ SPIDER CHART ═══════════════
// Escurça un nom de dues (o mes) paraules a "Inicial. Resta" (ex: "Comprensio Oral" -> "C. Oral")
// per guanyar espai als eixos del gràfic d'aranya.
function abreviaLabelSpider(nom){
  var words=nom.trim().split(' ').filter(function(w){return w.length>0;});
  if(words.length<=1) return nom;
  return words[0].charAt(0).toUpperCase()+'. '+words.slice(1).join(' ');
}
// Si l'etiqueta encara no cap en maxWidth, la parteix en com a molt 2 línies
// (mai la retalla ni hi posa punts suspensius: sempre es pot llegir sencera).
function partirLabelSpider(ctx, text, maxWidth){
  if(ctx.measureText(text).width<=maxWidth) return [text];
  var words=text.split(' ');
  if(words.length<=1) return [text];
  var mid=Math.ceil(words.length/2);
  var linia1=words.slice(0,mid).join(' ');
  var linia2=words.slice(mid).join(' ');
  return linia2?[linia1,linia2]:[linia1];
}
function drawSpider(canvasId, labels, datasets, colors, W, H){
  var canvas=document.getElementById(canvasId); if(!canvas) return;
  var ctx=canvas.getContext('2d');
  spiderCoreDraw(ctx, W, H, labels, datasets, colors);
}
function spiderCoreDraw(ctx, W, H, labels, datasets, colors){
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
    // Label — s'abrevia (ex: "C. Oral") i, si encara no cap, es parteix en 2 línies
    var lx=cx+(R+18)*Math.cos(a); var ly=cy+(R+18)*Math.sin(a);
    ctx.fillStyle='#6E665E'; ctx.font='bold 11px Karla,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    var linies=partirLabelSpider(ctx, abreviaLabelSpider(labels[i]), 72);
    if(linies.length===1){
      ctx.fillText(linies[0],lx,ly);
    } else {
      ctx.fillText(linies[0],lx,ly-6);
      ctx.fillText(linies[1],lx,ly+6);
    }
  }
  // Datasets
  var VAR_HEX_MAP={'var(--clay)':'#B5562F','var(--moss)':'#566B47','var(--sky)':'#3C6B82','var(--honey)':'#B98627','var(--plum)':'#6B4A6E'};
  datasets.forEach(function(data,di){
    var col=colors[di]||'var(--clay)';
    var hex=VAR_HEX_MAP[col]||(col.startsWith('var(')?'#B5562F':col);
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
  var alumnesActius=alumnes.filter(function(al){return al.actiu!==false;});
  var alumnesFiltrats=cerca?alumnesActius.filter(function(al){return al.nom.toLowerCase().indexOf(cerca)!==-1;}):alumnesActius;
  document.getElementById('alumne-detail').style.display='none';
  document.getElementById('alumnes-table-wrap').style.display='block';

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
    var missatge=comentariAlumne(al,subj);
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
        +(missatge
          ?'<span style="font-size:11.5px;color:var(--ink2);font-style:italic;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;">'+escHtml(missatge)+'</span>'
          :'<span style="color:var(--ink3);">—</span>')+
      '</td>'
      +'<td style="padding:8px 8px;">'
        +'<button class="btn btn-sm" data-nom="'+escHtml(al.nom)+'" onclick="event.stopPropagation();obrirMissatgeAluBtn(this)">'+
          (missatge?'Editar':'+ Comentari')+
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

  // Calcular notes per competència per a l'alumne (null = encara sense cap nota)
  var alumneVals=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ comp.criteris.forEach(function(crit){ var n=act.notes[ini]?act.notes[ini][crit]:null; if(n!=null){t+=n;c++;} }); });
    return c?Math.round(t/c*10)/10:null;
  });
  // Calcular mitjana de classe per competència (null = encara sense cap nota)
  var classeVals=competencies.map(function(comp){
    var acts=getActsFor(mc.curs,trim,subj,comp.id); var t=0,c=0;
    acts.forEach(function(act){ alumnes.forEach(function(al2){ comp.criteris.forEach(function(crit){ var n=act.notes[al2.ini]?act.notes[al2.ini][crit]:null; if(n!=null){t+=n;c++;} }); }); });
    return c?Math.round(t/c*10)/10:null;
  });

  var canvasId='spider-alu-'+ini;
  var missatge=comentariAlumne(al,subj);

  document.getElementById('alumne-detail-body').innerHTML=
    '<div class="card" style="margin-bottom:12px;">'
      +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">'
        +ava(al,44,16)
        +'<div style="flex:1;">'
          +'<div style="font-size:17px;font-weight:700;">'+escHtml(al.nom)+'</div>'
          +'<div style="font-size:12px;color:var(--ink3);">'+escHtml(mc.curs)+' · '+trim+' · '+escHtml(subj)+'</div>'
        +'</div>'
      +'</div>'
      +'<div class="alu-detail-grid">'
        +'<div>'
          +'<div class="sec" style="margin-bottom:4px;">Gràfic d\'aranya</div>'
          +'<div class="spider-wrap"><canvas id="'+canvasId+'" width="240" height="200"></canvas></div>'
          +'<div style="display:flex;gap:14px;justify-content:center;margin-top:6px;">'
            +'<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);"><div style="width:12px;height:3px;background:var(--moss);border-radius:2px;"></div>'+escHtml(al.nom.split(' ')[0])+'</div>'
            +'<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);"><div style="width:12px;height:3px;background:var(--clay);border-radius:2px;"></div>Classe</div>'
          +'</div>'
        +'</div>'
        +'<div>'
          +'<div class="sec">Notes per competència</div>'
          +competencies.map(function(comp,ci){
            var v=alumneVals[ci]; var col=v?getColor(v):'ink3';
            return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">'
              +'<span style="font-size:10px;font-weight:600;color:var(--ink2);width:80px;flex-shrink:0;line-height:1.3;">'+comp.nom+'</span>'
              +'<div style="flex:1;height:4.5px;background:var(--line);border-radius:4px;overflow:hidden;">'
                +'<div style="height:100%;width:'+(v?v*10:0)+'%;background:var(--'+col+');border-radius:4px;"></div>'
              +'</div>'
              +'<span style="font-size:12px;font-weight:700;width:24px;">'+renderNota(v||null,false)+'</span>'
            +'</div>';
          }).join('')
        +'</div>'
        +'<div>'
          +'<div class="sec" style="margin-bottom:4px;">Comentari</div>'
          +'<div class="privacy-note">Aquest comentari s\'inclourà a l\'informe i pot ser tractat per tercers per generar-lo. No hi introdueixis dades personals.</div>'
          +'<textarea id="inline-comment-'+al.ini+'" class="inline-comment" data-nom="'+escHtml(al.nom)+'" placeholder="Escriu un comentari…" rows="1" oninput="autoResizeTextarea(this)" onblur="guardarComentariInline(this)">'+escHtml(missatge)+'</textarea>'
        +'</div>'
      +'</div>'
    +'</div>';

  // Dibuixar spider — nomes eixos amb alguna nota (de l'alumne o de la classe),
  // sino es dibuixarien a 0, indistingible visualment d'un assoliment realment nul.
  setTimeout(function(){
    var spiderIdx=competencies.map(function(c,i){return i;}).filter(function(i){ return alumneVals[i]!==null || classeVals[i]!==null; });
    var spiderLbls=spiderIdx.map(function(i){ return competencies[i].nom; });
    var spiderAlu=spiderIdx.map(function(i){ return alumneVals[i]||0; });
    var spiderCla=spiderIdx.map(function(i){ return classeVals[i]||0; });
    drawSpider(canvasId, spiderLbls, [spiderAlu, spiderCla], ['var(--moss)','var(--clay)'], 240, 200);
    var ta=document.getElementById('inline-comment-'+ini); if(ta) autoResizeTextarea(ta);
  }, 30);
}

function autoResizeTextarea(ta){
  ta.style.height='auto';
  ta.style.height=ta.scrollHeight+'px';
}
function guardarComentariInline(ta){
  var nom=ta.dataset.nom;
  var subj=subjActual(); if(!subj) return;
  var text=ta.value.trim();
  var al=alumnes.find(function(a){return a.nom===nom;});
  if(!al) return;
  if(comentariAlumne(al,subj)===text) return;
  setComentariAlumne(al,subj,text);
  guardarDades();
  toast('Comentari guardat ✓');
  var sb=window.__QUADERN_SUPABASE__;
  if(sb&&al.dbId){
    trackSave(dbEscriu(dbActualitzarComentariAlumne(al.dbId,al.comentaris),'Error guardant comentari'));
  }
}
function obrirMissatgeAluBtn(btn){ obrirMissatgeAlu(btn.dataset.nom); }
function obrirMissatgeAlu(nom){
  var subj=subjActual();
  var al=alumnes.find(function(a){return a.nom===nom;});
  document.getElementById('pop-miss-nom').textContent=nom;
  document.getElementById('pop-miss-text').value=al?comentariAlumne(al,subj):'';
  document.getElementById('pop-miss').style.display='flex';
  document.getElementById('pop-miss').dataset.nom=nom;
  setTimeout(function(){document.getElementById('pop-miss-text').focus();},80);
}
function guardarMissatge(){
  var nom=document.getElementById('pop-miss').dataset.nom;
  var subj=subjActual(); if(!subj) return;
  var text=document.getElementById('pop-miss-text').value.trim();
  var al=alumnes.find(function(a){return a.nom===nom;});
  if(!al) return;
  setComentariAlumne(al,subj,text);
  document.getElementById('pop-miss').style.display='none';
  guardarDades();
  renderAlumnes(); toast('Comentari guardat ✓');
  var sb=window.__QUADERN_SUPABASE__;
  if(sb&&al.dbId){
    trackSave(dbEscriu(dbActualitzarComentariAlumne(al.dbId,al.comentaris),'Error guardant comentari'));
  }
}

// ═══════════════ COMPETÈNCIES ═══════════════
// Nomes regenera l'HTML de les targetes (comptador d'activitats inclos) sense
// tocar quina vista es visible — cal cridar-ho despres de crear/eliminar una
// activitat perque el comptador no quedi desfasat fins que es recarregui la
// pagina, encara que en aquell moment no s'estigui mirant aquesta llista.
function actualitzarCompTiles(){
  document.getElementById('comp-tiles').innerHTML=competencies.map(function(comp){
    var acts=getActs(comp.id);
    return '<div class="comp-tile" onclick="openComp(\''+comp.id+'\')">'
      +'<div class="comp-ico" style="background:var(--'+comp.color+'-l);color:var(--'+comp.color+');">'+comp.ico+'</div>'
      +'<div><div style="font-size:13px;font-weight:700;">'+comp.nom+'</div>'
        +'<div style="font-size:11px;color:var(--ink3);">'+acts.length+' activitats</div></div>'
      +'<span style="margin-left:auto;color:var(--ink3);">›</span>'
    +'</div>';
  }).join('')
    +'<div class="comp-tile" onclick="obrirProves()">'
      +'<div class="comp-ico" style="background:var(--clay-l);color:var(--clay);">PR</div>'
      +'<div><div style="font-size:13px;font-weight:700;">'+pv('mot')+'</div>'
        +'<div style="font-size:11px;color:var(--ink3);">'+getProves().length+' '+pv('mot').toLowerCase()+'(s)</div></div>'
      +'<span style="margin-left:auto;color:var(--ink3);">›</span>'
    +'</div>';
}
function renderCompTiles(){
  showCV('cv-llista','cv-activitats'); showCV('cv-llista','cv-graella');
  showCV('cv-llista','cv-proves'); showCV('cv-llista','cv-prova-graella');
  document.getElementById('cv-llista').style.display='block';
  actualitzarCompTiles();
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
    +'<tbody>';

  // Fila compacta de mitjana de classe per activitat + global de la competència
  var notesPerAlumne=alumnes.map(function(al){
    var notes_al=acts.map(function(a){ return notaMitjana(a,comp,al.ini); });
    var valids=notes_al.filter(function(n){return n!==null;});
    var global=valids.length?Math.round(valids.reduce(function(a,b){return a+b;},0)/valids.length*10)/10:null;
    return {notes_al:notes_al,global:global};
  });
  var mitjanesClasseAct=acts.map(function(a,ai){
    var vals=notesPerAlumne.map(function(n){return n.notes_al[ai];}).filter(function(n){return n!==null;});
    return vals.length?Math.round(vals.reduce(function(x,y){return x+y;},0)/vals.length*10)/10:null;
  });
  var globalsVals=notesPerAlumne.map(function(n){return n.global;}).filter(function(n){return n!==null;});
  var mitjanaClasseGlobal=globalsVals.length?Math.round(globalsVals.reduce(function(x,y){return x+y;},0)/globalsVals.length*10)/10:null;

  html+='<tr style="background:var(--clay-l);">'
    +'<td class="sticky" style="padding:6px 12px;background:var(--clay-l);font-size:11px;font-weight:700;color:var(--clay);text-transform:uppercase;letter-spacing:.02em;">Mitjana de classe</td>'
    +mitjanesClasseAct.map(function(n){ return '<td style="text-align:center;padding:6px 8px;font-size:12px;font-weight:700;color:var(--clay);">'+(n!=null?n:'—')+'</td>'; }).join('')
    +'<td style="text-align:center;padding:6px 8px;font-size:12px;font-weight:700;color:var(--clay);">'+(mitjanaClasseGlobal!=null?mitjanaClasseGlobal:'—')+'</td>'
  +'</tr>';

  html+=alumnes.map(function(al,ai){
    var n=notesPerAlumne[ai];
    return '<tr>'
      +'<td class="sticky" style="padding:8px 12px;"><div style="display:flex;align-items:center;gap:7px;">'+ava(al,26,10)+'<span style="font-weight:600;font-size:13.5px;">'+escHtml(al.nom)+'</span></div></td>'
      +n.notes_al.map(function(v){ return '<td style="text-align:center;padding:9px 8px;">'+renderNota(v)+'</td>'; }).join('')
      +'<td style="text-align:center;padding:9px 8px;background:var(--paper);">'+renderNota(n.global,true)+'</td>'
    +'</tr>';
  }).join('')+'</tbody></table></div>';
  document.getElementById('cv-act-body').innerHTML=html;
}

// ═══════════════ PROVA (competència fantasma) ═══════════════
// Una prova crea una activitat "bessona" a cada competència real seleccionada
// (2-3, totes de la mateixa assignatura), compartint "provaGroupId". La nota
// que hi posa el professor per a cada competència s'escriu a TOTS els seus
// criteris de forma uniforme — així la mitjana, el gràfic d'aranya i
// l'informe funcionen exactament igual que amb qualsevol altra activitat,
// sense necessitat de tocar cap d'aquests càlculs. "Prova" mai és una
// competència real: no té criteris propis i no compta en cap mitjana.
var _currentProvaGroupId='';
// El nom d'aquesta funcionalitat es tradueix segons l'idioma de l'assignatura
// activa (Angles->Exam, Castella->Prueba, la resta->Prova en catala).
var PROVA_I18N = {
  ca:{mot:'Prova',nova:'Nova prova',sense:'Sense proves.',crearNe:'Crear-ne una',crear:'Crear',cancelar:'Cancel·lar',
    comp:'Competències (selecciona 2 o més)',afegirComp:'+ Afegir competència',eliminar:'Eliminar prova',
    hintLlista:'Una prova reparteix una nota a diverses competències alhora — no compta com a competència pròpia.',
    hintGraella:'Posa una nota global per competència — s\'aplicarà a tots els seus criteris d\'avaluació.',
    eliminarTitle:'Eliminar prova',eliminaras:'Eliminaràs',perdran:'Es perdran totes les notes d\'aquesta prova a totes les competències implicades',
    siEliminar:'Sí, eliminar',afegirCompTitle:'Afegir competència a la prova',afegir:'Afegir',placeholderNom:'Ex: Examen trimestral...'},
  en:{mot:'Exam',nova:'New exam',sense:'No exams yet.',crearNe:'Create one',crear:'Create',cancelar:'Cancel',
    comp:'Competencies (select 2 or more)',afegirComp:'+ Add competency',eliminar:'Delete exam',
    hintLlista:'An exam gives one grade to several competencies at once — it never counts as its own competency.',
    hintGraella:'Enter one overall grade per competency — it will apply to all of its assessment criteria.',
    eliminarTitle:'Delete exam',eliminaras:'You will delete',perdran:'All grades for this exam will be lost for every competency involved',
    siEliminar:'Yes, delete',afegirCompTitle:'Add a competency to the exam',afegir:'Add',placeholderNom:'E.g: Term exam...'},
  es:{mot:'Prueba',nova:'Nueva prueba',sense:'Sin pruebas.',crearNe:'Crear una',crear:'Crear',cancelar:'Cancelar',
    comp:'Competencias (selecciona 2 o más)',afegirComp:'+ Añadir competencia',eliminar:'Eliminar prueba',
    hintLlista:'Una prueba reparte una nota a varias competencias a la vez — nunca cuenta como competencia propia.',
    hintGraella:'Pon una nota global por competencia — se aplicará a todos sus criterios de evaluación.',
    eliminarTitle:'Eliminar prueba',eliminaras:'Eliminarás',perdran:'Se perderán todas las notas de esta prueba en todas las competencias implicadas',
    siEliminar:'Sí, eliminar',afegirCompTitle:'Añadir una competencia a la prueba',afegir:'Añadir',placeholderNom:'Ej: Examen trimestral...'}
};
function provaLang(){
  var mc=mesCursos[estat.cursIdx]; var subj=mc&&mc.assigns?mc.assigns[estat.subjIdx]:'';
  var n=normTxt(subj);
  if(['angles','ingles','english'].indexOf(n)!==-1) return 'en';
  if(['castella','castellano','espanyol','espanol'].indexOf(n)!==-1) return 'es';
  return 'ca';
}
function pv(key){ return PROVA_I18N[provaLang()][key]; }
function getProves(){
  var grups={}, ordre=[];
  competencies.forEach(function(comp){
    getActs(comp.id).forEach(function(act){
      if(!act.provaGroupId) return;
      if(!grups[act.provaGroupId]){
        grups[act.provaGroupId]={groupId:act.provaGroupId,nom:act.nom,data:act.data,dataISO:act.dataISO,hora:act.hora,comps:[]};
        ordre.push(act.provaGroupId);
      }
      grups[act.provaGroupId].comps.push({comp:comp,act:act});
    });
  });
  return ordre.map(function(k){return grups[k];});
}
function obrirProves(){
  document.getElementById('cv-llista').style.display='none';
  document.getElementById('cv-proves').style.display='block';
  document.getElementById('cv-prova-graella').style.display='none';
  document.getElementById('cv-proves-title').textContent=pv('mot');
  document.getElementById('cv-proves-hint').textContent=pv('hintLlista');
  renderProvesList();
}
function renderProvesList(){
  var grups=getProves();
  var html='<div style="display:flex;justify-content:flex-end;margin-bottom:8px;">'
    +'<button class="btn btn-clay btn-sm" onclick="novaProva()">+ '+pv('nova')+'</button></div>';
  if(!grups.length){
    html+='<div style="padding:32px;text-align:center;color:var(--ink3);border:1.5px dashed var(--line2);border-radius:var(--rl);">'+pv('sense')+' <button class="btn btn-clay btn-sm" style="margin-left:6px;" onclick="novaProva()">'+pv('crearNe')+'</button></div>';
  }else{
    html+=grups.map(function(g){
      var noms=g.comps.map(function(x){return x.comp.nom;}).join(' + ');
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid var(--line);border-radius:var(--rl);margin-bottom:8px;cursor:pointer;" onclick="openProvaGraella(\''+g.groupId+'\')">'
        +'<div style="flex:1;">'
          +'<div style="font-size:14px;font-weight:700;">'+escHtml(g.nom)+'</div>'
          +'<div style="font-size:11px;color:var(--ink3);margin-top:2px;">'+escHtml(noms)+' · '+g.data+'</div>'
        +'</div>'
        +'<span style="color:var(--ink3);font-size:18px;">›</span>'
      +'</div>';
    }).join('');
  }
  document.getElementById('cv-proves-body').innerHTML=html;
}
function tancarNovaProva(){var e=document.getElementById('pop-nova-prova');if(e)e.remove();}
function novaProva(){
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-nova-prova';
  var today=new Date();
  var dd=('0'+today.getDate()).slice(-2); var mm=('0'+(today.getMonth()+1)).slice(-2); var yy=today.getFullYear();
  var iso=yy+'-'+mm+'-'+dd;
  var hh=('0'+today.getHours()).slice(-2); var min=today.getMinutes()<30?'00':'30';
  overlay.innerHTML='<div class="popup" style="width:400px;">'
    +'<div class="popup-head">'+pv('nova')+'</div>'
    +'<div class="fg"><label class="flbl">Nom</label><input class="input" id="nova-prova-nom" placeholder="'+pv('placeholderNom')+'"></div>'
    +'<div class="g2" style="gap:8px;">'
      +'<div class="fg"><label class="flbl">Dia</label><input class="input" type="date" id="nova-prova-dia" value="'+iso+'"></div>'
      +'<div class="fg"><label class="flbl">Hora</label><input class="input" type="time" id="nova-prova-hora" step="1800" value="'+hh+':'+min+'"></div>'
    +'</div>'
    +'<div class="fg"><label class="flbl">'+pv('comp')+'</label>'
      +'<div class="subj-chips" id="nova-prova-comps">'
        +competencies.map(function(c){return '<button type="button" class="subj-chip" data-cid="'+c.id+'" onclick="toggleProvaCompChip(this)">'+escHtml(c.nom)+'</button>';}).join('')
      +'</div>'
    +'</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="crearProva()">'+pv('crear')+'</button>'
      +'<button class="btn btn-ghost" onclick="tancarNovaProva()">'+pv('cancelar')+'</button>'
    +'</div></div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('nova-prova-nom');if(inp)inp.focus();},60);
}
function toggleProvaCompChip(btn){
  btn.classList.toggle('sel');
}
function crearProva(){
  var nomInp=document.getElementById('nova-prova-nom');
  var diaInp=document.getElementById('nova-prova-dia');
  var horaInp=document.getElementById('nova-prova-hora');
  var nom=nomInp?nomInp.value.trim():''; if(!nom){toast('Escriu el nom');return;}
  var dia=diaInp?diaInp.value.trim():''; if(!dia){toast('Selecciona el dia');return;}
  var hora=horaInp?horaInp.value.trim():'';
  if(hora && !/^([01]\d|2[0-3]):(00|30)$/.test(hora)){toast('L\'hora ha de ser en franges de :00 o :30');return;}
  var compIds=Array.from(document.querySelectorAll('#nova-prova-comps .subj-chip.sel')).map(function(el){return el.dataset.cid;});
  if(compIds.length<2){toast('Selecciona almenys 2 competències');return;}
  var data=dia.split('-').reverse().join('/')+(hora?' · '+hora:'');
  var ov=document.getElementById('pop-nova-prova'); if(ov) ov.remove();
  crearActivitatsProva('pv_'+Date.now(),compIds,nom,dia,hora,data);
}
function crearActivitatsProva(groupId,compIds,nom,dia,hora,data){
  var mc2=mesCursos[estat.cursIdx];
  var trim=trimestres[estat.trimIdx];
  var sb=window.__QUADERN_SUPABASE__;
  var assignaturaId=mc2&&mc2.assignsIds&&mc2.assignsIds[estat.subjIdx];
  var afegirLocal=function(compId,id,dbId){
    var act={id:id,dbId:dbId,nom:nom,data:data,dataISO:dia,hora:hora,notes:{},altres:{},notaAltres:{},provaGroupId:groupId};
    alumnes.forEach(function(al){act.notes[al.ini]={};act.altres[al.ini]='';act.notaAltres[al.ini]=null;});
    var k=getKey(compId); if(!activitats[k]) activitats[k]=[];
    activitats[k].push(act);
  };
  var tasks=compIds.map(function(compId){
    if(sb&&mc2&&mc2.id&&assignaturaId){
      return dbCrearActivitat(mc2.id,assignaturaId,compId,trim,nom,dia,hora,groupId).then(function(res){
        if(res.error){ toast('Error creant la prova: '+res.error.message); return; }
        afegirLocal(compId,res.data.id,res.data.id);
      });
    }
    afegirLocal(compId,compId+'_'+groupId);
    return Promise.resolve();
  });
  Promise.all(tasks).then(function(){
    sincronitzarActivitatAProgramacio(groupId,nom,dia,hora,mc2);
    guardarDades();
    actualitzarCompTiles();
    toast('"'+nom+'" creada ✓');
    obrirProves();
    setTimeout(function(){openProvaGraella(groupId);},60);
  });
}
function openProvaGraella(groupId){
  var g=getProves().find(function(x){return x.groupId===groupId;}); if(!g) return;
  _currentProvaGroupId=groupId;
  document.getElementById('cv-proves').style.display='none';
  document.getElementById('cv-prova-graella').style.display='block';
  document.getElementById('cv-pg-title').textContent=g.nom;
  document.getElementById('cv-pg-data').textContent=g.data;
  document.getElementById('cv-pg-hint').textContent=pv('hintGraella');
  document.getElementById('cv-pg-del-btn').textContent=pv('eliminar');
  var addBtn=document.getElementById('cv-pg-add-comp');
  addBtn.textContent=pv('afegirComp');
  addBtn.style.display = g.comps.length<competencies.length ? 'inline-flex' : 'none';

  var thead='<thead><tr style="background:var(--paper);">'
    +'<th class="sticky" style="min-width:150px;background:var(--paper);">Alumne</th>'
    +g.comps.map(function(x){
      return '<th style="min-width:130px;text-align:center;padding:9px 8px;white-space:normal;line-height:1.4;">'
        +'<span style="font-size:11px;color:var(--ink2);font-weight:700;">'+escHtml(x.comp.nom)+'</span></th>';
    }).join('')
    +'</tr></thead>';

  var tbody='<tbody>'+alumnes.map(function(al){
    return '<tr>'
      +'<td class="sticky" style="padding:7px 12px;"><div style="display:flex;align-items:center;gap:7px;">'+ava(al,26,10)+'<span style="font-weight:600;font-size:13.5px;">'+escHtml(al.nom)+'</span></div></td>'
      +g.comps.map(function(x){
        var v=notaMitjana(x.act,x.comp,al.ini);
        var id='pi_'+al.ini+'_'+x.comp.id;
        return '<td style="text-align:center;padding:5px 6px;">'
          +'<input type="number" id="'+id+'" class="nota-input '+(v!==null?notaClass(v):'')+'" value="'+(v!==null?v:'')+'" placeholder="—" min="0" max="10" step="0.1"'
          +' data-ini="'+al.ini+'" data-compid="'+x.comp.id+'" data-groupid="'+groupId+'"'
          +' onfocus="this.select()" onblur="saveNotaProva(this)" onkeydown="navNotaProva(event,this)">'
          +'</td>';
      }).join('')
    +'</tr>';
  }).join('')+'</tbody>';

  document.getElementById('cv-pg-table').innerHTML=thead+tbody;
}
function saveNotaProva(inp){
  var val=parseFloat(inp.value.toString().replace(',','.'));
  var ini=inp.dataset.ini; var compId=inp.dataset.compid; var groupId=inp.dataset.groupid;
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  var act=getActs(compId).find(function(a){return a.provaGroupId===groupId;}); if(!act) return;
  if(isNaN(val)||inp.value===''){
    if(act.notes[ini]) comp.criteris.forEach(function(crit){ delete act.notes[ini][crit]; });
    inp.value=''; inp.className='nota-input';
    guardarDades(); sincronitzarNotesActivitat(act);
    return;
  }
  val=Math.max(0,Math.min(10,Math.round(val*10)/10)); inp.value=val;
  if(!act.notes[ini]) act.notes[ini]={};
  comp.criteris.forEach(function(crit){ act.notes[ini][crit]=val; });
  inp.className='nota-input '+notaClass(val);
  guardarDades();
  sincronitzarNotesActivitat(act);
}
function obrirAfegirCompProva(){
  var groupId=_currentProvaGroupId;
  var g=getProves().find(function(x){return x.groupId===groupId;}); if(!g) return;
  var usats=g.comps.map(function(x){return x.comp.id;});
  var opcions=competencies.filter(function(c){return usats.indexOf(c.id)===-1;});
  if(!opcions.length){ toast('No hi ha més competències disponibles'); return; }
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-afegir-comp-prova';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div class="popup-head">'+pv('afegirCompTitle')+'</div>'
    +'<div class="fg"><label class="flbl">Competència</label>'
      +'<select class="input" id="afegir-comp-prova-sel">'
        +opcions.map(function(c){return '<option value="'+c.id+'">'+escHtml(c.nom)+'</option>';}).join('')
      +'</select>'
    +'</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="afegirCompAProva()">'+pv('afegir')+'</button>'
      +'<button class="btn btn-ghost" onclick="tancarAfegirCompProva()">'+pv('cancelar')+'</button>'
    +'</div></div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
}
function tancarAfegirCompProva(){var e=document.getElementById('pop-afegir-comp-prova');if(e)e.remove();}
function afegirCompAProva(){
  var groupId=_currentProvaGroupId;
  var g=getProves().find(function(x){return x.groupId===groupId;}); if(!g) return;
  var compId=document.getElementById('afegir-comp-prova-sel').value;
  var ov=document.getElementById('pop-afegir-comp-prova'); if(ov) ov.remove();
  var mc2=mesCursos[estat.cursIdx]; var trim=trimestres[estat.trimIdx]; var sb=window.__QUADERN_SUPABASE__;
  var assignaturaId=mc2&&mc2.assignsIds&&mc2.assignsIds[estat.subjIdx];
  var afegirLocal=function(id,dbId){
    var act={id:id,dbId:dbId,nom:g.nom,data:g.data,dataISO:g.dataISO,hora:g.hora,notes:{},altres:{},notaAltres:{},provaGroupId:groupId};
    alumnes.forEach(function(al){act.notes[al.ini]={};act.altres[al.ini]='';act.notaAltres[al.ini]=null;});
    var k=getKey(compId); if(!activitats[k]) activitats[k]=[];
    activitats[k].push(act);
    guardarDades();
    toast('Competència afegida ✓');
    openProvaGraella(groupId);
  };
  if(sb&&mc2&&mc2.id&&assignaturaId){
    dbCrearActivitat(mc2.id,assignaturaId,compId,trim,g.nom,g.dataISO,g.hora,groupId).then(function(res){
      if(res.error){ toast('Error afegint: '+res.error.message); return; }
      afegirLocal(res.data.id,res.data.id);
    });
  }else{
    afegirLocal(compId+'_'+groupId);
  }
}
function confirmarEliminarProva(){
  var groupId=_currentProvaGroupId;
  var g=getProves().find(function(x){return x.groupId===groupId;}); if(!g) return;
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-del-prova';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div style="font-size:32px;text-align:center;margin-bottom:10px;">⚠️</div>'
    +'<div class="popup-head" style="text-align:center;">'+pv('eliminarTitle')+'</div>'
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">'+pv('eliminaras')+': <b>'+escHtml(g.nom)+'</b></div>'
    +'<div style="font-size:12.5px;color:var(--clay);background:var(--clay-l);border-radius:var(--r);padding:10px 12px;margin-bottom:16px;text-align:center;line-height:1.6;">'+pv('perdran')+' ('+escHtml(g.comps.map(function(x){return x.comp.nom;}).join(', '))+').</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-danger" style="flex:1;background:var(--clay);color:#fff;border-color:var(--clay);" onclick="eliminarProvaConfirmat()">'+pv('siEliminar')+'</button>'
      +'<button class="btn" style="flex:1;" onclick="tancarDelProva()">'+pv('cancelar')+'</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
}
function tancarDelProva(){ var e=document.getElementById('pop-del-prova'); if(e) e.remove(); }
function eliminarProvaConfirmat(){
  var groupId=_currentProvaGroupId;
  var g=getProves().find(function(x){return x.groupId===groupId;}); if(!g) return;
  var sb=window.__QUADERN_SUPABASE__;
  var tasks=g.comps.map(function(x){
    var acts=getActs(x.comp.id);
    var idx=acts.findIndex(function(a){return a.provaGroupId===groupId;});
    if(idx===-1) return Promise.resolve();
    var act=acts[idx];
    acts.splice(idx,1);
    if(sb&&act.dbId) return dbEscriu(dbEliminarActivitat(act.dbId),'Error eliminant la prova');
    return Promise.resolve();
  });
  Promise.all(tasks).then(function(){
    tancarDelProva();
    guardarDades();
    toast('Prova eliminada');
    obrirProves();
  });
}

function saveNota(inp){
  var val=parseFloat(inp.value.toString().replace(',','.'));
  var ini=inp.dataset.ini; var ci=parseInt(inp.dataset.ci);
  var compId=inp.dataset.compid; var actId=inp.dataset.actid;
  var comp=competencies.find(function(c){return c.id===compId;});
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  if(isNaN(val)||inp.value===''){
    if(act.notes[ini]) delete act.notes[ini][comp.criteris[ci]];
    inp.value=''; inp.className='nota-input'; recalcGlobal(act,comp,ini); guardarDades();
    sincronitzarNotesActivitat(act);
    return;
  }
  val=Math.max(0,Math.min(10,Math.round(val*10)/10)); inp.value=val;
  if(!act.notes[ini]) act.notes[ini]={};
  act.notes[ini][comp.criteris[ci]]=val;
  inp.className='nota-input '+notaClass(val);
  recalcGlobal(act,comp,ini);
  guardarDades();
  sincronitzarNotesActivitat(act);
}
function sincronitzarNotesActivitat(act){
  var sb=window.__QUADERN_SUPABASE__;
  if(!sb||!act.dbId) return;
  trackSave(dbEscriu(dbActualitzarNotesActivitat(act.dbId,act.notes),'Error guardant la nota'));
}
function sincronitzarComentarisActivitat(act){
  var sb=window.__QUADERN_SUPABASE__;
  if(!sb||!act.dbId) return;
  trackSave(dbEscriu(dbActualitzarComentarisActivitat(act.dbId,act.altres),'Error guardant el comentari'));
}
function recalcGlobal(act,comp,ini){
  var t=0,c=0;
  comp.criteris.forEach(function(crit){var n=act.notes[ini]?act.notes[ini][crit]:null; if(n!=null){t+=n;c++;}});
  var g=c?Math.round(t/c*10)/10:null;
  var el=document.getElementById('global-'+ini); if(el) el.innerHTML=renderNota(g,true);
}
// Navegacio per teclat compartida entre les graelles de notes (criteris i
// proves): les files sempre son alumnes; "columnes" es la llista ordenada
// de claus de columna tal com s'han fet servir a l'id de cada input (indexs
// numerics 0..N-1 a la graella de criteris, ids de competencia a la de
// proves) — aixi la mateixa funcio serveix per a totes dues sense dependre
// de com es construeix cada id.
// Fletxes: mouen una cel·la i es queden quietes a la vora (com un full de
// calcul). Enter/Tab: com abans, sempre continuen (Tab salta de fila en
// arribar al final, Enter sempre baixa).
function navegarGraellaNotes(event,inp,prefix,columnes,colActual,saveFn){
  var TECLES=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Tab'];
  if(TECLES.indexOf(event.key)===-1) return;
  event.preventDefault(); saveFn(inp);
  var ini=inp.dataset.ini;
  var ai=alumnes.findIndex(function(a){return a.ini===ini;});
  var ci=columnes.indexOf(colActual);
  var nAi=ai,nCi=ci;
  if(event.key==='ArrowUp') nAi=ai-1;
  else if(event.key==='ArrowDown') nAi=ai+1;
  else if(event.key==='ArrowLeft') nCi=ci-1;
  else if(event.key==='ArrowRight') nCi=ci+1;
  else if(event.key==='Tab'){ if(ci+1<columnes.length){nCi=ci+1;} else {nAi=(ai+1)%alumnes.length; nCi=0;} }
  else if(event.key==='Enter'){ nAi=(ai+1)%alumnes.length; }
  if(nAi<0||nAi>=alumnes.length||nCi<0||nCi>=columnes.length) return;
  var next=document.getElementById(prefix+alumnes[nAi].ini+'_'+columnes[nCi]);
  if(next){next.focus();next.select();}
}
function navNota(event,inp){
  var ci=parseInt(inp.dataset.ci); var compId=inp.dataset.compid;
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  var columnes=comp.criteris.map(function(_,i){return i;});
  navegarGraellaNotes(event,inp,'ni_',columnes,ci,saveNota);
}
function navNotaProva(event,inp){
  var groupId=inp.dataset.groupid; var compId=inp.dataset.compid;
  var g=getProves().find(function(x){return x.groupId===groupId;}); if(!g) return;
  var columnes=g.comps.map(function(x){return x.comp.id;});
  navegarGraellaNotes(event,inp,'pi_',columnes,compId,saveNotaProva);
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
var _currentGraellaCompId='';
var _currentGraellaActId='';
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
  var mc2=mesCursos[estat.cursIdx];
  var trim=trimestres[estat.trimIdx];
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(id,dbId){
    var act={id:id,dbId:dbId,nom:nom,data:data,dataISO:dia,hora:hora,notes:{},altres:{},notaAltres:{}};
    alumnes.forEach(function(al){act.notes[al.ini]={};act.altres[al.ini]='';act.notaAltres[al.ini]=null;});
    var k=getKey(_novaActCompId); if(!activitats[k]) activitats[k]=[];
    activitats[k].push(act);
    sincronitzarActivitatAProgramacio(id,nom,dia,hora,mc2);
    guardarDades();
    actualitzarCompTiles();
    toast('"'+nom+'" creada ✓');
    openComp(_novaActCompId);
    setTimeout(function(){openGraella(_novaActCompId,id);},60);
  };
  var assignaturaId=mc2&&mc2.assignsIds&&mc2.assignsIds[estat.subjIdx];
  if(sb&&mc2&&mc2.id&&assignaturaId){
    dbCrearActivitat(mc2.id,assignaturaId,_novaActCompId,trim,nom,dia,hora).then(function(res){
      if(res.error){ toast('Error creant activitat: '+res.error.message); return; }
      acabar(res.data.id,res.data.id);
    });
  }else{
    acabar('a'+Date.now());
  }
}
// Publica l'activitat al calendari setmanal de Programacio (component React, iframe)
// inserint-la directament a la taula "cal_events" de Supabase — i despres avisa
// l'iframe amb postMessage (avisarProgramacioRefresc) perque es refresqui, ja que
// son dos "mons" separats (JS classic + React) que no comparteixen estat en memoria.
function sincronitzarActivitatAProgramacio(actId,nom,diaISO,hora,mc2){
  var sb=window.__QUADERN_SUPABASE__; if(!sb) return;
  var dataObj=new Date(diaISO+'T00:00:00');
  if(isNaN(dataObj.getTime())) return;
  var dow=(dataObj.getDay()+6)%7; // 0=Dilluns...6=Diumenge
  if(dow>4) return; // Programacio nomes mostra Dl-Dv
  var horaIdx=0;
  if(hora){
    var hp=hora.split(':'); var minTotal=parseInt(hp[0],10)*60+parseInt(hp[1],10);
    if(minTotal>=480 && minTotal<1020) horaIdx=Math.floor((minTotal-480)/30);
  }
  // Maxim 2 activitats/esdeveniments per franja de mitja hora del mateix dia
  // (compten tant els fixos de cada setmana com els d'aquest dia concret).
  sb.from('cal_events').select('id',{count:'exact',head:true})
    .eq('professor_id',dbUid()).eq('dia_setmana',dow).eq('franja_hora',horaIdx)
    .or('data.is.null,data.eq.'+diaISO)
    .then(function(cnt){
      if(cnt.error){ console.warn('[Arrel]',cnt.error.message); return; }
      if((cnt.count||0)>=2){ toast('Aquesta franja horària ja té 2 activitats/esdeveniments — no s\'ha afegit a Programació'); return; }
      var subjNom=mc2&&mc2.assigns?mc2.assigns[estat.subjIdx]:'';
      sb.from('cal_events').insert({
        professor_id:dbUid(), nota:nom+(subjNom?' ('+subjNom+')':''), dia_setmana:dow, franja_hora:horaIdx,
        data:diaISO, hora:hora||null, tipus:'moss', origen:'activitat', curs_nom:mc2?mc2.curs:''
      }).then(function(res){
        if(res.error){ console.warn('[Arrel]',res.error.message); return; }
        avisarProgramacioRefresc();
      });
    });
}
// El calendari de Programacio viu en un iframe (component React independent)
// que nomes carrega els events de Supabase un cop, en muntar-se — no te cap
// manera de saber que aquest "mon" (JS classic) acaba d'inserir-ne un de nou.
// Li avisem amb postMessage perque es torni a carregar sense obligar a
// recarregar tota la pagina.
function avisarProgramacioRefresc(){
  var f=document.getElementById('programacio-react-frame');
  if(f&&f.contentWindow) f.contentWindow.postMessage({type:'arrel:refresc-cal-events'},'*');
}

function tancarComentariAct(){var e=document.getElementById('pop-comentari-act');if(e)e.remove();}
function obrirComentariActBtn(btn){obrirComentariAct(btn.dataset.ini,btn.dataset.act,btn.dataset.comp);}
function obrirComentariAct(ini, actId, compId){
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  var al=alumnes.find(function(a){return a.ini===ini;}); if(!al) return;
  if(!act.altres) act.altres={};
  var actual=act.altres[ini]||'';
  tancarComentariAct(); // evita que quedin dos popups (i dos textarea amb el mateix id) superposats
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-comentari-act';
  overlay.innerHTML='<div class="popup" style="width:460px;max-height:86vh;overflow:auto;">'
    +'<div class="popup-title">'+escHtml(act.nom)+'</div>'
    +'<div class="popup-head">Comentari — '+escHtml(al.nom)+'</div>'
    +'<div class="privacy-note">Aquest comentari s\'inclourà a l\'informe i pot ser tractat per tercers per generar-lo. No hi introdueixis dades personals (telèfons, adreces, dades mèdiques, etc.).</div>'
    +'<textarea class="input" id="comentari-act-text" rows="9" style="min-height:190px;line-height:1.55;" placeholder="Observacions, comportament, aspectes de millora...">'+escHtml(actual)+'</textarea>'
    +'<div style="display:flex;gap:8px;margin-top:10px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="guardarComentariActBtn(this)" data-ini="'+ini+'" data-act="'+actId+'" data-comp="'+compId+'">Guardar</button>'
      +'<button class="btn btn-ghost" onclick="tancarComentariAct()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var t=document.getElementById('comentari-act-text');if(t)t.focus();},60);
}
function guardarComentariActBtn(btn){guardarComentariAct(btn.dataset.ini,btn.dataset.act,btn.dataset.comp);}
function guardarComentariAct(ini,actId,compId){
  // Captura el text i tanca el popup ABANS de qualsevol altra cosa: si el guardat
  // (cerca de l'activitat, localStorage, Supabase...) falla o triga, el popup ha de
  // desapareixer igualment — no ha de dependre de que tot surti be per tancar-se.
  var textEl=document.getElementById('comentari-act-text');
  var text=textEl?textEl.value:'';
  var ov=document.getElementById('pop-comentari-act'); if(ov) ov.remove();
  var act=getActs(compId).find(function(a){return a.id===actId;});
  if(!act){ console.warn('[Arrel] No s\'ha trobat l\'activitat per guardar el comentari'); return; }
  if(!act.altres) act.altres={};
  act.altres[ini]=text;
  guardarDades();
  sincronitzarComentarisActivitat(act);
  openGraella(compId,actId);
  toast('Comentari guardat ✓');
}

// ═══════════════ PROGRAMACIÓ - CALENDARI ═══════════════
// Programació viu sencer al component React de l'iframe (carregat de forma
// fixa a quadern.html) — aqui nomes cal assegurar que ja te "src" assignat.
function renderCal(){
  var reactFrame=document.getElementById('programacio-react-frame');
  if(reactFrame&&!reactFrame.getAttribute('src')) reactFrame.setAttribute('src','/programacio');
}

// ═══════════════ CONFIGURACIÓ ═══════════════
function cfgTab(btn,id){
  document.querySelectorAll('.cfg-tab').forEach(function(t){t.classList.remove('on');}); btn.classList.add('on');
  document.querySelectorAll('.cfg-section').forEach(function(s){s.classList.remove('on');});
  document.getElementById(id).classList.add('on');
  if(id==='cfg-rubrica') renderRubrica();
  if(id==='cfg-alumnes') renderCfgAlumnes();
}
function renderConfig(){ renderCfgAlumnes(); renderRubrica(); }

function renderCfgAlumnes(){
  var cnt=document.getElementById('alu-count'); if(cnt) cnt.textContent=alumnes.length;
  var el=document.getElementById('alu-list-cfg'); if(!el) return;
  el.innerHTML=alumnes.length?alumnes.map(function(al,i){
    var inactiu=al.actiu===false;
    return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);'+(inactiu?'opacity:.5;':'')+'">'
      +'<span style="font-size:11px;color:var(--ink3);font-weight:700;width:18px;flex-shrink:0;text-align:right;">'+(i+1)+'</span>'
      +ava(al,26,10)
      +(al.id?'<span style="font-size:10px;font-weight:700;color:var(--clay);background:var(--clay-l);padding:2px 6px;border-radius:4px;flex-shrink:0;">'+al.id+'</span>':'')
      +'<span style="flex:1;font-size:13px;font-weight:500;'+(inactiu?'text-decoration:line-through;':'')+'">'+escHtml(al.nom)+'</span>'
      +(inactiu?'<span style="font-size:10px;font-weight:700;color:var(--ink3);background:var(--paper);padding:2px 6px;border-radius:4px;flex-shrink:0;">Inactiu</span>':'')
      +'<button class="btn btn-sm" onclick="obrirEditarAlumne('+i+')">Editar</button>'
      +'<button class="btn btn-sm'+(inactiu?'':' btn-danger')+'" onclick="toggleActiuAlumne('+i+')">'+(inactiu?'Reactivar':'Inactiu')+'</button>'
    +'</div>';
  }).join(''):'<div style="color:var(--ink3);font-size:13px;padding:14px 0;text-align:center;">Sense alumnes</div>';
}
function addAlumneManual(){
  var inp=document.getElementById('inp-alu'); var nom=inp.value.trim();
  if(!nom){toast('Escriu el nom');return;}
  if(alumnes.find(function(a){return a.nom.toLowerCase()===nom.toLowerCase();})){toast('Ja existeix');return;}
  var ini=ini2(nom);
  var mc=mesCursos[estat.cursIdx];
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(dbId){
    alumnes.push({dbId:dbId,ini:ini,nom:nom,color:colorIdx(alumnes.length),comentaris:{}});
    inp.value=''; inp.focus(); guardarDades(); renderCfgAlumnes(); toast(nom+' afegit ✓');
  };
  if(sb&&mc&&mc.id){
    dbAfegirAlumne(mc.id,nom,alumnes.length+1).then(function(res){
      if(res.error){ toast('Error afegint: '+res.error.message); return; }
      acabar(res.data.id);
    });
  }else{
    acabar(undefined);
  }
}
function tancarEditarAlu(){var e=document.getElementById('pop-edit-alu');if(e)e.remove();}
function obrirEditarAlumne(idx){
  var al=alumnes[idx]; if(!al) return;
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-edit-alu';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div class="popup-head">Editar alumne</div>'
    +'<div class="fg"><label class="flbl">Nom i cognoms</label><input class="input" id="edit-alu-nom" value="'+escHtml(al.nom)+'" autocomplete="off"></div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-clay" style="flex:1;" onclick="guardarNomAlumne('+idx+')">Guardar</button>'
      +'<button class="btn btn-ghost" style="flex:1;" onclick="tancarEditarAlu()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(function(){var inp=document.getElementById('edit-alu-nom'); if(inp){inp.focus();inp.select();}},60);
}
function guardarNomAlumne(idx){
  var al=alumnes[idx]; if(!al) return;
  var nom=(document.getElementById('edit-alu-nom').value||'').trim();
  if(!nom){toast('Escriu el nom');return;}
  al.nom=nom; al.ini=ini2(nom);
  guardarDades();
  tancarEditarAlu();
  renderCfgAlumnes();
  toast('Alumne actualitzat ✓');
  var sb=window.__QUADERN_SUPABASE__;
  if(sb&&al.dbId){
    dbEscriu(dbActualitzarNomAlumne(al.dbId,nom),'Error guardant');
  }
}
// Baixa logica: mai s'elimina un alumne de la llista (splice) perque desplaçaria
// la posicio ("ordre") de tots els seguents, i aquesta posicio es el que fa
// servir l'informe conjunt per aparellar alumnes entre fitxers de professors
// diferents (veure comentari a dbCarregarAlumnes/schema.sql). Marcar-lo com a
// inactiu manté el seu lloc intacte.
function toggleActiuAlumne(idx){
  var al=alumnes[idx]; if(!al) return;
  al.actiu=al.actiu===false?true:false;
  guardarDades();
  renderCfgAlumnes();
  toast(al.actiu?'Alumne reactivat ✓':'Alumne marcat com a inactiu ✓');
  var sb=window.__QUADERN_SUPABASE__;
  if(sb&&al.dbId){
    dbEscriu(dbActualitzarActiuAlumne(al.dbId,al.actiu),'Error guardant');
  }
}
function handleDrop(e){ var f=e.dataTransfer.files[0]; if(f) processFile(f); }
function handleExcelFile(inp){ var f=inp.files[0]; if(f) processFile(f); inp.value=''; }
// Separa una linia de CSV en columnes. Excel en catala/castella exporta amb
// ";" (la "," s'usa pels decimals en aquests idiomes), altres eines fan
// servir ",". Si no troba cap dels dos, deixa la linia sencera com a unica
// columna (llistes d'un sol nom per linia, sense "cognom" separat).
function parseCSVLine(linia){
  var delim = linia.indexOf(';')!==-1 ? ';' : ',';
  return linia.split(delim).map(function(camp){
    return camp.trim().replace(/^"(.*)"$/,'$1').trim();
  });
}
function processFile(file){
  var fb=document.getElementById('excel-feedback'); fb.innerHTML='<div style="font-size:11px;color:var(--ink3);">Llegint...</div>';
  var ext=file.name.split('.').pop().toLowerCase();
  if(ext==='csv'){var r=new FileReader();r.onload=function(e){processRows(e.target.result.split(/\r?\n/).map(parseCSVLine));};r.readAsText(file,'UTF-8');return;}

  // Es serveix des del propi domini (public/xlsx.full.min.js), no d'un CDN
  // extern — perque un tallafocs/xarxa que bloquegi dominis de tercers
  // (comu en centres educatius) no trenqui la importacio d'Excel.
  if(typeof XLSX==='undefined'){var s=document.createElement('script');s.src='/xlsx.full.min.js?v='+(window.__QUADERN_ASSET_VERSION__||'');s.onload=function(){readXLSX(file);};s.onerror=function(){fb.innerHTML='<div style="color:var(--clay);">Error carregant la llibreria d\'Excel. Prova amb CSV.</div>';};document.head.appendChild(s);}
  else{readXLSX(file);}
}
function readXLSX(file){var r=new FileReader();r.onload=function(e){try{var wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});var ws=wb.Sheets[wb.SheetNames[0]];processRows(XLSX.utils.sheet_to_json(ws,{header:1,defval:''}));}catch(err){document.getElementById('excel-feedback').innerHTML='<div style="color:var(--clay);">Error: '+err.message+'</div>';}};r.readAsArrayBuffer(file);}
// Files que probablement NO son un alumne (nom del centre, curs, capcalera
// repetida...) — es proposen ja desmarcades a la previsualitzacio, pero mai
// es descarten soles: el professor sempre les pot tornar a marcar. Cal
// revisio manual perque cada centre escriu aquestes files de manera
// diferent i una llista fixa de paraules mai les cobriria totes.
function semblaMetadadaNoAlumne(nom){
  if(/:/.test(nom)) return true;
  if(/\b(19|20)\d{2}\b/.test(nom)) return true; // any (curs 2025-2026...)
  if(nom.split(/\s+/).length>5) return true;
  if(/centre|escola|col.legi|colegio|institut|\bies\b|\bcurs\b|\bcurso\b|classe\b|grup\b|generat|llistat|tutor|tutora|mestre|professor/i.test(nom)) return true;
  return false;
}
// Estat temporal de la previsualitzacio d'importacio, pendent que el
// professor confirmi (o cancel·li) quines files son alumnes de veritat.
var importPendent=null;
function processRows(rows){
  var dups=0;
  var candidats=[];
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
    var jaExisteix=alumnes.find(function(a){return a.nom.toLowerCase()===nomComplet.toLowerCase();})
      ||candidats.find(function(c){return c.nom.toLowerCase()===nomComplet.toLowerCase();});
    if(jaExisteix){dups++;return;}
    candidats.push({nom:nomComplet,dubtos:semblaMetadadaNoAlumne(nomComplet)});
  });
  var fb=document.getElementById('excel-feedback');
  if(!candidats.length){
    fb.innerHTML='<div style="padding:8px 10px;background:var(--paper);color:var(--ink3);border-radius:var(--r);font-size:12px;">Cap alumne nou'+(dups?' · '+dups+' duplicats':'')+'</div>';
    return;
  }
  fb.innerHTML='';
  obrirPreviewImportacio(candidats,dups);
}
function obrirPreviewImportacio(candidats,dups){
  tancarPreviewImportacio();
  importPendent=candidats;
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-import-preview'; overlay.style.zIndex='700';
  overlay.innerHTML='<div class="popup" style="width:460px;max-height:86vh;overflow:auto;">'
    +'<div class="popup-title">Importar alumnes</div>'
    +'<div class="popup-head">Revisa la llista abans de confirmar</div>'
    +'<div class="order-note">L\'ordre d\'aquesta llista ha de ser exactament el mateix per a tots els professors del curs. No reordenis res — només desmarca les files que NO siguin un alumne (com el nom del centre o del curs). Les que ja queden desmarcades són un suggeriment, revisa-les igualment.</div>'
    +'<div id="import-preview-list"></div>'
    +(dups?'<div style="font-size:11px;color:var(--ink3);margin-top:6px;">'+dups+' duplicat(s) ja existent(s), omesos automàticament.</div>':'')
    +'<div style="display:flex;gap:8px;margin-top:12px;">'
      +'<button class="btn btn-clay" style="flex:1;" id="btn-confirmar-import" onclick="confirmarImportacio()">Importar</button>'
      +'<button class="btn btn-ghost" onclick="tancarPreviewImportacio()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)tancarPreviewImportacio();};
  document.body.appendChild(overlay);
  renderPreviewImportacioLlista();
}
function renderPreviewImportacioLlista(){
  var cont=document.getElementById('import-preview-list'); if(!cont||!importPendent) return;
  cont.innerHTML=importPendent.map(function(c,i){
    return '<label class="import-preview-row">'
      +'<input type="checkbox" data-idx="'+i+'" '+(c.dubtos?'':'checked')+' onchange="actualitzarComptadorImport()">'
      +'<span style="flex:1;'+(c.dubtos?'color:var(--clay);':'')+'">'+escHtml(c.nom)+'</span>'
      +(c.dubtos?'<span class="import-preview-flag">no sembla un alumne</span>':'')
    +'</label>';
  }).join('');
  actualitzarComptadorImport();
}
function actualitzarComptadorImport(){
  var n=document.querySelectorAll('#import-preview-list input[type=checkbox]:checked').length;
  var btn=document.getElementById('btn-confirmar-import');
  if(btn) btn.textContent='Importar ('+n+')';
}
function tancarPreviewImportacio(){
  var e=document.getElementById('pop-import-preview'); if(e) e.remove();
  importPendent=null;
}
function confirmarImportacio(){
  if(!importPendent) return;
  var checkboxes=document.querySelectorAll('#import-preview-list input[type=checkbox]');
  var seleccionats=[];
  checkboxes.forEach(function(cb){ if(cb.checked) seleccionats.push(importPendent[parseInt(cb.dataset.idx,10)]); });
  tancarPreviewImportacio();
  var fb=document.getElementById('excel-feedback');
  if(!seleccionats.length){ fb.innerHTML=''; toast('Cap alumne seleccionat'); return; }
  var mc=mesCursos[estat.cursIdx];
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(nousAlumnes){
    nousAlumnes.forEach(function(al){ alumnes.push(al); });
    guardarDades();
    renderCfgAlumnes();
    fb.innerHTML='<div style="padding:8px 10px;background:var(--moss-l);color:var(--moss);border-radius:var(--r);font-size:12px;font-weight:500;">✓ '+nousAlumnes.length+' importats</div>';
    toast(nousAlumnes.length+' alumnes importats ✓');
  };
  if(sb&&mc&&mc.id){
    var base=alumnes.length;
    var files=seleccionats.map(function(c,i){ return {curs_id:mc.id,professor_id:dbUid(),nom:c.nom,ordre:base+i+1}; });
    sb.from('alumnes').insert(files).select().then(function(res){
      if(res.error){ toast('Error important: '+res.error.message); return; }
      var nousAlumnes=res.data.map(function(row,i){
        return {dbId:row.id,id:'',ini:ini2(row.nom),nom:row.nom,color:colorIdx(base+i),comentari:''};
      });
      acabar(nousAlumnes);
    });
  }else{
    var nousAlumnes=seleccionats.map(function(c,i){
      return {id:'',ini:ini2(c.nom),nom:c.nom,color:colorIdx(alumnes.length+i)};
    });
    acabar(nousAlumnes);
  }
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
      delBtn.onclick = (function(cid, idx){ return function(){ confirmarEliminarCriteri(cid, idx); }; })(comp.id, ci);
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
  guardarDades();
  dbGuardarRubricaCustom(compId);
  toast('Guardat ✓');
}
function editarNomCriteri(inp){
  var comp=competencies.find(function(c){return c.id===inp.dataset.compid;}); if(!comp) return;
  comp.criteris[parseInt(inp.dataset.ci)]=inp.value;
  guardarDades();
  dbGuardarRubricaCustom(inp.dataset.compid);
}
function afegirCriteri(compId){
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  comp.criteris.push('Nou criteri');
  if(!rubrica[compId]) rubrica[compId]=[];
  rubrica[compId].push({'1-4':'','5-6':'','7-8':'','9-10':''});
  guardarDades();
  dbGuardarRubricaCustom(compId);
  renderRubrica(); toast('Criteri afegit ✓');
}
function tancarDelCriteri(){var e=document.getElementById('pop-del-criteri');if(e)e.remove();}
function confirmarEliminarCriteri(compId,ci){
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  if(comp.criteris.length<=1){toast('Cal tenir almenys un criteri');return;}
  var nom=comp.criteris[ci];
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-del-criteri';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div style="font-size:32px;text-align:center;margin-bottom:10px;">⚠️</div>'
    +'<div class="popup-head" style="text-align:center;">Eliminar criteri</div>'
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">Eliminaràs: <b>'+escHtml(nom)+'</b></div>'
    +'<div style="font-size:12.5px;color:var(--clay);background:var(--clay-l);border-radius:var(--r);padding:10px 12px;margin-bottom:16px;text-align:center;line-height:1.6;">Un cop eliminat, aquest apartat de la rúbrica es perdrà per sempre i no es podrà recuperar.</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-danger" style="flex:1;background:var(--clay);color:#fff;border-color:var(--clay);" onclick="eliminarCriteri(\''+compId+'\','+ci+')">Sí, eliminar</button>'
      +'<button class="btn" style="flex:1;" onclick="tancarDelCriteri()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
}
function eliminarCriteri(compId,ci){
  var ov=document.getElementById('pop-del-criteri'); if(ov) ov.remove();
  var comp=competencies.find(function(c){return c.id===compId;}); if(!comp) return;
  if(comp.criteris.length<=1){toast('Cal tenir almenys un criteri');return;}
  comp.criteris.splice(ci,1);
  if(rubrica[compId]) rubrica[compId].splice(ci,1);
  guardarDades();
  dbGuardarRubricaCustom(compId);
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
      +'<button class="btn btn-ghost" onclick="tancarJSONNom()">Cancel·lar</button>'
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
      return {id:al.id||'',ini:al.ini,nom:al.nom,global:global,competencies:notesPerComp,comentari:comentariAlumne(al,subj)};
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
  cont+='<h1>SeJus — '+escHtml(subj)+'</h1>';
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
    cont+='<td style="font-size:10px;color:#666;">'+escHtml(comentariAlumne(al,subj))+'</td></tr>';
  });
  cont+='</tbody></table>';
  cont+='<p style="margin-top:20px;color:#aaa;font-size:10px;">Generat amb SeJus · '+new Date().toLocaleDateString('ca-ES')+'</p>';
  cont+='</body></html>';
  var blob=new Blob([cont],{type:'text/html'});
  var url=URL.createObjectURL(blob);
  var win=window.open(url,'_blank');
  if(win){
    win.addEventListener('load',function(){ win.print(); });
  }
  setTimeout(function(){URL.revokeObjectURL(url);},5000);
  toast('Informe obert ✓ — al diàleg d\'impressió tria "Desar com a PDF"');
}

// Informe JSON
var infJSONs=[];
var infPeticioActual=0;
// Igual que construirDadesInforme, pero llegint sempre les dades reals de Supabase per al
// curs/assignatura/trimestre indicats — no fa servir alumnes/activitats en memoria, que
// nomes reflecteixen el curs i l'assignatura que hi ha oberts en aquell moment a l'app.
// Cal per generar l'informe conjunt: es poden triar cursos/assignatures diferents als que
// s'estan veient a la pantalla principal.
function construirDadesInformeDB(mc, subj, trim, nomInforme){
  var sb=window.__QUADERN_SUPABASE__;
  if(!sb||!mc.id) return Promise.resolve(construirDadesInforme(mc,subj,trim,nomInforme));
  var assignaturaId=mc.assignsIds&&mc.assignsIds[mc.assigns.indexOf(subj)];
  if(!assignaturaId) return Promise.resolve(construirDadesInforme(mc,subj,trim,nomInforme));
  var comps=getCompetenciesForSubject(subj);
  return Promise.all([
    dbCarregarAlumnes(mc.id),
    sb.from('activitats').select('*').eq('curs_id',mc.id).eq('assignatura_id',assignaturaId).eq('trimestre',trim)
  ]).then(function(res){
    var alumnesDB=res[0]||[];
    var actsRows=(res[1]&&res[1].data)||[];
    var actsPerComp={};
    actsRows.forEach(function(row){
      if(!actsPerComp[row.competencia_id]) actsPerComp[row.competencia_id]=[];
      actsPerComp[row.competencia_id].push(row);
    });
    var alumnesOut=alumnesDB.map(function(al){
      var notesPerComp={};
      comps.forEach(function(comp){
        var rows=actsPerComp[comp.id]||[];
        var notesPerAct=rows.map(function(row){
          var notesRow=row.notes||{}; var notesAl=notesRow[al.ini]||{};
          var notesCriteris={}; comp.criteris.forEach(function(crit){notesCriteris[crit]=notesAl[crit]!=null?notesAl[crit]:null;});
          var t=0,c=0; comp.criteris.forEach(function(crit){var n=notesCriteris[crit]; if(n!=null){t+=n;c++;}});
          return {id:row.id,nom:row.nom,data:formatarDataActivitat(row.data,row.hora),notesCriteris:notesCriteris,mitjana:c?Math.round(t/c*10)/10:null,comentari:(row.comentaris||{})[al.ini]||''};
        });
        var tC=0,cC=0; notesPerAct.forEach(function(a){if(a.mitjana!=null){tC+=a.mitjana;cC++;}});
        notesPerComp[comp.id]={nom:comp.nom,activitats:notesPerAct,mitjana:cC?Math.round(tC/cC*10)/10:null};
      });
      var vals=Object.values(notesPerComp).map(function(c){return c.mitjana;}).filter(function(v){return v!==null;});
      var global=vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;
      return {id:al.dbId||'',ini:al.ini,nom:al.nom,global:global,competencies:notesPerComp,comentari:comentariAlumne(al,subj)};
    });
    return {versio:'1.0',exportat:new Date().toISOString(),nomInforme:nomInforme||mc.curs,professor:prof.nom,centre:prof.centre,any:prof.any,curs:mc.curs,trimestre:trim,assignatura:subj,alumnes:alumnesOut};
  });
}
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
  actualitzarLimitInformesUI();
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
  var trimSel=(document.getElementById('inf-trim-sel')||{}).value;
  var trimsAGenerar=trimSel?[trimSel]:trimestres; // etapa concreta, o els 3 trimestres si es "tot el curs"
  var titolInp=document.getElementById('inf-titol'); if(titolInp&&!titolInp.value) titolInp.value='Informe '+mc.curs;
  var dzTitol=document.getElementById('inf-dropzone-titol'); if(dzTitol) dzTitol.textContent='Puja aquí els JSON de la resta de professors de '+mc.curs;
  body.style.display='block';
  document.getElementById('inf-propi-info').innerHTML='Carregant les teves dades de '+escHtml(mc.curs)+'...';
  ['inf-gen-curt-btn','inf-gen-llarg-btn'].forEach(function(id){ var b=document.getElementById(id); if(b) b.disabled=true; });

  var peticio=++infPeticioActual; // evita que una crida antiga sobreescrigui una de mes nova (canvi rapid de curs/etapa)
  var tasks=[];
  mc.assigns.forEach(function(subj){
    trimsAGenerar.forEach(function(trim){
      tasks.push(construirDadesInformeDB(mc,subj,trim,mc.curs).then(function(dades){
        var key=mc.curs+'_'+trim+'_'+subj;
        infJSONs=infJSONs.filter(function(j){ return j.key!==key; });
        infJSONs.push({key:key,nom:'Les meves dades ('+subj+')',dades:dades,propi:true});
      }));
    });
  });
  Promise.all(tasks).then(function(){
    if(peticio!==infPeticioActual) return; // s'ha triat un altre curs/etapa mentre carregava
    document.getElementById('inf-propi-info').innerHTML='✓ Ja s\'han afegit les teves assignatures de <b>'+escHtml(mc.curs)+'</b> ('+escHtml(trimSel||'tot el curs')+'): '+escHtml(mc.assigns.join(', '))+'.';
    infRenderFitxers();
  }).catch(function(err){
    if(peticio!==infPeticioActual) return;
    toast('Error carregant les dades: '+err.message);
    infRenderFitxers();
  });
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
  var btns=['inf-gen-curt-btn','inf-gen-llarg-btn'].map(function(id){return document.getElementById(id);});
  if(!infJSONs.length){el.innerHTML='';btns.forEach(function(b){if(b)b.disabled=true;});return;}
  // Un fitxer que no sigui de la mateixa etapa seleccionada NO s'inclourà a l'informe
  // (l'informe es filtra per trimestre) — cal avisar-ho aquí, no nomes descobrir-ho
  // en veure l'informe generat sense aquella assignatura.
  var trimSel=(document.getElementById('inf-trim-sel')||{}).value;
  el.innerHTML=infJSONs.map(function(j,i){
    var d=j.dades;
    var noCoincideix=trimSel && d.trimestre && d.trimestre!==trimSel;
    return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);'+(noCoincideix?'opacity:.55;':'')+'">'
      +'<div style="flex:1;"><div style="font-size:12.5px;font-weight:600;">'+escHtml(d.assignatura||'?')
        +(j.propi?' <span class="pill p-moss" style="font-size:9px;margin-left:4px;">Propi</span>':'')+'</div>'
        +'<div style="font-size:11px;color:var(--ink3);">'+escHtml(d.curs||'')+(d.trimestre?' · '+escHtml(d.trimestre):'')+' · '+escHtml(d.professor||'')+'</div>'
        +(noCoincideix?'<div style="font-size:10.5px;color:var(--clay);font-weight:600;margin-top:2px;">⚠ No coincideix amb "'+escHtml(trimSel)+'" — no s\'inclourà a l\'informe</div>':'')
      +'</div>'
      +'<button class="btn btn-sm btn-danger" onclick="infJSONs.splice('+i+',1);infRenderFitxers()">✕</button>'
    +'</div>';
  }).join('');
  btns.forEach(function(b){if(b)b.disabled=false;});
}
// 1-4 No Assolit · 5-6 Assolit · 7-8 Assoliment notable · 9-10 Assoliment excel·lent
function qualificacioText(n){
  if(n===null||n===undefined) return '—';
  if(n<5) return 'No Assolit';
  if(n<7) return 'Assolit';
  if(n<9) return 'Assoliment notable';
  return 'Assoliment excel·lent';
}
// Gràfic d'aranya com a SVG inline (no depèn de canvas/toDataURL, es veu sempre
// en obrir l'informe en una pestanya nova, i s'imprimeix/exporta millor que un raster).
function spiderSvg(labels, datasets, colors, W, H){
  var n=labels.length; if(!n) return '';
  // Marge generos pels noms d'assignatura mes llargs (p.ex. "Educacio Fisica"),
  // que sino queden tallats fora del viewBox quan cauen al costat de l'eix
  // amb text-anchor "end" i s'estenen cap a fora en comptes de cap endins.
  var cx=W/2, cy=H/2, R=Math.min(W,H)/2-38;
  var angleStep=2*Math.PI/n;
  var svg='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  for(var g=2;g<=10;g+=2){
    var pts=[];
    for(var i=0;i<n;i++){ var a=angleStep*i-Math.PI/2; var r=R*(g/10); pts.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)); }
    svg+='<polygon points="'+pts.join(' ')+'" fill="none" stroke="#00000014" stroke-width="1"/>';
  }
  for(var i=0;i<n;i++){
    var a=angleStep*i-Math.PI/2;
    var x2=cx+R*Math.cos(a), y2=cy+R*Math.sin(a);
    svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="#00000022" stroke-width="1"/>';
    var lx=cx+(R+12)*Math.cos(a), ly=cy+(R+12)*Math.sin(a);
    var anchor=Math.abs(Math.cos(a))<0.35?'middle':(Math.cos(a)>0?'start':'end');
    // Els noms de mes d'una paraula es parteixen en 2 linies perque ocupin la
    // meitat d'ample — sino un nom llarg es surt del viewBox i queda invisible.
    var words=String(labels[i]||'').split(' ');
    var mid=Math.ceil(words.length/2);
    var lines=words.length>1?[words.slice(0,mid).join(' '),words.slice(mid).join(' ')]:[words[0]||''];
    svg+='<text x="'+lx.toFixed(1)+'" y="'+ly.toFixed(1)+'" font-size="7.5" font-weight="700" fill="#6E665E" text-anchor="'+anchor+'">';
    lines.forEach(function(line,li){
      svg+='<tspan x="'+lx.toFixed(1)+'" dy="'+(li===0?(lines.length>1?-4:2.5):9)+'">'+escHtml(line)+'</tspan>';
    });
    svg+='</text>';
  }
  var palette=['#B5562F','#566B47','#3C6B82'];
  datasets.forEach(function(data,di){
    var hex=colors&&colors[di]||palette[di]||palette[0];
    var pts=data.map(function(v,i){ var a=angleStep*i-Math.PI/2; var r=R*(Math.min(10,Math.max(0,v||0))/10); return (cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1); });
    svg+='<polygon points="'+pts.join(' ')+'" fill="'+hex+'33" stroke="'+hex+'" stroke-width="2"/>';
    data.forEach(function(v,i){ var a=angleStep*i-Math.PI/2; var r=R*(Math.min(10,Math.max(0,v||0))/10); var x=cx+r*Math.cos(a), y=cy+r*Math.sin(a); svg+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.5" fill="'+hex+'"/>'; });
  });
  svg+='</svg>';
  return svg;
}
// Calcula totes les dades de l'informe conjunt (comuna a la vista, l'exportacio a
// Word/Google Docs i l'exportacio a PDF), perque totes surtin identiques.
function prepararDadesInforme(){
  var trimFilt=document.getElementById('inf-trim-sel').value;
  var jsonsFilt=trimFilt?infJSONs.filter(function(j){return j.dades.trimestre===trimFilt;}):infJSONs;
  if(!jsonsFilt.length){toast('Cap fitxer');return null;}
  var exclosos=trimFilt?infJSONs.filter(function(j){return j.dades.trimestre!==trimFilt;}):[];
  if(exclosos.length){
    toast(exclosos.length+' fitxer(s) no s\'han inclòs perquè no són de "'+trimFilt+'": '+exclosos.map(function(j){return j.dades.assignatura||j.nom;}).join(', '));
  }

  // Tots els fitxers han de ser del mateix curs: l'emparellament d'alumnes es fa
  // per ordre d'entrada (posicio 1,2,3...) dins la llista, no per nom ni codi,
  // aixi que nomes te sentit si tots venen de la mateixa llista de classe.
  var cursos=[]; jsonsFilt.forEach(function(j){ var c=j.dades.curs||''; if(cursos.indexOf(c)===-1) cursos.push(c); });
  if(cursos.length>1){ toast('Els fitxers són de cursos diferents ('+cursos.join(', ')+'). Han de ser tots del mateix curs.'); return null; }

  var titolInforme=(document.getElementById('inf-titol')||{}).value.trim()||'Informe de notes consolidades';
  var etapaText=trimFilt||'Informe de tot el curs';

  var alumnesMap={};
  // perTrimAssigns guarda cada trimestre per separat (a diferencia d'"assigns",
  // que nomes queda amb l'ultim que arriba per assignatura) — cal per a la IA
  // de l'informe final de curs, que ha de poder comparar l'evolucio 1r/2n/3r.
  var perTrimAssigns={};
  jsonsFilt.forEach(function(j){
    var d=j.dades;
    (d.alumnes||[]).forEach(function(al,idx){
      var uid=idx; // ordre d'entrada dins la llista de classe, no nom ni codi
      if(!alumnesMap[uid]) alumnesMap[uid]={ordre:idx+1,nom:al.nom,assigns:{}};
      alumnesMap[uid].assigns[d.assignatura]={nota:al.global,trim:d.trimestre,competencies:al.competencies||{},comentariProf:al.comentari||''};
      if(!perTrimAssigns[uid]) perTrimAssigns[uid]={};
      if(!perTrimAssigns[uid][d.assignatura]) perTrimAssigns[uid][d.assignatura]=[];
      perTrimAssigns[uid][d.assignatura].push({trimestre:d.trimestre,nota:al.global,competencies:al.competencies||{},comentariProf:al.comentari||''});
    });
  });
  var totsSubjs=[]; jsonsFilt.forEach(function(j){if(totsSubjs.indexOf(j.dades.assignatura)===-1)totsSubjs.push(j.dades.assignatura);});
  var ordres=Object.keys(alumnesMap).map(Number).sort(function(a,b){return a-b;});

  // Nota global de cada alumne (mitjana de les assignatures que te)
  var globalsAlu={};
  ordres.forEach(function(uid){
    var al=alumnesMap[uid]; var vals=[];
    totsSubjs.forEach(function(s){var n=al.assigns[s]?al.assigns[s].nota:null; if(n!=null) vals.push(n);});
    globalsAlu[uid]=vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;
  });
  var totsGlobals=ordres.map(function(uid){return globalsAlu[uid];}).filter(function(v){return v!=null;});
  var mitjanaClasse=totsGlobals.length?Math.round(totsGlobals.reduce(function(a,b){return a+b;},0)/totsGlobals.length*10)/10:null;

  // Mitjana de classe per assignatura (pel gràfic d'aranya de classe i la fila "Global")
  var subjClasseAvg={};
  totsSubjs.forEach(function(s){
    var vals=[]; ordres.forEach(function(uid){ var a=alumnesMap[uid].assigns[s]; if(a&&a.nota!=null) vals.push(a.nota); });
    subjClasseAvg[s]=vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;
  });
  // Mitjana de classe per competència de cada assignatura (per la taula de resum)
  var subjCompClasseAvg={};
  jsonsFilt.forEach(function(j){
    var d=j.dades; var acc={};
    (d.alumnes||[]).forEach(function(al){
      var comps=al.competencies||{};
      Object.keys(comps).forEach(function(ck){
        var c=comps[ck]; if(!acc[ck]) acc[ck]={nom:c.nom,sum:0,count:0};
        if(c.mitjana!=null){ acc[ck].sum+=c.mitjana; acc[ck].count++; }
      });
    });
    subjCompClasseAvg[d.assignatura]=Object.keys(acc).map(function(ck){ var a=acc[ck]; return {nom:a.nom,mitjana:a.count?Math.round(a.sum/a.count*10)/10:null}; }).filter(function(c){ return c.mitjana!=null; });
  });

  return {
    titolInforme:titolInforme, etapaText:etapaText, etapa:(trimFilt?'trimestre':'curs'), curs:cursos[0]||'',
    alumnesMap:alumnesMap, ordres:ordres, totsSubjs:totsSubjs, perTrimAssigns:perTrimAssigns,
    globalsAlu:globalsAlu, mitjanaClasse:mitjanaClasse,
    subjClasseAvg:subjClasseAvg, subjCompClasseAvg:subjCompClasseAvg
  };
}
// Crida /api/generar-comentaris amb les dades de prepararDadesInforme() i retorna
// {comentariClasse, comentaris:{uid:text}}. Si l'API falla, retorna null (l'informe
// es genera igualment, amb els blocs de comentari IA buits).
//
// PRIVACITAT: cap nom d'alumne surt mai de l'aplicació. A Anthropic només s'hi envia
// el "numero" de llista (posicio 1,2,3... dins la classe) — mai al.nom. El mapeig
// numero->nom real es fa nomes en local, en rebre la resposta.
function generarComentarisIA(d, mode){
  // Cada activitat pot tenir el seu propi comentari del professor (no nomes el
  // comentari general de l'alumne) — es envia a la IA, es informacio valuosa
  // que el professor ja ha escrit i que no s'ha de perdre.
  function compsAmbObservacions(competencies){
    return Object.keys(competencies||{}).map(function(ck){
      var c=competencies[ck];
      var comentarisAct=(c.activitats||[]).map(function(act){ return (act.comentari||'').trim(); }).filter(function(t){return t;});
      return {nom:c.nom,mitjana:c.mitjana,comentarisActivitats:comentarisAct};
    }).filter(function(c){ return c.mitjana!=null; }); // exclou competències sense cap nota introduïda
  }
  var alumnesPayload=d.ordres.map(function(uid){
    var al=d.alumnesMap[uid];
    // assignatures amb els trimestres per separat (1 sol element en un informe
    // de trimestre, fins a 3 en un informe final de curs) perque la IA pugui
    // comparar l'evolucio en lloc de rebre nomes un valor ja fusionat.
    var perTrim=d.perTrimAssigns[uid]||{};
    var assignatures=Object.keys(perTrim).map(function(subj){
      var trimestres=perTrim[subj].map(function(entrada){
        return {trimestre:entrada.trimestre,mitjana:entrada.nota,comentariProfessor:entrada.comentariProf||'',competencies:compsAmbObservacions(entrada.competencies)};
      }).filter(function(t){ return t.mitjana!=null; }); // exclou l'assignatura del trimestre si l'alumne no hi te cap nota
      return trimestres.length?{nom:subj,trimestres:trimestres}:null;
    }).filter(function(a){ return a; }); // exclou l'assignatura sencera si no hi ha cap nota a cap trimestre
    return {uid:uid,numero:al.ordre,global:d.globalsAlu[uid],assignatures:assignatures};
  });

  var payload={
    etapa:d.etapa, curs:d.curs, mode:(mode==='llarg'?'llarg':'curt'),
    classe:{
      mitjana:d.mitjanaClasse,
      subjectes:d.totsSubjs.map(function(s){return {nom:s,mitjana:d.subjClasseAvg[s]};}),
      alumnesResum:alumnesPayload.map(function(a){return {numero:a.numero,global:a.global};})
    },
    alumnes:alumnesPayload.map(function(a){return {numero:a.numero,global:a.global,assignatures:a.assignatures};})
  };

  var sb=window.__QUADERN_SUPABASE__;
  var tokenPromise=sb?sb.auth.getSession().then(function(r){ return r.data&&r.data.session&&r.data.session.access_token; }):Promise.resolve(null);
  return tokenPromise.then(function(token){
    var headers={'Content-Type':'application/json'};
    if(token) headers['Authorization']='Bearer '+token;
    return fetch('/api/generar-comentaris',{method:'POST',headers:headers,body:JSON.stringify(payload)});
  })
    .then(function(res){ if(!res.ok) throw new Error('HTTP '+res.status); return res.json(); })
    .then(function(json){
      // El servidor nomes retorna 200 si TOTS els comentaris (classe + cada
      // alumne) s'han generat be — si algun ha fallat, respon amb error i
      // aqui es tracta igual que qualsevol altre fallo (vegeu .catch): es
      // prefereix cap comentari IA abans que un informe a mitges.
      var comentaris={};
      d.ordres.forEach(function(uid){
        var numero=d.alumnesMap[uid].ordre;
        comentaris[uid]=(json.comentaris||{})[String(numero)]||'';
      });
      return {comentariClasse:json.comentariClasse||'',comentaris:comentaris};
    })
    .catch(function(err){
      console.warn('[Arrel] Error generant comentaris IA:',err.message);
      toast('No s\'han pogut generar els comentaris amb IA — l\'informe es generarà sense ells. Torna-ho a provar en uns minuts.');
      return null;
    });
}

// Aplica el límit de 4 informes amb IA per any escolar (tots els cursos junts)
// abans de trucar generarComentarisIA(). Si s'ha arribat al límit, no es crida
// la IA (l'informe es genera igualment, sense comentaris). Si la crida té èxit,
// es registra a informes_generats perquè compti pel límit.
var LIMIT_INFORMES_IA=4;
function generarComentarisIAAmbLimit(d, mode){
  // En mode desenvolupament (npm run dev, mai en producció) el límit no
  // s'aplica ni es registra — les proves del desenvolupador no han de
  // gastar el límit real dels professors.
  if(window.__QUADERN_DEV_MODE__) return generarComentarisIA(d, mode);
  return dbComptarInformesGenerats().then(function(count){
    if(count>=LIMIT_INFORMES_IA){
      toast('Has arribat al límit de '+LIMIT_INFORMES_IA+' informes amb IA per aquest any escolar — l\'informe es generarà sense comentaris IA');
      return null;
    }
    return generarComentarisIA(d, mode).then(function(comentarisIA){
      if(comentarisIA) dbEscriu(dbRegistrarInformeGenerat(),'Error registrant l\'informe generat').then(actualitzarLimitInformesUI);
      return comentarisIA;
    });
  });
}
// Mostra a la pantalla "Generar informe" quants informes amb IA queden aquest
// any escolar (o l'avís d'haver arribat al límit).
function actualitzarLimitInformesUI(){
  var el=document.getElementById('inf-limit-info'); if(!el) return;
  if(window.__QUADERN_DEV_MODE__){ el.textContent='Mode desenvolupament: límit d\'informes IA desactivat.'; return; }
  dbComptarInformesGenerats().then(function(count){
    var restants=LIMIT_INFORMES_IA-count;
    el.textContent=restants>0
      ? 'Et queden '+restants+' de '+LIMIT_INFORMES_IA+' informes amb IA aquest curs escolar.'
      : 'Has arribat al límit de '+LIMIT_INFORMES_IA+' informes amb IA aquest curs escolar — els informes es generaran sense comentaris.';
  });
}

// Construeix l'HTML de l'informe a partir de les dades de prepararDadesInforme().
// renderChart(labels,datasets,colors,W,H) genera el gràfic d'aranya — SVG per veure
// l'informe al navegador, o una imatge PNG quan cal exportar a Word/Google Docs
// (el visor HTML de Word no interpreta SVG incrustat). comentarisIA (opcional) ve de
// generarComentarisIA(): {comentariClasse, comentaris:{uid:text}}.
function generarInformeHTML(d, renderChart, comentarisIA){
  // contenteditable="true": el professor pot clicar i corregir el text abans
  // d'imprimir/exportar — els canvis queden al PDF/HTML final. La vora discontínua
  // (només visible en pantalla, no en imprimir) marca que és una zona editable.
  function comentIA(text){
    if(text) return '<div class="ia-comment" contenteditable="true" style="border:1.5px dashed #B5562F;border-radius:8px;padding:8px 10px;margin-top:8px;font-size:10.5px;color:#444;white-space:pre-line;">'+escHtml(text)+'</div>';
    return '<div class="ia-comment" contenteditable="true" style="border:1.5px dashed #C9BFA9;border-radius:8px;padding:8px 10px;margin-top:8px;font-size:10.5px;color:#999;font-style:italic;">Escriu aquí el comentari…</div>';
  }
  var COMENT_IA_HTML=comentIA(comentarisIA&&comentarisIA.comentariClasse);

  var cont='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+escHtml(d.titolInforme)+'</title><style>'
    +'body{font-family:Arial,sans-serif;padding:20px;font-size:11px;color:#222;}'
    +'table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:5px 7px;}'
    +'th{background:#f0ece4;font-size:9px;text-transform:uppercase;font-weight:700;text-align:center;}'
    +'h1{font-size:17px;margin-bottom:2px;}h2{font-size:13px;margin:16px 0 6px;border-bottom:2px solid #B5562F;padding-bottom:3px;}'
    +'.meta{color:#666;font-size:11px;margin-bottom:14px;}.meta b{color:#222;}'
    +'.q{font-size:8.5px;color:#888;display:block;}'
    +'.stu{border:1px solid #ddd;border-radius:6px;padding:8px 10px;margin-bottom:10px;page-break-inside:avoid;break-inside:avoid;}'
    +'.pagebreak{page-break-before:always;break-before:page;}'
    +'.stu + .stu{page-break-before:always;break-before:page;}'
    +'.ia-comment{outline:none;}'
    +'.edit-hint{background:#FBEAE0;color:#B5562F;font-size:10.5px;padding:6px 10px;border-radius:8px;margin-bottom:12px;}'
    +'@media print{body{padding:8px;}.ia-comment{border:none !important;padding:0 !important;}.edit-hint{display:none;}}'
    +'</style></head><body>';

  cont+='<div class="edit-hint">✏️ Pots clicar i editar el text dels comentaris IA (contorn discontinu) abans d\'imprimir o exportar. '
    +'<button onclick="window.print()" style="margin-left:8px;border:none;background:#B5562F;color:#fff;border-radius:6px;padding:4px 10px;font-size:10.5px;cursor:pointer;">🖨️ Imprimir / Desar com a PDF</button>'
    +' Aquest avís no sortirà al PDF.</div>';
  cont+='<h1>'+escHtml(d.titolInforme)+'</h1>';
  cont+='<div class="meta"><b>Curs:</b> '+escHtml(d.curs||'—')+' &nbsp;·&nbsp; <b>Any escolar:</b> '+escHtml(prof.any||'—')
    +' &nbsp;·&nbsp; <b>Tutor/a:</b> '+escHtml(prof.nom||'—')+' &nbsp;·&nbsp; <b>Etapa:</b> '+escHtml(d.etapaText)
    +' &nbsp;·&nbsp; Generat: '+new Date().toLocaleDateString('ca-ES')+'</div>';

  // ── Resum de classe ── assignatura → competència (mitjana de classe) → global
  cont+='<h2>Resum de classe</h2>';
  cont+='<div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">';
  var taulaClasse='<table style="flex:1;min-width:260px;"><thead><tr><th style="text-align:left;">Assignatura</th><th style="text-align:left;">Competència</th><th>Mitjana de classe</th></tr></thead><tbody>';
  d.totsSubjs.forEach(function(s){
    var comps=d.subjCompClasseAvg[s]||[];
    if(!comps.length){
      taulaClasse+='<tr><td colspan="2">'+escHtml(s)+'</td><td style="text-align:center;">'+(d.subjClasseAvg[s]!=null?d.subjClasseAvg[s]:'—')+'</td></tr>';
    } else {
      comps.forEach(function(c,ci){
        taulaClasse+='<tr>'+(ci===0?'<td rowspan="'+comps.length+'" style="font-weight:700;vertical-align:top;background:#fafafa;">'+escHtml(s)+'</td>':'')
          +'<td>'+escHtml(c.nom)+'</td><td style="text-align:center;">'+(c.mitjana!=null?c.mitjana:'—')+'</td></tr>';
      });
    }
    var g=d.subjClasseAvg[s];
    taulaClasse+='<tr style="background:#f0ece4;"><td colspan="2" style="font-weight:700;">Global '+escHtml(s)+'</td><td style="text-align:center;font-weight:700;">'+(g!=null?g:'—')+'<span class="q">'+qualificacioText(g)+'</span></td></tr>';
  });
  taulaClasse+='</tbody></table>';
  cont+=taulaClasse;
  cont+='<div style="text-align:center;min-width:220px;">'
    +renderChart(d.totsSubjs, [d.totsSubjs.map(function(s){return d.subjClasseAvg[s]||0;})], ['#B5562F'], 260,220)
    +'<div style="font-size:10px;color:#888;">Mitjana de classe per assignatura</div>'
    +'</div></div>';
  cont+='<div style="margin-top:8px;font-size:12px;"><b>Nota mitjana global de la classe:</b> '+(d.mitjanaClasse!=null?d.mitjanaClasse:'—')+' <span style="color:#888;">('+qualificacioText(d.mitjanaClasse)+')</span></div>';
  cont+=COMENT_IA_HTML;

  // ── Notes dels alumnes ── nomes la nota global de cada assignatura + global de l'alumne
  // Cada alumne comença en una pàgina nova (i el resum de classe és sempre la pàgina 1).
  cont+='<div class="pagebreak"></div>';
  cont+='<h2>Notes dels alumnes</h2>';
  d.ordres.forEach(function(uid){
    var al=d.alumnesMap[uid];
    var subjsAmbNota=d.totsSubjs.filter(function(s){var a=al.assigns[s]; return a&&a.nota!=null;});
    var alVals=subjsAmbNota.map(function(s){return al.assigns[s].nota;});
    var chartAlu=renderChart(subjsAmbNota,[alVals],['#566B47'],200,175);
    var g=d.globalsAlu[uid];

    var taulaNotes='<table style="font-size:10.5px;"><thead><tr><th style="text-align:left;">Assignatura</th><th>Nota global</th></tr></thead><tbody>';
    subjsAmbNota.forEach(function(s){
      var n=al.assigns[s].nota;
      taulaNotes+='<tr><td style="text-align:left;">'+escHtml(s)+'</td><td style="text-align:center;">'+n+'<span class="q">'+qualificacioText(n)+'</span></td></tr>';
    });
    taulaNotes+='<tr style="background:#f0ece4;"><td style="font-weight:700;">Global alumne</td><td style="text-align:center;font-weight:700;">'+(g!=null?g:'—')+'<span class="q">'+qualificacioText(g)+'</span></td></tr>';
    taulaNotes+='</tbody></table>';

    cont+='<div class="stu"><div style="font-size:12.5px;font-weight:700;margin-bottom:6px;">'+al.ordre+'. '+escHtml(al.nom)+'</div>'
      +'<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;">'
        +'<div style="flex-shrink:0;">'+chartAlu+'</div>'
        +'<div style="flex:1;min-width:200px;">'+taulaNotes+'</div>'
      +'</div>'
      +comentIA(comentarisIA&&comentarisIA.comentaris&&comentarisIA.comentaris[uid])
    +'</div>';
  });

  cont+='</body></html>';
  return cont;
}
function nomFitxerInforme(dades){ return (dades.titolInforme||'informe').replace(/[^a-zA-Z0-9_-]/g,'_'); }

// Deshabilita el boto durant la crida a la IA i li canvia el text, restaurant-lo
// despres. btnId es opcional (si el boto no existeix, nomes s'omet aquest pas).
function ambBotoCarregant(btnId, textCarregant, fn){
  var btn=btnId?document.getElementById(btnId):null;
  var textOriginal=btn?btn.textContent:null;
  if(btn){ btn.disabled=true; btn.textContent=textCarregant; }
  return fn().finally(function(){
    if(btn){ btn.disabled=false; btn.textContent=textOriginal; }
  });
}

function generarInforme(mode){
  var dades=prepararDadesInforme(); if(!dades) return;
  var btnId=mode==='llarg'?'inf-gen-llarg-btn':'inf-gen-curt-btn';
  ambBotoCarregant(btnId,'Generant comentaris IA…',function(){
    return generarComentarisIAAmbLimit(dades, mode).then(function(comentarisIA){
      var cont=generarInformeHTML(dades, spiderSvg, comentarisIA);
      var blob=new Blob([cont],{type:'text/html'});
      var url=URL.createObjectURL(blob);
      var a=document.createElement('a'); a.href=url; a.target='_blank'; a.click();
      setTimeout(function(){URL.revokeObjectURL(url);},5000);
      toast(comentarisIA?'Informe generat ✓':'Informe generat (sense comentaris IA) ✓');
    });
  });
}

// Mateix gràfic d'aranya, pero renderitzat sobre un canvas i retornat com a <img> amb
// una imatge PNG en base64.
function chartImgPng(labels, datasets, colors, W, H){
  var canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H;
  spiderCoreDraw(canvas.getContext('2d'), W, H, labels, datasets, colors);
  return '<img src="'+canvas.toDataURL('image/png')+'" width="'+W+'" height="'+H+'">';
}
// Exportacio en HTML pla (.html) — Google Docs sap importar i convertir fitxers HTML
// de manera fiable (Drive → Obrir amb → Google Docs), i Word tambe els obre i els
// converteix a document editable. Evitem trucs de disfressar HTML com a .doc o
// empaquetar-lo com a .mht, que en la practica donen resultats inconsistents.
function exportarInformeDoc(){
  var dades=prepararDadesInforme(); if(!dades) return;
  ambBotoCarregant('inf-doc-btn','Generant comentaris IA…',function(){
    return generarComentarisIAAmbLimit(dades,'curt').then(function(comentarisIA){
      var cont=generarInformeHTML(dades, chartImgPng, comentarisIA);
      var blob=new Blob([cont],{type:'text/html'});
      var url=URL.createObjectURL(blob);
      var a=document.createElement('a'); a.href=url; a.download=nomFitxerInforme(dades)+'.html'; a.click();
      setTimeout(function(){URL.revokeObjectURL(url);},5000);
      toast('Informe exportat en HTML ✓ — puja\'l a Google Drive i obre\'l amb Google Docs, o obre\'l amb Word');
    });
  });
}

// Obre l'informe en una pestanya nova i llença directament el dialeg d'impressio
// del navegador — des d'alli el professor tria "Desar com a PDF" com a destinacio.
function exportarInformePdf(){
  var dades=prepararDadesInforme(); if(!dades) return;
  ambBotoCarregant('inf-pdf-btn','Generant comentaris IA…',function(){
    return generarComentarisIAAmbLimit(dades,'curt').then(function(comentarisIA){
      var cont=generarInformeHTML(dades, spiderSvg, comentarisIA);
      var blob=new Blob([cont],{type:'text/html'});
      var url=URL.createObjectURL(blob);
      window.open(url,'_blank');
      setTimeout(function(){URL.revokeObjectURL(url);},5000);
      toast('Informe obert ✓ — revisa/edita els comentaris IA i després clica "Imprimir / Desar com a PDF"');
    });
  });
}

// ─── FUNCIONS QUE FALTAVEN ───
function renderEntradaRapida(){
  // Ja no s'usa (entrada rapida eliminada), funció buida per compatibilitat
}

function openGraellaBtn(el){openGraella(el.dataset.cid,el.dataset.aid);}
function openGraella(compId, actId){
  var comp=competencies.find(function(c){return c.id===compId;});
  var act=getActs(compId).find(function(a){return a.id===actId;}); if(!act) return;
  _currentGraellaCompId=compId; _currentGraellaActId=actId;
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
          +(altres?'<span class="act-comment-preview">'+escHtml(altres.substring(0,120))+(altres.length>120?'...':'')+'</span>':'+ Comentari')
        +'</button>'
      +'</td>'
    +'</tr>';
  }).join('')+'</tbody>';

  document.getElementById('cv-table').innerHTML=thead+tbody;
}

// ─── Eliminar activitat ───
function confirmarEliminarActivitat(){
  var act=getActs(_currentGraellaCompId).find(function(a){return a.id===_currentGraellaActId;}); if(!act) return;
  var overlay=document.createElement('div'); overlay.className='overlay'; overlay.id='pop-del-act';
  overlay.innerHTML='<div class="popup" style="width:380px;">'
    +'<div style="font-size:32px;text-align:center;margin-bottom:10px;">⚠️</div>'
    +'<div class="popup-head" style="text-align:center;">Eliminar activitat</div>'
    +'<div style="font-size:13px;color:var(--ink2);text-align:center;margin-bottom:10px;">Eliminaràs: <b>'+escHtml(act.nom)+'</b></div>'
    +'<div style="font-size:12.5px;color:var(--clay);background:var(--clay-l);border-radius:var(--r);padding:10px 12px;margin-bottom:16px;text-align:center;line-height:1.6;">Es perdran totes les notes d\'aquesta activitat per a tots els alumnes. Aquesta acció no es pot desfer.</div>'
    +'<div style="display:flex;gap:8px;">'
      +'<button class="btn btn-danger" style="flex:1;background:var(--clay);color:#fff;border-color:var(--clay);" onclick="eliminarActivitatConfirmat()">Sí, eliminar</button>'
      +'<button class="btn" style="flex:1;" onclick="tancarDelActivitat()">Cancel·lar</button>'
    +'</div>'
  +'</div>';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
}
function tancarDelActivitat(){ var e=document.getElementById('pop-del-act'); if(e) e.remove(); }
function eliminarActivitatConfirmat(){
  var compId=_currentGraellaCompId;
  var acts=getActs(compId);
  var idx=acts.findIndex(function(a){return a.id===_currentGraellaActId;});
  if(idx===-1) return;
  var act=acts[idx];
  var sb=window.__QUADERN_SUPABASE__;
  var acabar=function(){
    acts.splice(idx,1);
    tancarDelActivitat();
    guardarDades();
    actualitzarCompTiles();
    toast('Activitat eliminada');
    showCV('cv-activitats','cv-graella');
    openComp(compId);
  };
  if(sb&&act.dbId){
    dbEscriu(dbEliminarActivitat(act.dbId),'Error eliminant').then(function(ok){ if(ok) acabar(); });
  }else{
    acabar();
  }
}

// ═══════════════ INIT ═══════════════
initGate();
escoltarCanvisAuthSupabase();
carregarAuth().then(function(){
  carregarPerfil();
  carregarDades();
  syncCompetenciesForCurrentSubject();
  updateNav(); renderAll();
  if(authState.isLogged){
    anarAPasPostAuth();
  }else{
    document.getElementById('gate').classList.remove('hide');
    showGatePas('g-login');
  }
  setTimeout(function(){ renderEntradaRapida(); }, 10);
});
