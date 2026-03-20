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
- non è ancora regex-based (match parziale intelligente)

### ensure_import_exists
Aggiunge un import solo se manca già nel file.
Strategia: inserisce l'import dopo l'ultimo import esistente; se non ci sono import, lo mette in testa al file.

## Current agent flow (v1.7 execution engine per agenti AI)
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
- replace_text lavora su match testuale (non regex avanzata)
- non supporta ancora match flessibili (es. spazi variabili)
- ensure_import_exists non capisce AST, quindi dipende da import standard su una riga
- per modifiche strutturali profonde, in futuro conviene introdurre azioni regex o AST-based

## Next steps
- Step successivo (V1.8)
  - replace_text_regex
  - remove_text
  - remove_import
- Step successivo (V2)
  - AST layer per manipolazioni più robuste
    - Quando vorrai farlo davvero:
        - babel/parser
        - @babel/traverse
        - @babel/generator
        - ts-morph 🔥 (consigliato)
