# InfoVisProjekt

Interaktive Visual-Analytics-Anwendung zur Analyse des Medaillenspiegels der Olympischen Sommerspiele 2024. Das Projekt untersucht, ob die Frage nach der sportlich erfolgreichsten Nation allein mit der klassischen Medaillentabelle beantwortet werden kann, oder ob Sportartenverteilung, demografische Kennzahlen, Wirtschaftskraft und historische Entwicklung eine differenziertere Bewertung erfordern.

Die Anwendung ist in Elm umgesetzt und visualisiert die Daten als Medaillenspiegel, Sunburst-Diagramm, parallele Koordinaten und Heatmap. Ergaenzend enthaelt das Repository einen LaTeX-Bericht zur Motivation, Datenbasis, Gestaltung und Implementierung.

## Features

- Medaillenspiegel fuer Paris 2024 mit Gold-, Silber-, Bronze- und Gesamtwertung.
- Alternative Rankings nach Medaillen pro Einwohner, Medaillen pro BIP und Medaillen pro Median-Alter.
- Sunburst-Diagramm zur Verteilung der Medaillen eines ausgewaehlten Landes nach Sportarten, Kategorien und Events.
- Parallele Koordinaten zum Vergleich der Laenderrankings mit Drag-and-Drop-Achsen, Hover und Fokusauswahl.
- Heatmap zur historischen Entwicklung der Medaillenzahlen je Land seit 1896.
- Interaktive Verknuepfung der Visualisierungen: Auswahl im Medaillenspiegel aktualisiert Sunburst und Fokus in den parallelen Koordinaten.

## Datenbasis

Die Anwendung laedt CSV-Dateien aus `public/data/` und verarbeitet sie direkt im Browser:

- `medals2024.csv`: Medaillen der Olympischen Sommerspiele 2024 mit Medaillentyp, Athlet, Land, Sportart und Event.
- `medalsHistory.csv`: historische Medaillenspiegel der Olympischen Sommerspiele.
- `world_population_data.csv`: Bevoelkerung und Medianalter je Land.
- `world_data_2023.csv`: Bruttoinlandsprodukt je Land.

Die Vorverarbeitung geschieht in Elm. Dazu gehoeren CSV-Decoding, Aggregation nach Laendern, Entfernen doppelter Sport-Event-Medaillen-Kombinationen, Normalisierung von Laendernamen, manuelle Overrides fuer einzelne fehlende Kennzahlen und der Ausschluss von Teams ohne valide demografische Referenzwerte aus den relativen Rankings.

## Projektstruktur

```text
.
|-- elm.json
|-- public/
|   |-- index.html
|   |-- main.js
|   `-- data/
|-- src/
|   |-- Main.elm
|   |-- Model.elm
|   |-- Update.elm
|   |-- View.elm
|   |-- Helpers.elm
|   `-- Components/
|       |-- HeatMap.elm
|       |-- ParallelCoordinates.elm
|       `-- Sunburst.elm
`-- bericht/
    |-- main.tex
    |-- literatur.bib
    `-- Kapitel/
```

## Voraussetzungen

- Elm `0.19.1`
- Ein lokaler HTTP-Server zum Ausliefern von `public/`

Die CSV-Dateien werden per HTTP ueber relative Pfade wie `data/medals2024.csv` geladen. Deshalb sollte die App nicht direkt als lokale Datei im Browser geoeffnet werden, sondern ueber einen Webserver mit `public/` als Root-Verzeichnis laufen. Die relativen Pfade sind wichtig, damit die Anwendung auch unter einem GitHub-Pages-Projektpfad wie `https://<user>.github.io/<repo>/` funktioniert.

## Anwendung starten

1. Elm-JavaScript bauen:

   ```sh
   elm make src/Main.elm --output=public/main.js
   ```

2. Lokalen Server im `public/`-Verzeichnis starten:

   ```sh
   cd public
   python3 -m http.server 8000
   ```

3. Im Browser oeffnen:

   ```text
   http://localhost:8000
   ```

## Entwicklung

Der Einstiegspunkt ist `src/Main.elm`. Die Anwendung folgt der Elm Architecture:

- `Model.elm` definiert Datentypen, CSV-Decoder, HTTP-Requests, Normalisierung und abgeleitete Modelle fuer die Visualisierungen.
- `Update.elm` verarbeitet Ladeergebnisse und Nutzerinteraktionen.
- `View.elm` baut die Seite und verbindet die einzelnen Visualisierungen.
- `src/Components/` enthaelt die eigenstaendigen Visualisierungskomponenten.
- `Helpers.elm` enthaelt die Zuordnung von NOC-Codes zu Laendernamen.

Nach Aenderungen am Elm-Code muss `public/main.js` neu gebaut werden:

```sh
elm make src/Main.elm --output=public/main.js
```

## GitHub Pages

Das Repository enthaelt einen GitHub-Actions-Workflow unter `.github/workflows/pages.yml`. Bei jedem Push auf `main` oder bei manuellem Start ueber `workflow_dispatch` wird die Elm-Anwendung gebaut und der Inhalt von `public/` als GitHub-Pages-Artefakt deployt.

Damit das Deployment laeuft, muss in GitHub unter `Settings` -> `Pages` -> `Build and deployment` als Source `GitHub Actions` ausgewaehlt sein.

## Bericht

Der Bericht liegt in `bericht/` und beschreibt Motivation, Daten, Visualisierungsentscheidungen, Interaktionen und Implementierung. Einstiegspunkt ist:

```text
bericht/main.tex
```

Mit einer lokalen LaTeX-Installation kann der Bericht beispielsweise mit `latexmk` gebaut werden:

```sh
latexmk -pdf bericht/main.tex
```

## Hinweise

- `public/main.js` ist das kompilierte Elm-Bundle und wird von `public/index.html` eingebunden.
- Historische Laenderbezeichnungen werden fuer vergleichbare Zeitreihen auf normalisierte Namen abgebildet.
- Das Refugee Olympic Team und Individual Neutral Athletes werden in Kennzahl-basierten Rankings nicht beruecksichtigt, da keine sinnvollen Bevoelkerungs- oder BIP-Werte existieren.
