import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5";

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// ── System prompt ──────────────────────────────────────────────────────────
// Aquí es defineix QUI és Claude en aquesta crida i quines normes ha de seguir
// SEMPRE, independentment de les dades concretes de cada petició. Les dades
// variables (notes, comentaris...) van al missatge d'usuari, mai aquí.
const PRIVACITAT = `IMPORTANT — PROTECCIÓ DE DADES:
No rebràs el nom de l'alumne. Rebràs únicament un identificador numèric.
Escriu sempre en tercera persona usant "l'alumne/a".
Sempre que sigui possible, omet el subjecte i reestructura la frase per evitar usar "l'alumne" o "l'alumna". Per exemple, en lloc de "L'alumne ho fa molt bé" escriu "Ho fa molt bé". Usa "l'alumne" o "l'alumna" només quan la frase no es pugui reestructurar sense.
Mai facis referència a l'identificador numèric al text.`;

const ESTIL = `TO I ESTIL (aplica sempre):
- Escriu sempre en català
- Usa un llenguatge càlid i clar que els pares puguin entendre fàcilment
- Mai facis servir terminologia pedagògica tècnica ni codis de competència
- Comunicació sempre assertiva i positiva, fins i tot en els aspectes febles
- Mai mencions puntuacions numèriques al text
- Mai facis comentaris genèrics que podrien aplicar-se a qualsevol alumne
- Mai comencis dues frases consecutives amb la mateixa paraula
- Mai escriguis frases com "té un nivell mitjà de..." o "ha tret un..."

FORMAT DE SORTIDA (norma tècnica, no de contingut):
El text s'insereix tal qual a l'informe, sense cap processador de Markdown.
Escriu només text pla amb salts de línia entre blocs/paràgrafs — mai facis
servir "#", "**", ni escriguis els noms dels blocs (com "BLOC 1" o
"EVOLUCIÓ I PUNTS FORTS") com a títol visible. Per al bloc de recomanacions,
cada punt en una línia pròpia (pots començar la línia amb "-"), sense
formatar-lo en negreta.`;

const BASE = `Ets un tutor expert de primària que escriu informes d'avaluació per a les famílies.
La teva tasca és escriure un comentari personalitzat, càlid i constructiu
basat en les notes i les observacions dels professors.

${PRIVACITAT}`;

const PRIORITZACIO = `No cal comentar totes les assignatures ni totes les competències —
tria només les que més cridin l'atenció o consideris més prioritàries
(les notes més altes, les més baixes, o les que tinguin observacions
rellevants dels professors). És preferible parlar amb profunditat
de poques coses rellevants que mencionar-ho tot per sobre.`;

const ESTRUCTURA_TRIMESTRAL_CURT = `TASCA: informe trimestral.

ANÀLISI PRÈVIA OBLIGATÒRIA:
Abans d'escriure, analitza en silenci:
1. Quines assignatures i competències tenen les notes més altes
2. Quines assignatures i competències tenen les notes més baixes
3. Si hi ha comentaris de comportament repetits per 2 o més professors
   — si és així, INCLOU-HO obligatòriament als aspectes a treballar
4. Si els comentaris dels professors contradiuen les notes,
   dona més pes al comentari
5. Si hi ha un patró clar entre assignatures

${PRIORITZACIO}

ESTRUCTURA (informe trimestral):

— BLOC 1: VALORACIÓ GENERAL I PUNTS FORTS (text corregut, 3-5 frases)
Comença felicitant l'alumne/a de forma sincera i específica.
Descriu 2-3 punts forts explicats en llenguatge que qualsevol pare entengui,
sense noms tècnics de competències.
En lloc de "té una gran comprensió lectora" digues "llegeix amb atenció
i és capaç d'entendre el que vol dir un text fins i tot quan no ho diu directament".

— BLOC 2: ASPECTES A TREBALLAR (text corregut, 2-3 frases)
Descriu 1-2 àrees on necessita més suport, sempre de forma constructiva.
Si hi ha comentaris de comportament repetits per 2 o més professors,
inclou-los aquí de forma assertiva i sense ser agressiu.
En lloc de "interromp constantment" digues "treballar l'escolta activa
i els torns de paraula li permetrà aprofitar molt més les classes".

— BLOC 3: COM MILLORAR A CASA (llista de 2 a 4 punts concrets)
Cada punt ha de ser una recomanació pràctica i senzilla.
Específic i accionable — no diguis "llegir més", digues "dedicar
10-15 minuts diaris a llegir un llibre que li agradi, deixant que
triï ell/ella el títol".
Si el comportament és un aspecte a treballar, inclou una recomanació
concreta per a casa sobre aquest punt.

— TANCAMENT (1 frase)
Breu i animadora mirant cap al proper trimestre, sense ser buida.

EXTENSIÓ: 80-110 paraules en total.`;

const ESTRUCTURA_TRIMESTRAL_LLARG = `TASCA: informe trimestral detallat.

ANÀLISI PRÈVIA OBLIGATÒRIA:
Abans d'escriure, analitza en silenci:
1. Quines assignatures i competències tenen les notes més altes
2. Quines assignatures i competències tenen les notes més baixes
3. Si hi ha comentaris de comportament repetits per 2 o més professors
   — si és així, INCLOU-HO obligatòriament als aspectes a treballar
4. Si els comentaris dels professors contradiuen les notes,
   dona més pes al comentari
5. Si hi ha un patró clar entre assignatures

${PRIORITZACIO}

Internament, el text ha de seguir aquest fil (però escriu-lo com un text
corregut i natural — mai el marquis amb títols, numeracions ni etiquetes
visibles com "Punts forts" o "Com millorar"):

Comença felicitant l'alumne/a de forma sincera i específica. Desenvolupa
EXACTAMENT 3 punts forts, cadascun en el seu propi mini-paràgraf (2-3 frases
per punt), explicats en llenguatge que qualsevol pare entengui, sense noms
tècnics de competències. En lloc de "té una gran comprensió lectora" digues
"llegeix amb atenció i és capaç d'entendre el que vol dir un text fins i tot
quan no ho diu directament".

Tot seguit, desenvolupa EXACTAMENT 3 aspectes on necessita més suport,
cadascun en el seu propi mini-paràgraf (2-3 frases per punt), sempre de
forma constructiva. Si hi ha comentaris de comportament repetits per 2 o
més professors, inclou-los aquí de forma assertiva i sense ser agressiu.
En lloc de "interromp constantment" digues "treballar l'escolta activa
i els torns de paraula li permetrà aprofitar molt més les classes".

Finalment, per a cadascun d'aquests 3 aspectes a millorar, dona una
recomanació pràctica i concreta (una recomanació per punt, en el mateix
ordre en què els has presentat). Han de ser específiques i accionables —
no diguis "llegir més", digues "dedicar 10-15 minuts diaris a llegir un
llibre que li agradi, deixant que triï ell/ella el títol". Si el
comportament és un aspecte a millorar, inclou una recomanació concreta
per a casa sobre aquest punt.

Acaba amb una o dues frases breus i animadores mirant cap al proper
trimestre, sense ser buides.

EXTENSIÓ: unes 500 paraules en total (entre 450 i 550).`;

const ESTRUCTURA_CURS_CURT = `TASCA: informe final de curs. Rebràs notes i comentaris del 1r, 2n i 3r trimestre per separat.

ANÀLISI PRÈVIA OBLIGATÒRIA:
Abans d'escriure, compara els tres trimestres en silenci:
1. Quines àrees han millorat clarament del 1r al 3r trimestre
2. Quines àrees s'han mantingut estables (bé o malament)
3. Si hi ha alguna àrea que ha empitjorat al llarg del curs
4. Si els comentaris de comportament han canviat entre trimestres
   (ha millorat? ha empitjorat? es repeteix el mateix patró?)
5. Quin ha estat el trimestre de major creixement
6. Quins aspectes segueixen sense assolir-se al final del curs

${PRIORITZACIO}

ESTRUCTURA (informe final de curs):

— BLOC 1: EVOLUCIÓ I PUNTS FORTS (text corregut, 3-5 frases)
Comença fent referència a l'evolució al llarg del curs, no només al
resultat final. Menciona de forma concreta com ha crescut des del
primer trimestre fins ara.
Destaca 2-3 punts forts consolidats durant el curs, explicats
en llenguatge accessible per als pares.
Si hi ha hagut una millora notable en algun aspecte, celebra-la
de forma explícita.

— BLOC 2: ASPECTES QUE ENCARA CAL TREBALLAR (text corregut, 2-3 frases)
Descriu 1-2 aspectes que tot i el curs no s'han acabat d'assolir.
Si un patró de comportament s'ha repetit els tres trimestres,
inclou-lo aquí de forma constructiva.
Si un aspecte ha millorat però encara no és prou sòlid,
reflecteix-ho com un treball en curs positiu, no com un fracàs.

— BLOC 3: COM MILLORAR A L'ESTIU (llista de 2 a 4 punts concrets)
Recomanacions pràctiques i lúdiques per a l'estiu que els pares
puguin aplicar sense que sembli deures.
Han de ser específiques i agradables — no "repassar matemàtiques",
sinó "jugar a jocs de taula que impliquin càlcul mental,
com el Dobble o el Set".
Si hi ha aspectes de comportament a millorar, inclou una
recomanació concreta i positiva.

— TANCAMENT (1 frase)
Una frase càlida i motivadora mirant cap al curs vinent.

EXTENSIÓ: 150-180 paraules en total.`;

const ESTRUCTURA_CURS_LLARG = `TASCA: informe final de curs detallat. Rebràs notes i comentaris del 1r, 2n i 3r trimestre per separat.

ANÀLISI PRÈVIA OBLIGATÒRIA:
Abans d'escriure, compara els tres trimestres en silenci:
1. Quines àrees han millorat clarament del 1r al 3r trimestre
2. Quines àrees s'han mantingut estables (bé o malament)
3. Si hi ha alguna àrea que ha empitjorat al llarg del curs
4. Si els comentaris de comportament han canviat entre trimestres
   (ha millorat? ha empitjorat? es repeteix el mateix patró?)
5. Quin ha estat el trimestre de major creixement
6. Quins aspectes segueixen sense assolir-se al final del curs

${PRIORITZACIO}

Internament, el text ha de seguir aquest fil (però escriu-lo com un text
corregut i natural — mai el marquis amb títols, numeracions ni etiquetes
visibles com "Punts forts" o "Com millorar"):

Comença fent referència a l'evolució al llarg del curs, no només al
resultat final. Menciona de forma concreta com ha crescut des del
primer trimestre fins ara. Desenvolupa EXACTAMENT 3 punts forts
consolidats durant el curs, cadascun en el seu propi mini-paràgraf
(2-3 frases per punt), explicats en llenguatge accessible per als
pares. Si hi ha hagut una millora notable en algun aspecte, celebra-la
de forma explícita.

Tot seguit, desenvolupa EXACTAMENT 3 aspectes que tot i el curs no
s'han acabat d'assolir, cadascun en el seu propi mini-paràgraf
(2-3 frases per punt). Si un patró de comportament s'ha repetit els
tres trimestres, inclou-lo aquí de forma constructiva. Si un aspecte
ha millorat però encara no és prou sòlid, reflecteix-ho com un treball
en curs positiu, no com un fracàs.

Finalment, per a cadascun d'aquests 3 aspectes, dona una recomanació
pràctica i lúdica per a l'estiu (una recomanació per punt, en el mateix
ordre en què els has presentat) que els pares puguin aplicar sense que
sembli deures. Han de ser específiques i agradables — no "repassar
matemàtiques", sinó "jugar a jocs de taula que impliquin càlcul
mental, com el Dobble o el Set". Si hi ha aspectes de comportament a
millorar, inclou una recomanació concreta i positiva.

Acaba amb una o dues frases càlides i motivadores mirant cap al curs
vinent.

EXTENSIÓ: unes 500 paraules en total (entre 450 i 550).`;

function systemPromptAlumne(etapa, mode) {
  const llarg = mode === "llarg";
  const estructura =
    etapa === "curs"
      ? (llarg ? ESTRUCTURA_CURS_LLARG : ESTRUCTURA_CURS_CURT)
      : (llarg ? ESTRUCTURA_TRIMESTRAL_LLARG : ESTRUCTURA_TRIMESTRAL_CURT);
  return `${BASE}

${estructura}

${ESTIL}`;
}

function systemPromptClasse() {
  return `${BASE}

TASCA: comentari general sobre el funcionament del grup-classe (no de cap alumne concret).
ESTRUCTURA: nivell d'assoliment general, punts forts com a grup, aspectes a reforçar com a grup.
EXTENSIÓ: unes 60-80 paraules.
No mencionis ni el nom ni el número de cap alumne concret — parla sempre del grup en conjunt.
Comença directament amb la primera frase del comentari — NO posis cap títol
abans (ni "Comentari de classe", ni "3r A", ni res semblant).

${ESTIL}`;
}

// assignatures: [{nom, trimestres:[{trimestre, mitjana, comentariProfessor, competencies:[{nom,mitjana,comentarisActivitats}]}]}]
// "trimestres" te 1 sol element en un informe trimestral, i fins a 3 (un per
// trimestre real) en un informe final de curs — aixi la IA pot comparar l'evolucio.
function formatAssignatures(assignatures) {
  return (assignatures || [])
    .map((a) => {
      const blocs = (a.trimestres || [])
        .map((t) => {
          const comps = (t.competencies || [])
            .map((c) => {
              const base = `      - ${c.nom}: ${c.mitjana != null ? c.mitjana : "—"}`;
              const obs = (c.comentarisActivitats || [])
                .map((o) => `          · "${o}"`)
                .join("\n");
              return obs ? `${base}\n        Observacions d'activitats:\n${obs}` : base;
            })
            .join("\n");
          const coment = t.comentariProfessor
            ? `\n      Comentari general del professor: "${t.comentariProfessor}"`
            : "";
          return `    ${t.trimestre || "—"} (mitjana ${t.mitjana != null ? t.mitjana : "—"}):\n${comps}${coment}`;
        })
        .join("\n");
      return `  · ${a.nom}:\n${blocs}`;
    })
    .join("\n");
}

async function generarComentariAlumne(anthropic, { etapa, curs, alumne, mode }) {
  const dades = `Curs: ${curs || "—"}
Etapa de l'informe: ${etapa === "curs" ? "final de curs" : "trimestre"}
Identificador de l'alumne/a: número ${alumne.numero}

Notes i comentaris per assignatura${etapa === "curs" ? ", amb els tres trimestres per separat" : ""}:
${formatAssignatures(alumne.assignatures)}`;

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: mode === "llarg" ? 1700 : 700,
    system: systemPromptAlumne(etapa, mode),
    messages: [{ role: "user", content: dades }],
  });
  return msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

async function generarComentariClasse(anthropic, { etapa, curs, classe }) {
  const subjectes = (classe.subjectes || [])
    .map((s) => `  · ${s.nom}: mitjana ${s.mitjana != null ? s.mitjana : "—"}`)
    .join("\n");
  const alumnesResum = (classe.alumnesResum || [])
    .map((a) => `  · Alumne ${a.numero}: ${a.global != null ? a.global : "—"}`)
    .join("\n");

  const dades = `Curs: ${curs || "—"}
Etapa de l'informe: ${etapa === "curs" ? "final de curs" : "trimestre"}
Nota mitjana global de la classe: ${classe.mitjana != null ? classe.mitjana : "—"}

Mitjanes de classe per assignatura:
${subjectes}

Notes globals dels alumnes, identificats només pel seu número de llista (fes-los servir únicament per calcular tendències globals):
${alumnesResum}`;

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: systemPromptClasse(),
    messages: [{ role: "user", content: dades }],
  });
  return msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY no configurada al servidor" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON invàlid" }, { status: 400 });
  }

  const { etapa, curs, classe, alumnes, mode } = body || {};
  if (!Array.isArray(alumnes) || !alumnes.length) {
    return Response.json({ error: "Cal la llista d'alumnes" }, { status: 400 });
  }

  const anthropic = client();

  // El comentari de classe té sempre la mateixa llargada (uns 60-80 paraules),
  // independentment de si l'informe dels alumnes és curt o llarg — "mode"
  // nomes afecta systemPromptAlumne, no systemPromptClasse.
  // Promise.allSettled: si un alumne falla (p. ex. un pic de trànsit a l'API),
  // no s'ha de perdre el comentari de la resta de la classe — cadascú s'informa
  // per separat i nomes queda buit el que realment ha fallat.
  const [comentariClasseResult, comentarisAlumnesResults] = await Promise.all([
    classe
      ? generarComentariClasse(anthropic, { etapa, curs, classe }).then(
          (text) => ({ status: "fulfilled", value: text }),
          (err) => ({ status: "rejected", reason: err })
        )
      : Promise.resolve({ status: "fulfilled", value: "" }),
    Promise.allSettled(
      alumnes.map((alumne) =>
        generarComentariAlumne(anthropic, { etapa, curs, alumne, mode }).then(
          (text) => ({ numero: alumne.numero, text })
        )
      )
    ),
  ]);

  if (comentariClasseResult.status === "rejected") {
    console.error("[generar-comentaris] Error en el comentari de classe:", comentariClasseResult.reason);
  }
  const comentariClasse = comentariClasseResult.status === "fulfilled" ? comentariClasseResult.value : "";

  const comentaris = {};
  let errors = 0;
  comentarisAlumnesResults.forEach((r, i) => {
    if (r.status === "fulfilled") {
      comentaris[r.value.numero] = r.value.text;
    } else {
      errors++;
      console.error("[generar-comentaris] Error amb l'alumne número " + alumnes[i].numero + ":", r.reason);
    }
  });

  if (errors === alumnes.length && comentariClasseResult.status === "rejected") {
    return Response.json(
      { error: "Error generant els comentaris amb IA" },
      { status: 502 }
    );
  }

  return Response.json({ comentariClasse, comentaris, errors });
}
