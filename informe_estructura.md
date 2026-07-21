# Estructura de l'Informe

Aquest document descriu com ha de ser l'informe consolidat que es genera a "Generar informe". Serveix per definir la part estructural (sense IA) i, més endavant, com a referència per a l'agent d'IA que generarà els comentaris.

## 1. D'on surten les dades

Cada professor exporta un JSON (`exportarJSON` / `construirDadesInforme` a `quadern.js`) amb aquesta forma, per un curs + assignatura + trimestre concrets:

```
{
  versio, exportat, nomInforme, professor, centre, any,
  curs, trimestre, assignatura,
  alumnes: [
    {
      id, ini, nom, global,          // global = mitjana de totes les competències
      comentari,                     // comentari general de l'alumne (camp lliure del professor)
      competencies: {
        <compId>: {
          nom, mitjana,              // mitjana de la competència
          activitats: [
            { id, nom, data, mitjana, comentari, notesCriteris: {criteri: valor} }
          ]
        }
      }
    }
  ]
}
```

A "Generar informe" (`generarInforme`) s'ajunten diversos d'aquests JSON (un per assignatura, poden venir d'altres professors) per fer l'**informe conjunt** d'un curs. Els alumnes s'aparellen **per ordre de posició a la llista** (1r, 2n, 3r...), mai per nom, perquè cada professor pot escriure'l diferent.

**Actualment** l'informe generat només fa una taula: `# | Alumne | <nota per assignatura> ... | Global`. La resta de dades (competències, activitats, comentaris) es calculen però no s'aprofiten.

## 2. Estructura final de l'informe

### 2.1 Capçalera
- Curs (ex: 3r A)
- Any escolar (ex: 2025-2026)
- Tutor/a — nom de la persona que genera l'informe
- Etapa de l'informe — 1r trimestre / 2n trimestre / 3r trimestre / Informe de tot el curs

### 2.2 Resum de classe
- **Taula de notes de tota la classe, totes les assignatures.** Una fila per alumne, una columna per assignatura. Cada cel·la mostra únicament la nota i la qualificació textual corresponent (sense observacions):
  - 1–4 → No Assolit
  - 5–6 → Assolit
  - 7–8 → Assoliment notable
  - 9–10 → Assoliment excel·lent

  *(Són els mateixos trams que ja fa servir la rúbrica de l'app — `escales` a `quadern.js` — només cal ajustar l'etiqueta del tram 5–6 de "Assoliment suficient" a "Assolit" per quedar igual que aquí.)*
- **Nota mitjana global de la classe** (mitjana de totes les notes globals dels alumnes).
- **Gràfic d'aranya de la classe**: un eix per assignatura, valor = mitjana de la classe en aquella assignatura.
- **Comentari general de classe generat amb IA** — *[Futur, es connectarà més endavant]*.

### 2.3 Notes dels alumnes
Un bloc per **cada alumne** de la classe, amb:
- Nom de l'alumne
- **Gràfic d'aranya comparatiu**: un eix per assignatura, dues sèries — la nota de l'alumne en cada assignatura i la mitjana de la resta de la classe en aquella mateixa assignatura.
- **Taula amb totes les notes**: totes les competències de totes les assignatures (nom competència + nota), i al final de cada assignatura la seva nota global.
- **Comentari de l'alumne generat amb IA** — *[Futur, es connectarà més endavant]*.

## 3. Format i exportació

- **Compacitat**: l'informe ha d'ocupar el mínim de pàgines possible. Taules denses, gràfics d'aranya petits, sense un salt de pàgina per alumne — cal aprofitar l'espai (per exemple, dos o tres alumnes per pàgina si hi caben).
- **Editable pel professor**: un cop generat, el professor ha de poder-lo obrir i editar (sobretot els comentaris IA, per revisar-los abans d'entregar-los). Per tant l'exportació no pot ser només HTML/PDF de només lectura; cal poder exportar-lo com a:
  - **Excel (.xlsx)** — per a la part de taules/notes (resum de classe i taules de notes per alumne), que el professor pugui filtrar/retocar números.
  - **Google Docs / Word (.docx)** — per a la part narrativa (capçalera, comentaris de classe i d'alumne, gràfics d'aranya com a imatge incrustada), que el professor pugui editar el text abans d'entregar-lo. Un `.docx` és directament editable des de Google Docs (Drive → "Obrir amb Google Docs" el converteix automàticament).
- Decisió pendent: si es generen **dos fitxers** (un `.xlsx` amb les notes, un `.docx` amb els comentaris i gràfics) o si es prioritza només un dels dos formats per començar. Recomanació: començar pel `.docx`, ja que és l'únic que pot incloure el gràfic d'aranya i els comentaris IA junts en un document llegible i editable; l'Excel es pot afegir després com a exportació complementària de només les notes.

## 4. Què cal construir ara (sense IA)

- [ ] Capçalera amb curs / any escolar / tutor / etapa.
- [ ] Taula resum de classe amb nota + qualificació textual per assignatura (sense observacions).
- [ ] Càlcul i mostra de la nota mitjana global de la classe.
- [ ] Gràfic d'aranya de classe (per assignatura).
- [ ] Bloc per alumne: gràfic d'aranya comparatiu (alumne vs. resta de classe), taula completa de notes (totes les competències de totes les assignatures + global per assignatura).
- [ ] Deixar un espai marcat on més endavant s'injectarà cada comentari IA (de classe i de cada alumne), perquè no calgui retocar l'estructura quan s'afegeixi.
- [ ] Exportació a `.docx` (informe complet: capçalera, resum de classe, blocs d'alumne amb gràfic i comentari) amb disseny compacte.
- [ ] Exportació a `.xlsx` (només les taules de notes) com a format complementari.

## 5. Estructura del comentari de l'agent d'IA (fase posterior)

Quan s'implementi, el comentari de cada alumne s'ha de generar amb una estructura diferent segons l'etapa de l'informe.

### 5.1 Informe de final de curs (~150 paraules)
1. **Evolució acadèmica** — com ha progressat en les àrees principals (llengües, matemàtiques, medi). Destacar tant el que domina com el que encara ha d'acabar d'assolir.
2. **Actitud i hàbits de treball** — gestió del temps, atenció a classe, ordre amb els deures, esforç davant les dificultats.
3. **Socialització i relacions** — relació amb companys i mestres, treball en equip, empatia, respecte per les normes de convivència.
4. **Punts forts** — habilitats on l'alumne brilla especialment (creativitat, participació oral, resolució de conflictes...), per reforçar la seva autoestima.
5. **Aspectes a millorar** — de manera positiva i constructiva, punts on cal posar més atenció o esforç el curs vinent.
6. **Orientacions i propostes per a l'estiu** — idees pràctiques i lúdiques per treballar a casa (llegir una estona cada dia, jocs de taula per al càlcul mental...) sense atabalar l'alumne.

### 5.2 Informe de trimestre (~60-90 paraules)
1. **Adaptació i valoració global del trimestre** — com ha començat i viscut aquest període (adaptació al ritme de treball, millora respecte al trimestre anterior...).
2. **Assoliment dels objectius clau** — resum breu de com ha anat el treball dels continguts més importants (ex: "ha consolidat la divisió de dues xifres", "ha millorat en la redacció de textos").
3. **Hàbits d'estudi i ordre** — lliurament de feines a temps, agenda/llibreta, aprofitament del temps de treball a l'aula.
4. **Comportament i cohesió de grup** — convivència i participació en els projectes del trimestre.
5. **Deures o consells per al període de vacances** (si n'hi ha) — recomanacions concretes per Nadal/Setmana Santa (llegir un llibre triat per l'alumne, repassar taules amb jocs...).

### 5.3 Dades d'entrada per a l'agent
Per generar aquests comentaris, l'agent rebrà:
- Nom de l'alumne, curs, etapa (trimestre o final de curs)
- Notes per competència de totes les assignatures (i els comentaris d'activitats, si n'hi ha)
- El comentari general que el professor hagi escrit per l'alumne
- Per al comentari de classe: mitjanes de classe per assignatura/competència i llista d'alumnes amb dificultats/destacats

L'agent no ha d'inventar dades que no estiguin al JSON; el text ha de ser en català, to professional i constructiu, i sempre revisable pel professor abans de finalitzar l'informe.
