# Fazit & Reflexion BW WEBLAB

___
**Projektname**: WATO - What are the Odds

**Autor**: Samuel Nussbaumer

**Organisation**: HSLU - Hochschule Luzern

**Semester**: HS23
___


## Fazit zum Aufwand
Siehe [Arbeitsjournal](arbeitsjournal.md) für detaillierte Aufwandangaben.

Ich habe für das Projekt rund 20h mehr Zeit aufgewendet, als in den Projektanforderungen bestimmt war. Dies hat mehrere mögliche Gründe:
- Ich hatte die Projektidee selbst definiert, habe so mehr Zeit in die Anforderungsdefinition investiert, als ich es bei einem vorgegebenen Projekt getan hätte. Zudem hatte ich dadurch, dass es ein persönliches Projekt war, höhere Ansprüche an die Umsetzung.
    - Ich habe mich während des Projekts dazu entschieden, Übersetzungen zu integrieren, da ich die Applikation auf Schweizerdeutsch brauchen möchte -> Mehraufwand. 
- Ich musste mich in die Technologien einarbeiten, da ich diese entweder noch nie oder schon lange nicht mehr verwendet hatte.
- Nach der definitiven Abgabe der eigens definierten Anforderungen am Mittwoch, 07.02.2024 kam am Donnerstag 08.02.2024 noch die Anforderung dazu, dass die Webapplikation automatisiert getestet werden müsse.
Aus meiner Erfahrung ist der Aufwand inklusive Testing 1.5-2x so hoch, wie ohne. Natürlich ist Testen wichtig, jedoch plante ich bei einem kleineren Projekt wie diesem ausschliesslich manuelle Test ein. 
Schlussendlich habe ich die Komponenten (app, challenge-creation, challenge-detail) des Frontends automatisiert getestet, was sicher gut war, jedoch rund 5h Zeit zusätzlich in Anspruch nahm.
- Für die Dokumentation habe ich ungefähr 16h aufgewendet. Dies ist etwas mehr, als ich anfangs gedacht habe.


## Fazit zum erstellten Produkt
Das erstellte Spiel erfüllt laut [Testprotokoll](testprotokoll.md) alle Anforderungen ausser einer, die leicht angepasst wurde (s. unten).
Im kleinen Kreis würde ich das Produkt so einsetzen, müsste es jedoch für den produktiven Einsatz für eine grössere Anzahl an Benutzern noch anpassen.

Trotzdem fallen mir während der Umsetzung und des Testens einige Punkte auf, welche ich gerne noch verbessert hätte:
- In challenge-detail.component.html werden Inhalte angezeigt, bevor die Challenge geladen wurde und geprüft wurde, ob der Spieler überhaupt berechtigt ist, die Challenge zu sehen.
Dies fällt bei der lokalen Ausführung nicht auf. Bei einer langsamen Datenverbindung übers Internet könnte ein nicht berechtigter User Dummy-Daten sehen, bevor er auf die ShareComponent weitergeleitet wird. 
Ich würde dies mit einem Ladeindikator, falls noch keine Challenge geladen wurde, lösen.
- Das Spiel wird nie erklärt. Es wird davon ausgegangen, dass der Spieler das Spiel bereits kennt. Ich würde eine kurze Erklärung des Spiels in die Challenge-Create-Component einbauen.
- Meine PUT-Requests sind nicht idempotent. Ich würde diese noch auf PATCH-Requests umstellen.
- Die Applikation prüft nur clientseitig, ob der Benutzer zu einer Aktion berechtigt ist. Ein Angreifer könnte also die Applikation manipulieren und so beispielsweise die Zahl des Herausgeforderten setzen. Da es sich hierbei um ein Spiel und keine E-Banking-Applikation handelt, ist das Risiko jedoch geringer. Die serverseitige Prüfung könnte in Zukunft noch implementiert werden.
- Langer, undokumentierter Code: siehe [Projektdokumentation > Technische Schulden](../readme.md#technische-schulden-und-risiken)


### Abgeänderte Anforderungen
Das Akzeptanzkriterium 3 der Story 3 (Aufrufen des URLs): "Nach erstmaligen Aufrufen des URLs durch Spielers B wird dieser als zweiter Spieler
festgelegt." wurde angepasst, da dies ohne Namen relativ wenig Sinn ergibt. Der Spieler wird unter Angabe seines Namens und des Bereiches nach Absenden des Formulars als zweiten Spieler festgelegt.

## Reflexion zur Projektausführung
Alles in allem bin ich zufrieden mit dem Projekt. Ich hatte die Idee schon längere Zeit im Kopf, da es schon einmal eine ähnliche Webapplikation gab, die in meinem Freundeskreis benutzt wurde, dann aber offline ging.
Da ich die Anforderungen selbst definiert hatte und ich das Projekt allein bearbeitete, hatte ich Anfangs etwas Mühe, mich an den Scope der Stories zu halten. Ständig kamen mir sowohl innerhalb als auch ausserhalb des Kontexts der momentanen Story neue Ideen, die ich anfangs des Projekts auch verfolgt habe.
Im Laufe des Projekts habe ich bemerkt, dass die Zeit davonrennt und mich dann genauer an die Akzeptanzkriterien der Stories gehalten.

Mir hat es trotz des enormen Aufwands viel Spass bereitet, das Projekt umzusetzen. Ich habe viel gelernt, konnte mich in den gebrauchten Technologien vertiefen, und bin froh, dass ich mich für dieses Projekt und die Blockwoche entschieden habe.

