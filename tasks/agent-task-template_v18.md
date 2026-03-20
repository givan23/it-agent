# Agent Task Template

## Dry Run
false

## Git repo path
C:\path\to\git-repo

## Npm project path
C:\path\to\npm-project

## Branch name
feat/example-task

## Commit message
describe the change

## Activities
1.
Type: replace_entire_file
Target: C:\path\to\file.js
Content:
full file content here

2.
Type: append_to_file
Target: C:\path\to\file.css
Content:
.newClass {
  color: red;
}

3.
Type: insert_after_marker
Target: C:\path\to\App.js
Marker: import "./App.css";
Content:
import Card from "./components/Card";

4.
Type: insert_before_marker
Target: C:\path\to\App.js
Marker: export default App;
Content:
console.log("before export");

5.
Type: ensure_text_exists
Target: C:\path\to\App.css
Content:
.appFooter {
  min-height: 56px;
}

6.
Type: replace_text
Target: C:\path\to\App.css
Search Text:
background: #000;
Replace With:
background: blue;

7.
Type: replace_text_regex
Target: C:\path\to\App.css
Pattern:
background:\s*#000;
Flags:
g
Replace With:
background: blue;

8.
Type: remove_text
Target: C:\path\to\App.css
Content:
.appFooter {
  width: 100%;
  max-width: 1200px;
  background: #000;
  min-height: 56px;
}

9.
Type: remove_import
Target: C:\path\to\App.js
Content:
import linkedinIcon from "./assets/linkedin-icon.svg";

10.
Type: ensure_import_exists
Target: C:\path\to\App.js
Content:
import linkedinIcon from "./assets/linkedin-icon.svg";

---

# Quick reference

## Supported actions

### replace_entire_file
Sostituisce completamente il contenuto del file.
Uso ideale: refactor completi, file CSS interi, creazione di nuovi file se la cartella padre esiste.

### append_to_file
Aggiunge testo in fondo al file se non è già presente.
Uso ideale: note, export finali, blocchi semplici.

### insert_after_marker
Inserisce testo subito dopo un marker testuale.
Uso ideale: import, righe JSX, oggetti dentro array vicino a punti noti.

### insert_before_marker
Inserisce testo subito prima di un marker testuale.
Uso ideale: inserimenti prima di chiusure array, export, return, tag di chiusura.

### ensure_text_exists
Aggiunge un blocco di testo solo se non esiste già.
Uso ideale: piccoli blocchi CSS o helper semplici.

### replace_text
Sostituisce la prima occorrenza di un testo con un nuovo testo.

Caratteristiche:
- Supporta contenuti multilinea
- Robusto rispetto ai line endings (LF / CRLF)
- Match di tipo testuale (non AST)

Uso ideale:
- cambiare colori (es. background)
- aggiornare label/testi
- modificare blocchi CSS o JSX esistenti

Attenzione:
- il match deve essere coerente (spazi e struttura contano)

### replace_text_regex
Sostituisce tramite pattern regex.

Caratteristiche:
- Supporta pattern più flessibili
- Utile quando spazi o formattazione possono variare
- Supporta Flags opzionali (es. g, i, m)

Uso ideale:
- modifiche robuste su CSS/JS semplici
- update multipli della stessa proprietà
- match con spazi variabili

Attenzione:
- pattern troppo ampi possono fare modifiche indesiderate

### remove_text
Rimuove la prima occorrenza di un blocco di testo esatto.
Uso ideale: eliminare blocchi CSS, JSX o testo noto.

### remove_import
Rimuove un import specifico se presente.
Uso ideale: pulizia import non più usati dopo refactor.

### ensure_import_exists
Aggiunge un import solo se manca già nel file.
Strategia: inserisce l'import dopo l'ultimo import esistente; se non ci sono import, lo mette in testa al file.

## Current agent flow
1. Parse task file
2. Validate git repo path e npm project path
3. git fetch / checkout main / pull
4. create branch se non esiste
5. apply activities in ordine
6. run lint:fix
7. run format
8. run test -- --watchAll=false
9. git add / commit / push

## Current limits
- Marker testuali ancora fragili su refactor complessi
- replace_text e remove_text lavorano su match testuale
- replace_text_regex è più flessibile ma non comprende la struttura logica del codice
- ensure_import_exists e remove_import non capiscono AST, quindi dipendono da import standard su una riga
- per modifiche strutturali profonde, in futuro conviene introdurre azioni AST-based

## Suggested next steps
- migliorare i messaggi di errore con preview del match mancante
- introdurre retry/fix loop su lint e test
- evolvere verso un planner LLM sopra questo executor
- valutare un layer AST per JS/TS/TSX
