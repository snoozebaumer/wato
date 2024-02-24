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
- (Story 2) Routing implementieren, es soll über Routing zum nächsten Schritt gewechselt werden können (inkl. Animation: [Route Animation](https://angular.io/guide/route-animations))

## Tag 5 - 13.02.2024
Ich rechne damit, dass mir genügend Zeit zur Verfügung steht, die Anforderungen zu erfüllen. 
Da es einfacher ist, von Anfang an Übersetzungen zu berücksichtigen, habe ich mich entschieden, das Übersetzungsframework `ngx-translate` heute einzubinden.


**Aktivitäten**
- Arbeit an Story 1: Erstellen eines Spiels
  - Erstellung der Serverkomponenten (Gateway, Game-Service, User-Service) noch ohne Datenbankverbindung.
  - Component testing
- Einbindung des Übersetzungsframeworks `ngx-translate` mit Sprachensupport für Schweizerdeutsch, Deutsch und Englisch.

**Aufgewendete Zeit**: 8h

**Zwischenbilanz Gesamtaufwand**: 23h 45min

**Nächste Schritte:**
- Datenbankverbindung für Persistenz herstellen

## Tag 6 - 14.02.2024
**Aktivitäten**
- Arbeit an Story 1: Erstellen eines Spiels
  - env-Datei für die Datenbankverbindung erstellt
  - Aufsetzen Datenbankverbindung cloud.mongodb.com
  - Challenge Service erstellt

**Aufgewendete Zeit**: 4h

**Zwischenbilanz Gesamtaufwand**: 27h 45min

**Nächste Schritte:**
- Datenbankverbindung für Persistenz herstellen

## Tag 7 - 16.02.2024
Die Fertigstellung der Story 1 dauerte aufgrund Knowhow-Beschaffung und Einbau der Übersetzungen länger als geplant. Nun sollte jedoch der Grundstein gelegt sein, um die nächsten Stories zeitgerecht umsetzen zu können.

**Aktivitäten**
- Fertigstellung Story 1: Erstellen eines Spiels
  - Datenbankverbindung hergestellt, sodass die Informationen persistiert werden und nach Erstellung die Id des Spiels zum Client zurückgegeben wird.

**Nächste Schritte:**
- Story 2: Generieren eines URLs (zum Teil abgeschlossen, da clientseitig bereits die Id des Spiels geloggt wird)
- Story 3: Aufrufen des URLs und Anzeigen des Spiels

**Aufgewendete Zeit**: 6h

**Zwischenbilanz Gesamtaufwand**: 33h 45min

## Tag 8 - 21.02.2024
Heute war aufgrund der Vorarbeit an Tag 7 etwas produktiver. Es könnte innerhalb der 60 Stunden Aufwand auch noch für die Dokumentation reichen.

**Aktivitäten**
- Fertigstellung Story 2: Generieren eines URLs
  - Anzeige des URLs auf separater Seite
  - erstes Routing
- Anfang und Fertigstellung Story 3: Aufrufen des URLs
  - Anzeige der Challenge auf separater Detailseite, auf der das Spiel stattfindet
  - Routing
  - Challenge bei Server holen

**Nächste Schritte:**
- Story 4: Spielbereich bestimmen (Formular bereits auf Detailseite vorhanden)
  - Serververbindung
  - Validierung

**Aufgewendete Zeit**: 8h

**Zwischenbilanz Gesamtaufwand**: 41h 45min

## Tag 9 - 24.02.2024
Morgen sollte ich mit der Umsetzung fertig sein und mit der Dokumentation beginnen können.

**Aktivitäten**
- Fertigstellung Story 4: Spielbereich bestimmen
  - Neues Formular für Eingabe des Spielbereichs
  - PUT-Request auf Gateway und Gameservice
- Anfang und Fertigstellung Story 5: Zahl auswählen
  - Neues Formular für Eingabe der Zahl
  - PUT-Request auf Gameservice erweitert 
  - Anfang Story 6: Spiel fertigstellen
    - Neues Formular für Zahleingabe
    - PUT-Request auf Gameservice erweitert

**Nächste Schritte:**
- Abschluss Story 6:
  - Endbildschirm mit Ergebnis, Bereich und Zahlen, welche die Spieler gewählt haben
- Story 7: Einschränkung der Bearbeitungsrechte
  - Beim Aufstarten von app.component sollte der User identifiziert werden und in einem UserService zwischengespeichert werden.
  - Anhand des Users im UserService und dem challengeStatus wird entschieden, ob die Challenge angezeigt wird oder nicht.

**Aufgewendete Zeit**: 9h

**Zwischenbilanz Gesamtaufwand**: 50h 45min