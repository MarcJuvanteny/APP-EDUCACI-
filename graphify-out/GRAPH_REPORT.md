# Graph Report - .  (2026-07-29)

## Corpus Check
- Corpus is ~45,113 words - fits in a single context window. You may not need a graph.

## Summary
- 347 nodes · 814 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.8)
- Token cost: 168,383 input · 0 output

## Community Hubs (Navigation)
- Quadern Core Data Loader
- React Dashboard Components
- Quadern Delete & Export Actions
- Quadern Activity & Rubric Editor
- Project Dependencies
- AI Comment Generation Pipeline
- Auth Gate & Login Flow
- Legacy App Snapshot (Rendering)
- Student Import & Demo Seeding
- Grades & Notes Sync
- Competency Rubric & Curriculum
- ESLint Config
- Next.js Config
- Supabase Backup Script

## God Nodes (most connected - your core abstractions)
1. `toast()` - 49 edges
2. `escHtml()` - 32 edges
3. `guardarDades()` - 22 edges
4. `public/quadern.html (markup del prototip, injectat via fetch)` - 22 edges
5. `Estructura del projecte (overview doc)` - 20 edges
6. `dbUid()` - 15 edges
7. `anarAPasPostAuth()` - 15 edges
8. `WeeklyCalendar()` - 14 edges
9. `getActs()` - 13 edges
10. `renderAll()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `renderCal()` --semantically_similar_to--> `WeeklyCalendar()`  [INFERRED] [semantically similar]
  actualizaciones_de_app.md → app/_components/weekly-calendar.jsx
- `Currículum de competències Catalunya Primària (Decret 175/2022)` --semantically_similar_to--> `areaForSubject()`  [INFERRED] [semantically similar]
  app/docs/Competencies.md → public/quadern.js
- `Currículum de competències Catalunya Primària (Decret 175/2022)` --semantically_similar_to--> `getCompetenciesForSubject()`  [INFERRED] [semantically similar]
  app/docs/Competencies.md → public/quadern.js
- `gateEntrar()` --semantically_similar_to--> `gateEntrar()`  [INFERRED] [semantically similar]
  actualizaciones_de_app.md → public/quadern.js
- `crearNouCurs()` --semantically_similar_to--> `crearNouCurs()`  [INFERRED] [semantically similar]
  actualizaciones_de_app.md → public/quadern.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flux d'autenticació i onboarding (gate)** — public_quadern_gate_login_flow, public_quadern_iniciarsessio, public_quadern_registrarcompte, public_quadern_demanarrecuperacio, public_quadern_guardarnovacontrasenya, public_quadern_tancarsessio [INFERRED 0.85]
- **Pipeline de generació de l'informe conjunt** — informe_estructura_disseny, informe_estructura_aparellament_alumnes, informe_estructura_json_alumne_schema, public_quadern_exportarjson, public_quadern_construirdadesinforme, public_quadern_generarinforme, public_quadern_exportarinformedoc [INFERRED 0.85]
- **Àrees curriculars de competències (Decret 175/2022)** — app_docs_competencies_area_llengues, app_docs_competencies_area_matematiques, app_docs_competencies_area_medi, app_docs_competencies_area_artistica, app_docs_competencies_area_fisica, app_docs_competencies_area_valors [EXTRACTED 1.00]

## Communities (16 total, 2 thin omitted)

### Community 0 - "Quadern Core Data Loader"
Cohesion: 0.06
Nodes (53): afegirAssignaturaGlobal(), areaForSubject(), canviarSubjNav(), carregarActivitatsDelContext(), carregarAlumnesDelCursActiu(), carregarDades(), carregarPerfil(), colorCurs() (+45 more)

### Community 1 - "React Dashboard Components"
Cohesion: 0.06
Nodes (36): Instantània històrica del prototip 'Quadern' (un sol fitxer), QuadernPrototype(), ROUTE_MAP, calcularCursColorMap(), COLORS, COLORS_LIGHT, corPerCurs(), CURSOS (+28 more)

### Community 2 - "Quadern Delete & Export Actions"
Cohesion: 0.07
Nodes (49): Esquema JSON per alumne (competencies/activitats/notesCriteris), autoResizeTextarea(), ava(), comp(), confirmarEliminarActivitat(), confirmarEliminarAssignatura(), confirmarEliminarCriteri(), confirmarEliminarCurs() (+41 more)

### Community 3 - "Quadern Activity & Rubric Editor"
Cohesion: 0.14
Nodes (28): afegirCompAProva(), afegirCriteri(), cfgTab(), crearActivitat(), crearActivitatsProva(), crearProva(), dbActualitzarActiuAlumne(), dbActualitzarComentariAlumne() (+20 more)

### Community 4 - "Project Dependencies"
Cohesion: 0.08
Nodes (24): @anthropic-ai/sdk, eslint, eslint-config-next, next, dependencies, @anthropic-ai/sdk, next, react (+16 more)

### Community 5 - "AI Comment Generation Pipeline"
Cohesion: 0.14
Nodes (24): client(), formatAssignatures(), generarComentariAlumne(), generarComentariClasse(), POST(), systemPromptAlumne(), systemPromptClasse(), Aparellament d'alumnes per ordre de llista (no per nom) (+16 more)

### Community 6 - "Auth Gate & Login Flow"
Cohesion: 0.12
Nodes (21): crearNouCurs(), renderGateCursos(), abrirGateSeleccio(), anarAPasPostAuth(), crearNouCurs(), dbCrearCurs(), demanarRecuperacio(), escoltarCanvisAuthSupabase() (+13 more)

### Community 7 - "Legacy App Snapshot (Rendering)"
Cohesion: 0.11
Nodes (19): alumnes (data array), calEvents (data array), competencies (data array), drawSpider(), estat (data object), gateEntrar(), navGo(), renderAll() (+11 more)

### Community 8 - "Student Import & Demo Seeding"
Cohesion: 0.18
Nodes (18): addAlumneManual(), colorIdx(), dataISO(), dbAfegirAlumne(), dbCarregarAlumnes(), dbCarregarCursosComplet(), dbCarregarPerfil(), dbSembrarDemo() (+10 more)

### Community 9 - "Grades & Notes Sync"
Cohesion: 0.17
Nodes (10): activitats (data map), openComp(), saveNota(), dbActualitzarNotesActivitat(), navNota(), notaClass(), recalcGlobal(), saveNota() (+2 more)

### Community 10 - "Competency Rubric & Curriculum"
Cohesion: 0.17
Nodes (11): rubrica (data map), Àrea d'Educació Artística, Àrea d'Educació Física, Àrea de Llengües, Àrea de Matemàtiques, Àrea de Coneixement del Medi Natural, Social i Cultural, Àrea d'Educació en Valors Cívics i Ètics, Currículum de competències Catalunya Primària (Decret 175/2022) (+3 more)

### Community 11 - "ESLint Config"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

## Ambiguous Edges - Review These
- `dbCarregarRubricaCustom()` → `Escala d'avaluació NA/AS/AN/AE (1-4/5-6/7-8/9-10)`  [AMBIGUOUS]
  app/docs/Competencies.md · relation: conceptually_related_to
- `exportarInformePdf()` → `Exportació .docx / .xlsx de l'informe`  [AMBIGUOUS]
  informe_estructura.md · relation: conceptually_related_to

## Knowledge Gaps
- **47 isolated node(s):** `ROUTE_MAP`, `MESOS`, `COLORS`, `COLORS_LIGHT`, `PALETA_CURSOS` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `dbCarregarRubricaCustom()` and `Escala d'avaluació NA/AS/AN/AE (1-4/5-6/7-8/9-10)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `exportarInformePdf()` and `Exportació .docx / .xlsx de l'informe`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Estructura del projecte (overview doc)` connect `React Dashboard Components` to `Quadern Core Data Loader`, `Competency Rubric & Curriculum`, `Project Dependencies`, `AI Comment Generation Pipeline`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **Why does `Disseny de l'estructura de l'Informe consolidat` connect `AI Comment Generation Pipeline` to `React Dashboard Components`, `Quadern Delete & Export Actions`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `ROUTE_MAP`, `MESOS`, `COLORS` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Quadern Core Data Loader` be split into smaller, more focused modules?**
  _Cohesion score 0.05924920850293985 - nodes in this community are weakly interconnected._
- **Should `React Dashboard Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05925925925925926 - nodes in this community are weakly interconnected._