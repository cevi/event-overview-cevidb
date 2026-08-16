# Use Case: Übersicht in fremde Website einbetten

## Overview

**Use Case ID:** UC-005
**Use Case Name:** Übersicht in fremde Website einbetten
**Primary Actor:** Website-Betreiber
**Goal:** Der Betreiber einer fremden Website zeigt die Anlass- und Kursübersicht — bei Bedarf bereits eingeschränkt — innerhalb seiner eigenen Seite an, ohne den Seitenkopf und den Seitenfuss der Übersicht zu übernehmen.
**Status:** Implemented

## Preconditions

- Der Website-Betreiber verfügt über eine Seite, in die er fremde Inhalte einbinden kann.
- Die Übersicht ist öffentlich erreichbar.

## Main Success Scenario

1. Der Website-Betreiber stellt die Adresse der Übersicht zusammen und kennzeichnet sie als eingebettete Darstellung.
2. Der Website-Betreiber ergänzt bei Bedarf die gewünschten Filterkriterien in der Adresse (UC-003).
3. Der Website-Betreiber bindet die Adresse in seine Seite ein.
4. Ein Besucher öffnet die Seite des Website-Betreibers.
5. Das System erkennt die Kennzeichnung als eingebettete Darstellung und zeigt die Übersicht ohne Seitenkopf und Seitenfuss sowie ohne Seitenrand an.
6. Das System übernimmt die in der Adresse enthaltenen Filterkriterien und zeigt die entsprechende Liste an.
7. Der Besucher durchsucht und filtert die eingebettete Übersicht wie die eigenständige Übersicht (UC-001, UC-002).

## Alternative Flows

### A1: Keine Kennzeichnung als eingebettete Darstellung

**Trigger:** Die Adresse ist nicht oder nicht mit dem Wert "wahr" als eingebettete Darstellung gekennzeichnet (Schritt 5)
**Flow:**

1. Das System zeigt die Übersicht vollständig mit Seitenkopf und Seitenfuss an.
2. Use case continues at step 6.

### A2: Angebotsliste kann nicht geladen werden

**Trigger:** Das System kann die Anlässe und Kurse nicht bereitstellen (Schritt 6)
**Flow:**

1. Das System zeigt innerhalb der eingebetteten Darstellung den Fehlerhinweis aus UC-001.
2. Use case ends.

## Postconditions

### Success Postconditions

- Die Übersicht erscheint als Bestandteil der fremden Website, ohne Seitenkopf und Seitenfuss.
- Die vom Website-Betreiber vorgegebenen Filterkriterien sind gesetzt.

### Failure Postconditions

- Der Besucher der fremden Website sieht einen Fehlerhinweis anstelle der Liste; es wurden keine Daten verändert.

## Business Rules

### BR-024: Kennzeichnung der eingebetteten Darstellung

Die eingebettete Darstellung wird ausschliesslich dann verwendet, wenn die Adresse die entsprechende Kennzeichnung mit dem Wert "wahr" enthält.

### BR-025: Umfang der eingebetteten Darstellung

In der eingebetteten Darstellung entfallen Seitenkopf, Seitenfuss und der Seitenrand. Damit entfällt auch die Sprachwahl (UC-004); massgebend ist die vom Website-Betreiber eingebundene Sprachvariante.

### BR-026: Vorbelegung der Kriterien durch den Website-Betreiber

Der Website-Betreiber kann die Übersicht über die Filterkriterien in der Adresse vorbelegen (BR-017); der Besucher kann diese Kriterien anschliessend selbst ändern.

### BR-027: Zugriff von fremden Websites

Die Anlass- und Auswahldaten dürfen aus dem Browser von Websites unter `cevi.ch` und `cevi.tools` abgerufen werden; Anfragen anderer Ursprungsseiten weist das System zurück. Ein Zugangsschutz mit Anmeldung besteht nicht: Zugriffe ohne Ursprungsseite bleiben unbeschränkt.

### BR-040: Einbettende Websites

Die Übersicht darf ausschliesslich in Seiten unter `cevi.ch` und `cevi.tools` eingebettet werden. Bettet eine andere Website die Übersicht ein, verweigert der Browser die Darstellung.
