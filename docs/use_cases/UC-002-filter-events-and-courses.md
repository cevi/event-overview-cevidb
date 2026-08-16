# Use Case: Anlässe und Kurse filtern

## Overview

**Use Case ID:** UC-002
**Use Case Name:** Anlässe und Kurse filtern
**Primary Actor:** Besucher
**Goal:** Der Besucher schränkt die Übersicht so ein, dass nur noch die für ihn relevanten Anlässe und Kurse übrig bleiben.
**Status:** Implemented

## Preconditions

- Die Übersicht ist geöffnet und die Auswahlkriterien wurden geladen (UC-001).

## Main Success Scenario

1. Der Besucher wählt einen der angebotenen beliebten Filter für ein Kursangebot (zum Beispiel "J+S-Leiter/-in werden") oder öffnet die Filterauswahl für die weiteren Kriterien.
2. Der Besucher setzt in der Filterauswahl eine oder mehrere Organisationen, den Angebotstyp, einen Suchtext für den Namen, eine oder mehrere Kursarten, die Angabe zu freien Plätzen und die Angabe zur offenen Anmeldung.
3. Das System ermittelt nach jeder Änderung die Angebote, die allen gesetzten Kriterien entsprechen.
4. Das System zeigt die eingeschränkte Liste an und vermerkt am Zugang zur Filterauswahl, wie viele Kriterien aktiv sind.
5. Der Besucher schliesst die Filterauswahl und arbeitet mit der eingeschränkten Liste weiter.

## Alternative Flows

### A1: Filter zurücksetzen

**Trigger:** Der Besucher setzt die Filter zurück (Schritt 5)
**Flow:**

1. Das System entfernt sämtliche gesetzten Kriterien.
2. Das System zeigt wieder alle kommenden Anlässe und Kurse an.
3. Use case ends.

### A2: Beliebter Filter ersetzt die Kursartenauswahl

**Trigger:** Der Besucher wählt einen beliebten Filter, während bereits Kursarten von Hand gesetzt sind (Schritt 1)
**Flow:**

1. Das System ersetzt die bisher gewählten Kursarten durch die Kursarten des gewählten beliebten Filters.
2. Use case continues at step 3.

### A3: Alle Organisationen auf einmal wählen

**Trigger:** Der Besucher wählt in der Organisationsauswahl die Sammelauswahl (Schritt 2)
**Flow:**

1. Das System wählt alle verfügbaren Organisationen aus beziehungsweise hebt die gesamte Auswahl wieder auf.
2. Use case continues at step 3.

### A4: Kein Angebot entspricht den Kriterien

**Trigger:** Zu den gesetzten Kriterien gibt es kein Angebot (Schritt 3)
**Flow:**

1. Das System zeigt eine leere Liste an; die Kriterien bleiben gesetzt.
2. Use case continues at step 2.

## Postconditions

### Success Postconditions

- Die Liste enthält nur noch Angebote, die allen gesetzten Kriterien entsprechen.
- Die gesetzten Kriterien sind in der Adresse der Seite abgebildet (UC-003).

### Failure Postconditions

- Kann die eingeschränkte Liste nicht ermittelt werden, sieht der Besucher den Fehlerhinweis aus UC-001; die gesetzten Kriterien bleiben erhalten.

## Business Rules

### BR-008: Nicht gesetzte Kriterien werden ignoriert

Ein Kriterium, das der Besucher nicht gesetzt hat, schränkt die Ergebnisliste nicht ein.

### BR-009: Kriterien werden gemeinsam angewendet

Ein Angebot erscheint nur dann in der Liste, wenn es sämtliche gesetzten Kriterien gleichzeitig erfüllt.

### BR-010: Namenssuche

Die Namenssuche findet Angebote, deren Name den Suchtext an beliebiger Stelle enthält; Gross- und Kleinschreibung spielen keine Rolle.

### BR-011: Auswahl mehrerer Organisationen oder Kursarten

Sind mehrere Organisationen oder mehrere Kursarten gewählt, erscheint ein Angebot, sobald es einer der gewählten Organisationen beziehungsweise einer der gewählten Kursarten entspricht.

### BR-012: Beliebte Filter

Jeder beliebte Filter steht für eine fest hinterlegte Menge von Kursarten. Der beliebte Filter "weitere Angebote" steht für alle Kursarten, die zu keinem der benannten beliebten Filter gehören.

### BR-013: Beliebter Filter ersetzt die bisherige Kursartenauswahl

Die Auswahl eines beliebten Filters ersetzt die zuvor gewählten Kursarten vollständig, statt sie zu ergänzen.

### BR-014: Verzögerte Namenssuche

Die Namenssuche wird erst angewendet, wenn der Besucher die Eingabe kurz unterbricht. Eine unveränderte Eingabe löst keine neue Suche aus.

### BR-015: Zurücksetzen

Das Zurücksetzen entfernt alle Kriterien, einschliesslich eines gewählten beliebten Filters. Die Schaltfläche zum Zurücksetzen steht nur zur Verfügung, wenn mindestens ein Kriterium gesetzt ist.

### BR-016: Anzahl aktiver Kriterien

Die Anzahl der aktiven Kriterien aus der Filterauswahl wird am Zugang zur Filterauswahl ausgewiesen; ein leerer Suchtext zählt nicht als aktives Kriterium.

### BR-045: Umfang der Kriterien

Eine Anfrage darf je Kriterienliste höchstens 200 Einträge und im Suchtext höchstens 200 Zeichen enthalten. Umfangreichere Anfragen weist das System zurück, ohne eine Liste zu liefern.
