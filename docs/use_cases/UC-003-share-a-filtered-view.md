# Use Case: Gefilterte Ansicht teilen

## Overview

**Use Case ID:** UC-003
**Use Case Name:** Gefilterte Ansicht teilen
**Primary Actor:** Besucher
**Goal:** Der Besucher gibt eine von ihm eingeschränkte Sicht auf die Anlässe und Kurse als Link weiter, sodass Dritte genau dieselbe Auswahl sehen.
**Status:** Implemented

## Preconditions

- Die Übersicht ist geöffnet.
- Der Besucher hat mindestens ein Filterkriterium gesetzt (UC-002) — andernfalls wird die ungefilterte Übersicht geteilt.

## Main Success Scenario

1. Der Besucher schränkt die Übersicht auf die gewünschten Anlässe und Kurse ein.
2. Das System bildet die gesetzten Kriterien laufend in der Adresse der Seite ab.
3. Der Besucher kopiert die Adresse und gibt sie weiter.
4. Ein Empfänger öffnet die erhaltene Adresse.
5. Das System übernimmt die in der Adresse enthaltenen Kriterien als gesetzte Filter.
6. Das System zeigt dem Empfänger dieselbe eingeschränkte Liste an.

## Alternative Flows

### A1: Adresse ohne Kriterien

**Trigger:** Die geöffnete Adresse enthält keine Filterkriterien (Schritt 5)
**Flow:**

1. Das System setzt keine Kriterien und zeigt alle kommenden Anlässe und Kurse an.
2. Use case ends.

### A2: Zwischenzeitlich veränderter Datenbestand

**Trigger:** Seit dem Teilen des Links wurden die Anlassdaten abgeglichen (UC-006) und Angebote sind hinzugekommen oder entfallen (Schritt 6)
**Flow:**

1. Das System wendet die Kriterien auf den aktuellen Datenbestand an; die angezeigte Liste kann von der ursprünglich geteilten abweichen.
2. Use case ends.

## Postconditions

### Success Postconditions

- Die Adresse der Seite spiegelt die aktuell gesetzten Kriterien.
- Der Empfänger sieht die Übersicht mit denselben Kriterien wie der Absender.

### Failure Postconditions

- Keine; enthält die Adresse unbekannte Angaben, werden diese ignoriert und die Übersicht wird ohne sie angezeigt.

## Business Rules

### BR-017: Kriterien in der Adresse

Alle gesetzten Filterkriterien — Organisationen, Angebotstyp, Suchtext, Kursarten, freie Plätze und offene Anmeldung — werden in der Adresse der Seite abgebildet. Nicht gesetzte Kriterien erscheinen nicht.

### BR-018: Übernahme beim Öffnen

Beim Öffnen einer Adresse werden genau die darin enthaltenen Kriterien als gesetzt übernommen; alle übrigen Kriterien bleiben ungesetzt.

### BR-019: Keine zusätzlichen Verlaufseinträge

Das Ändern von Kriterien ersetzt den aktuellen Eintrag im Verlauf des Browsers, statt einen neuen anzulegen. Die Schaltfläche "Zurück" führt den Besucher damit zur vorherigen Seite und nicht durch die Folge seiner Filterschritte.
