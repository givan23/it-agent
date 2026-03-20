# Agent Task Template v20

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
Type: replace_text_regex
Target: C:\path\to\App.css
Pattern:
background:\s*#000;
Flags:
g
Replace With:
background: blue;

3.
Type: ast_ensure_import_exists
Target: C:\path\to\App.js
Import Module: ./assets/linkedin-icon.svg
Import Default Name: linkedinIcon

4.
Type: ast_append_object_to_array
Target: C:\path\to\App.js
Array Name: socialCards
Object:
{
  icon: linkedinIcon,
  title: "LINKEDIN",
  description: "New card from AST",
}

5.
Type: ast_remove_import
Target: C:\path\to\App.js
Import Module: ./assets/linkedin-icon.svg
Import Default Name: linkedinIcon

---

# Quick reference

## Text / regex actions
- replace_entire_file
- append_to_file
- insert_after_marker
- insert_before_marker
- ensure_text_exists
- replace_text
- replace_text_regex
- remove_text
- remove_import
- ensure_import_exists

## AST actions
### ast_ensure_import_exists
Aggiunge un import in modo strutturale usando l'AST.
Uso ideale: JS/TS/JSX/TSX, quando vuoi evitare marker fragili.

### ast_remove_import
Rimuove un import cercando il modulo nell'AST.
Uso ideale: refactor puliti sugli import.

### ast_append_object_to_array
Aggiunge un object literal a un array dichiarato nel file.
Uso ideale: array come socialCards, menu items, config arrays.

## Notes
- Le action AST supportano solo file .js, .jsx, .ts, .tsx
- Richiedono la dipendenza ts-morph
- Sono molto più robuste delle azioni testuali per import e array
- Non sostituiscono ancora il motore testuale per CSS o markdown

## Current limits
- Le action AST implementate coprono solo import e append su array
- Manca ancora un'azione per rimuovere in modo strutturale un elemento da un array
- Non c'è ancora supporto AST per JSX insertion
- ast_append_object_to_array si aspetta un array literal dichiarato nel file target

## Suggested next steps
- aggiungere `ast_remove_array_element_by_property`
- valutare `ast_remove_array_element_by_index` solo come supporto tecnico
- introdurre action AST per JSX insertion
- migliorare i messaggi di errore con preview del match mancante
- introdurre retry/fix loop su lint e test

### Next AST action to add
`ast_remove_array_element_by_property`
Esempio d’uso:
Type: ast_remove_array_element_by_property
Target: C:\path\to\App.js
Array Name: socialCards
Property Name: title
Property Value: TELEGRAM
