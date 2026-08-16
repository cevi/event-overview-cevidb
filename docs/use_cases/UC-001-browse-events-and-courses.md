# Use Case: Anlässe und Kurse durchsuchen

## Overview

**Use Case ID:** UC-001
**Use Case Name:** Anlässe und Kurse durchsuchen
**Primary Actor:** Besucher
**Goal:** Der Besucher verschafft sich einen Überblick über die kommenden Anlässe und Kurse des Cevi und gelangt von dort zur Anmeldung des Angebots, das ihn interessiert.
**Status:** Implemented

## Preconditions

- Die Übersicht ist öffentlich zugänglich; eine Anmeldung ist nicht erforderlich.
- Es wurden bereits Anlassdaten aus der Cevi.DB geladen (siehe UC-006).

## Main Success Scenario

1. Der Besucher öffnet die Anlass- und Kursübersicht.
2. Das System ermittelt die verfügbaren Auswahlkriterien (Organisationen, Angebotstypen, Kursarten) und die Liste der aktuell sichtbaren Anlässe und Kurse.
3. Das System zeigt die Anlässe und Kurse seitenweise in einer Tabelle mit Organisation, Name, Startdatum, Enddatum, Angabe zu freien Plätzen und Angabe, ob die Anmeldung offen ist.
4. Der Besucher blättert durch die Seiten oder wählt eine andere Anzahl Einträge pro Seite.
5. Der Besucher sortiert die Liste nach einer Spalte seiner Wahl.
6. Der Besucher klappt einen Eintrag auf und liest die ausführliche Beschreibung des Angebots.
7. Der Besucher öffnet den Anmeldelink des gewählten Angebots in einem neuen Fenster und verlässt die Übersicht in Richtung Cevi.DB.

## Alternative Flows

### A1: Kein Angebot gefunden

**Trigger:** Zu den aktuell gesetzten Kriterien gibt es keine Anlässe oder Kurse (Schritt 3)
**Flow:**

1. Das System zeigt eine leere Tabelle ohne Einträge an.
2. Der Besucher passt die Kriterien an (UC-002) oder setzt sie zurück.
3. Use case continues at step 3.

### A2: Angebotsliste kann nicht geladen werden

**Trigger:** Das System kann die Liste der Anlässe und Kurse nicht bereitstellen (Schritt 2)
**Flow:**

1. Das System zeigt den Hinweis, dass die Anlässe und Kurse nicht geladen werden konnten und es später erneut versucht werden soll.
2. Use case ends.

### A3: Auswahlkriterien können nicht geladen werden

**Trigger:** Das System kann die verfügbaren Auswahlkriterien nicht bereitstellen (Schritt 2)
**Flow:**

1. Das System zeigt den Hinweis, dass die Filterkriterien nicht geladen werden konnten.
2. Use case ends.

### A4: Angebot ohne Uhrzeit

**Trigger:** Für ein Datum eines Angebots ist keine Uhrzeit hinterlegt (Schritt 3)
**Flow:**

1. Das System zeigt für dieses Datum nur den Tag ohne Uhrzeit an.
2. Use case continues at step 4.

## Postconditions

### Success Postconditions

- Der Besucher hat die Liste der kommenden Anlässe und Kurse gesehen.
- Der Besucher wurde auf Wunsch zum Anmeldeangebot in der Cevi.DB weitergeleitet.
- Der Datenbestand des Systems ist unverändert.

### Failure Postconditions

- Der Besucher sieht einen Fehlerhinweis anstelle der Liste; es wurden keine Daten verändert.

## Business Rules

### BR-001: Nur zukünftige Angebote

Es werden ausschliesslich Anlässe und Kurse angezeigt, deren Start am aktuellen Tag oder später liegt. Bereits begonnene oder vergangene Termine erscheinen nicht in der Übersicht.

### BR-002: Standardsortierung nach Startdatum

Ohne eigene Sortierung des Besuchers erscheinen die Angebote aufsteigend nach Startdatum.

### BR-003: Freie Plätze

Ein Angebot hat freie Plätze, wenn keine Teilnehmerobergrenze hinterlegt ist oder die Anzahl der angemeldeten Teilnehmenden kleiner als die Obergrenze ist.

### BR-004: Offene Anmeldung

Ein Kurs gilt als offen zur Anmeldung, wenn sein Anmeldezustand "offen" ist. Ein Anlass gilt als offen zur Anmeldung, wenn der aktuelle Tag innerhalb des Anmeldefensters liegt; eine fehlende Ober- oder Untergrenze des Anmeldefensters gilt als unbegrenzt.

### BR-005: Seitengrösse

Die Liste zeigt standardmässig 10 Einträge pro Seite. Der Besucher kann zwischen 10, 20, 50 und 100 Einträgen pro Seite wählen.

### BR-006: Datumsdarstellung ohne Uhrzeit

Ein Termin, dessen Uhrzeit auf Mitternacht fällt, gilt als Termin ohne Uhrzeitangabe und wird nur mit dem Datum dargestellt.

### BR-007: Anmeldung ausserhalb des Systems

Die Anmeldung zu einem Anlass oder Kurs erfolgt nicht in der Übersicht, sondern über den hinterlegten Anmeldelink in der Cevi.DB.
