# Arbeitsjournal WEBLAB BW
___
**Projektname**: WATO - What are the Odds

**Autor**: Samuel Nussbaumer

**Organisation**: HSLU - Hochschule Luzern

**Semester**: HS23
___

## Tag 1 - 05.02.2024
Am ersten Blockwochentag wird das Standardprojekt, welches nach der BW umzusetzen
wäre, vorgestellt. Dieses finde ich nicht besonders interessant, deshalb definiere
ich ein eigenes Projekt.

**Aktivitäten**:
- Recherche eines möglichen Projekts
- Technologierecherche / Machbarkeit
- Definition Projektanforderungen

**Aufgewendete Zeit**: 4h

**Zwischenbilanz Gesamtaufwand**: 4h

## Tag 2 - 06.02.2024
**Aktivitäten**:
- Definition Projektanforderungen
- Definition Technologiestack
- Abgrenzung

**Aufgewendete Zeit**: 4h

**Zwischenbilanz Gesamtaufwand**: 8h

## Tag 3 - 07.02.2024
**Aktivitäten**
- Aufsetzen aller voraussichtlich gebrauchten Repos auf github
- Nachtrag Arbeitsjournal der letzten Tage, sowie Tag 3

**Aufgewendete Zeit**: 45 min

**Zwischenbilanz Gesamtaufwand**: 8h 45min

## Tag 4 - 12.02.2024
**Aktivitäten**
- Arbeit an Story 1: Erstellen eines Spiels
  - Initialiserung des Angular Projekts in `wato-frontend`
  - Erstellung der Komponente "CreateChallenge" inkl. Styling
- Recherche zu Angular Animations und Übersetzungsframeworks

**Aufgewendete Zeit**: 7h

**Zwischenbilanz Gesamtaufwand**: 15h 45min

**Nächste Schritte:**
- Serverkomponenten erstellen (Gateway, Game-Service, User-Service) und Formulardaten an den Server senden
- Routing implementieren, es soll über Routing zum nächsten Schritt gewechselt werden können (inkl. Animation: [Route Animation](https://angular.io/guide/route-animations))

## Tag 5 - 13.02.2024
Ich rechne damit, dass mir genügend Zeit zur Verfügung steht, die Anforderungen zu erfüllen. 
Da es einfacher ist, von Anfang an Übersetzungen zu berücksichtigen, habe ich mich entschieden, das Übersetzungsframework `ngx-translate` heute einzubinden.


**Aktivitäten**
- Arbeit an Story 1: Erstellen eines Spiels
  - Erstellung der Serverkomponenten (Gateway, Game-Service, User-Service) noch ohne Datenbankverbindung.
- Einbindung des Übersetzungsframeworks `ngx-translate` mit Sprachensupport für Schweizerdeutsch, Deutsch und Englisch.

**Aufgewendete Zeit**: 8h

**Zwischenbilanz Gesamtaufwand**: 23h 45min

**Nächste Schritte:**
- Datenbankverbindung für Persistenz herstellen
- Routing implementieren
