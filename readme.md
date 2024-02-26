# Architekturdokumentation WATO

___
**Projektname**: WATO - What are the Odds

**Autor**: Samuel Nussbaumer

**Organisation**: HSLU - Hochschule Luzern

**Semester**: HS23
___

## Bestandteile der Software

- Frontend: [wato-frontend](https://github.com/snoozebaumer/wato-frontend)
- Backend:
  - Gateway: [wato-gateway](https://github.com/snoozebaumer/wato-gateway)
  - Game Service: [wato-game](https://github.com/snoozebaumer/wato-game)
  - User Service: [wato-user](https://github.com/snoozebaumer/wato-user)

## Einleitung und Zielsetzung
![wato-start-screen.png](img/wato-start-screen.png)

WATO setzt das Spiel [**What are the Odds?**](https://www.wikihow.com/Play-What-Are-the-Odds), zu Deutsch **Was sind die Chancen?**, oder in meinem Umfeld unter **Eis zu wievill?** bekannt, um. Das Spiel ist ein Partyspiel, bei dem zwei Spieler gegeneinander antreten.
Ein Spieler stellt dem anderen eine Aufgabe. Der Herausgeforderte gibt anhand seiner Bereitschaft, die Aufgabe zu erfüllen, eine Wahrscheinlichkeit an (Bsp. 1/100). Innerhalb dieses Wahrscheinlichkeitsbereichs
(Bsp. 1-100) nennen anschliessend beide Spieler gleichzeitig eine Zahl. Nennen Sie die gleiche Zahl, so muss der Herausgeforderte die Aufgabe erfüllen. Nennen sie unterschiedliche Zahlen, passiert nichts.

Da die Zahlen gleichzeitig genannt werden, ist das Spiel online nicht ohne weiteres spielbar. Deshalb wird eine Webapplikation entwickelt, welche das Spiel asynchron ermöglicht.
Dabei soll es für einen Spieler nicht möglich sein, die Zahl, die das gegenüber genannt hat, zu sehen, bevor er seine eigene genannt hat.

### Ablauf
Der generelle (vereinfachte) Ablauf des asynchronen Spiels sollte folgendermassen aussehen:
![wato-ablauf.png](img/wato-ablauf.png)
[Bild in Vollauflösung](img/wato-ablauf.png)

## Lösungsstrategie

![wato-components.png](img/wato-components.png)
[Bild in Vollauflösung](img/wato-components.png)

Die Webapplikation besteht aus einem Frontend und einem Backend. 
- Das Frontend ist in Angular umgesetzt, das Backend in Node.js.
- Das Backend besteht aus einem Gateway und den zwei Microservices _wato-game_ und _wato-user_, welche ihre Daten in je einer externen MongoDB persistieren. 
- Die Microservices sind in sich geschlossen und kommunizieren nur über das Gateway mit dem Frontend. So könnte, falls die Applikation erweitert wird, beispielsweise mit einem AuthService, dieser einfach hinzugefügt werden, ohne dass die anderen Services davon betroffen sind.
Ebenso sind die Microservices so in ihrer Technologie offen, sie könnten also auch in Java geschrieben werden. Der einfacheren Umsetzung wegen wird jedoch hier auf eine einheitliche Technologie gesetzt.
- Die Kommunikation zwischen Frontend und Backend, sowie Gateway und Microservices erfolgt über REST.

## Bausteinsicht

### Ebene 1

### Ebene 2

### Ebene 3

## Laufzeitsicht

## Verteilung

## Querschnittliche Konzepte

## Entwurfsentscheidungen

## Qualitätsanforderungen


