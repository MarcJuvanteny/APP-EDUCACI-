# Estructura del projecte — què és cada carpeta i fitxer

Aquest document explica per a què serveix cada part del repositori. És només documentació — no l'utilitza cap part del codi.

## Arrel del projecte (`/`)

| Fitxer | Per a què serveix |
|---|---|
| `package.json` | Defineix el projecte Next.js: nom, dependències (`next`, `react`, `react-dom`, `@supabase/supabase-js`) i les ordres (`npm run dev`, `npm run build`, `npm run lint`). |
| `package-lock.json` | Versions exactes de totes les dependències instal·lades (generat automàticament per npm, no s'edita a mà). |
| `next.config.mjs` | Configuració de Next.js. Ara mateix és pràcticament buida (`{}`) — no hi ha cap opció personalitzada activada. |
| `eslint.config.mjs` | Configuració del linter (ESLint), amb les regles recomanades de Next.js. Ignora `public/`, `.next/` i `node_modules/` perquè `public/quadern.js` és codi vell (vanilla JS) que no segueix les convencions de React. |
| `.env.local` | **Les claus reals de Supabase** (URL i clau pública) que fa servir l'app quan la tens oberta en local. **Mai es puja a GitHub** (està al `.gitignore`) perquè és sensible. |
| `.env.example` | Còpia del fitxer anterior però amb valors d'exemple en lloc de les claus reals — serveix perquè qualsevol persona que baixi el projecte sàpiga quines variables ha de configurar. |
| `.gitignore` | Llista de fitxers/carpetes que Git ha d'ignorar i no pujar mai al repositori (`.env.local`, `node_modules`, `.next`, `.vercel`...). |
| `README.md` | Actualment gairebé buit (només el títol). És on normalment s'explicaria el projecte a qui arribi nou al repositori. |
| `actualizaciones_de_app.md` | Una còpia històrica/instantània d'una versió anterior de l'aplicació (HTML complet). És un document de referència d'una fase antiga del projecte, no s'utilitza en l'aplicació actual. |
| `informe_estructura.md` | Document de disseny que vam fer servir per definir l'estructura de l'Informe (capçalera, resum de classe, notes dels alumnes, comentari d'IA...) abans de programar-lo. Serveix de referència del disseny acordat. |
| `.vercel/` | Generada automàticament quan aquest entorn es vincula a un projecte de Vercel (conté l'identificador del projecte). No es puja a GitHub. No cal tocar-la mai a mà. |

## `/app` — l'aplicació Next.js (App Router)

Next.js fa servir el sistema de "carpeta = ruta": cada carpeta amb un `page.jsx` a dins és una pàgina accessible amb aquella adreça.

| Carpeta/fitxer | Ruta | Per a què serveix |
|---|---|---|
| `app/layout.jsx` | — | Plantilla mare de totes les pàgines: defineix el `<html>`, el `<body>`, el títol de la pestanya del navegador i importa els estils globals. |
| `app/globals.css` | — | Estils CSS globals bàsics (reset, etc.) que s'apliquen a tota l'aplicació React. |
| `app/page.jsx` | `/` | La pàgina arrel. Només redirigeix automàticament cap a `/inici`. |
| `app/inici/page.jsx` | `/inici` | Pantalla principal de l'app (resum de classe). Carrega el prototip vanilla-JS (`quadern.html`/`.js`/`.css`) dins un contenidor React. |
| `app/competencies/page.jsx` | `/competencies` | Mateix prototip, però obrint-lo directament a la pestanya "Competències". |
| `app/configuracio/page.jsx` | `/configuracio` | Mateix prototip, obrint-lo directament a "Configuració" (alumnes, rúbrica...). |
| `app/nova-activitat/page.jsx` | `/nova-activitat` | Mateix prototip, obrint-lo per crear una activitat nova directament. |
| `app/programacio/page.jsx` | `/programacio` | El calendari setmanal — **aquesta és una pàgina React de veritat** (no el prototip vanilla), construïda amb `WeeklyCalendar`. |
| `app/programacio/programacio-calendari.css` | — | Estils CSS específics del calendari setmanal (colors dels events, graella d'hores, etc.). |
| `app/recuperar-contrasenya/page.jsx` | `/recuperar-contrasenya` | Pàgina dedicada on arriba l'usuari des de l'enllaç del correu de "Recuperar contrasenya" — mostra el formulari per crear una contrasenya nova. |

### `app/_components/` — components React reutilitzats

(El guió baix `_` al davant li diu a Next.js que aquesta carpeta *no* és una ruta.)

| Fitxer | Per a què serveix |
|---|---|
| `quadern-prototype.jsx` | El component que **injecta el prototip vanilla-JS** (`public/quadern.html/css/js`) dins la pàgina React: fa `fetch` dels tres fitxers, els insereix al DOM i connecta Supabase. L'utilitzen totes les pàgines "inici/competencies/configuracio/nova-activitat". |
| `weekly-calendar.jsx` | El component React del calendari setmanal (la pantalla "Programació"), amb tota la seva lògica pròpia (no depèn del prototip vanilla-JS). |

### `app/lib/`

| Fitxer | Per a què serveix |
|---|---|
| `supabaseClient.js` | Una única funció (`createSupabaseClient`) que crea la connexió amb Supabase llegint les variables d'entorn. Si no hi ha claus configurades, retorna `null` (mode sense base de dades). L'utilitzen `quadern-prototype.jsx`, `weekly-calendar.jsx` i `recuperar-contrasenya/page.jsx`. |

### `app/docs/`

Documents de referència de disseny/contingut, **no codi**:

| Fitxer | Per a què serveix |
|---|---|
| `Brand.md` | Especificacions de marca: paleta de colors, tipografies (Fraunces/Karla), estil visual. Es fa servir com a referència quan es dissenya alguna pantalla nova. |
| `Competencies.md` | El currículum complet de competències per àrea (Llengües, Matemàtiques, Medi, Educació Física, Educació Artística) amb els seus criteris i descriptors de la rúbrica. És el document font a partir del qual es va programar `competenciesByArea` dins `quadern.js`. |

## `/public` — fitxers estàtics

Tot el que hi ha aquí es serveix directament pel navegador a `/nom-del-fitxer`, sense passar per React.

| Fitxer | Per a què serveix |
|---|---|
| `quadern.html` | L'estructura HTML completa del "prototip" original de l'aplicació (totes les pantalles: gate d'inici de sessió, home, alumnes, competències, configuració, informes...). |
| `quadern.css` | Tots els estils del prototip (colors, tipografies, components visuals). |
| `quadern.js` | **El cor de l'aplicació** — tota la lògica: autenticació, gestió de cursos/assignatures/alumnes, notes i activitats, rúbrica, generació d'informes, sincronització amb Supabase, etc. És un sol fitxer molt gran perquè ve d'un prototip vanilla-JS que es va anar ampliant. |
| `demo-informe/*.json` | Dos fitxers JSON d'exemple (Educació Física i Matemàtiques de "3r A") que serveixen per **provar manualment** la funció "Generar informe conjunt" — simulen el fitxer que exportaria un altre professor. No els carrega l'aplicació automàticament; s'han de pujar a mà des de la pantalla d'informes. |

## `/supabase`

| Fitxer | Per a què serveix |
|---|---|
| `schema.sql` | Foto congelada de tot l'esquema de la base de dades (taules, RLS, triggers) tal com estava en el moment en què es va deixar d'editar. Serveix per muntar un entorn nou des de zero. **No s'edita més** — els canvis nous van a `migrations/`. |
| `migrations/` | Cada canvi nou a l'esquema, un fitxer per canvi, en ordre cronològic. Veure `migrations/README.md` per la convenció. |

---

## Resum visual

```
APP-EDUCACI-/
├── app/                          → Next.js (React): rutes i components
│   ├── _components/              → components compartits (injecta el prototip, calendari)
│   ├── lib/                      → connexió amb Supabase
│   ├── docs/                     → documents de referència (marca, currículum)
│   └── [inici|competencies|...]/ → una carpeta = una ruta de l'app
├── public/                       → prototip vanilla-JS (html/css/js) + fixtures de prova
├── supabase/                     → esquema SQL de la base de dades
├── .env.local / .env.example     → claus de Supabase (reals / exemple)
└── package.json, next.config...  → configuració del projecte Next.js
```
