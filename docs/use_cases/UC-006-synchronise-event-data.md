# Use Case: Anlassdaten abgleichen

## Overview

**Use Case ID:** UC-006
**Use Case Name:** Anlassdaten abgleichen
**Primary Actor:** Zeitsteuerung
**Goal:** Das System hält den Bestand der angezeigten Anlässe und Kurse aktuell, indem es die Angebote der berücksichtigten Organisationen aus der Cevi.DB übernimmt und für die Übersicht aufbereitet.
**Status:** Implemented

## Preconditions

- Ein Zugangsschlüssel für die Cevi.DB mit der Berechtigung "Anlässe dieser Ebene" ist hinterlegt.
- Die Organisation, ab der die Anlässe und Kurse gesucht werden, ist festgelegt.
- Je eine Liste der für Anlässe und der für Kurse berücksichtigten Organisationen ist festgelegt und enthält mindestens einen Eintrag.

## Main Success Scenario

1. Die Zeitsteuerung stösst den täglichen Abgleich an; zusätzlich erfolgt ein Abgleich beim Start des Systems.
2. Das System fordert bei der Cevi.DB alle Anlässe und alle Kurse ab dem aktuellen Tag an und holt die Angebote so lange nach, bis der gesamte Bestand vorliegt.
3. Das System löst zu jedem Angebot die zugehörige Organisation, die Termine und — bei Kursen — die Kursart auf.
4. Das System erzeugt aus jedem Termin eines Angebots einen eigenen Eintrag und fasst zusammengehörende Termine zu einem Eintrag zusammen.
5. Das System verwirft Einträge, deren Start vor dem aktuellen Tag liegt.
6. Das System behält nur Anlässe berücksichtigter Anlass-Organisationen und nur Kurse berücksichtigter Kurs-Organisationen.
7. Das System sortiert die verbleibenden Einträge aufsteigend nach Startdatum und ersetzt damit den bisherigen Bestand.
8. Das System vermerkt den Zeitpunkt des Abgleichs und leitet daraus die verfügbaren Organisationen und Kursarten für die Auswahlkriterien ab.

## Alternative Flows

### A1: Angebot ohne Kursart

**Trigger:** Ein Angebot verweist auf keine Kursart (Schritt 3)
**Flow:**

1. Das System führt das Angebot als Anlass statt als Kurs.
2. Use case continues at step 4.

### A2: Kursart nicht auflösbar

**Trigger:** Ein Angebot verweist auf eine Kursart, deren Bezeichnung nicht mitgeliefert wird (Schritt 3)
**Flow:**

1. Das System hinterlegt die Kursart als "N/A".
2. Use case continues at step 4.

### A3: Angebot ohne Beschreibung

**Trigger:** Zu einem Angebot ist keine Beschreibung hinterlegt (Schritt 3)
**Flow:**

1. Das System hinterlegt eine leere Beschreibung.
2. Use case continues at step 4.

### A4: Unvollständiges Angebot

**Trigger:** Einem Angebot fehlen zwingende Angaben oder es enthält unzulässige Teilnehmerzahlen (Schritt 4)
**Flow:**

1. Das System bricht den Abgleich mit einer Fehlermeldung ab.
2. Der bisherige Bestand bleibt unverändert erhalten.
3. Use case ends.

### A5: Cevi.DB nicht erreichbar

**Trigger:** Die Cevi.DB antwortet nicht oder weist den Zugriff zurück (Schritt 2)
**Flow:**

1. Der Abgleich schlägt fehl.
2. Der bisherige Bestand bleibt unverändert erhalten; der vermerkte Zeitpunkt des letzten erfolgreichen Abgleichs bleibt bestehen.
3. Use case ends.

### A6: Abgleich beim Start schlägt fehl

**Trigger:** Der erstmalige Abgleich beim Start des Systems schlägt fehl (Schritt 2)
**Flow:**

1. Das System startet nicht; es steht kein Bestand zur Verfügung.
2. Use case ends.

### A7: Betrieb mit Testdaten

**Trigger:** Das System ist für den Betrieb mit hinterlegten Testdaten eingerichtet (Schritt 2)
**Flow:**

1. Das System liest die Angebote aus den hinterlegten Testdaten statt aus der Cevi.DB.
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- Der Bestand enthält alle kommenden Anlässe und Kurse der berücksichtigten Organisationen, aufsteigend nach Startdatum sortiert.
- Der Zeitpunkt des letzten Abgleichs ist vermerkt.
- Die verfügbaren Organisationen und Kursarten für die Auswahlkriterien entsprechen dem neuen Bestand.

### Failure Postconditions

- Der zuletzt erfolgreich geladene Bestand bleibt unverändert und wird weiterhin angezeigt; scheitert bereits der Abgleich beim Start, steht das System nicht zur Verfügung.

## Business Rules

### BR-028: Abgleichzeitpunkt

Der Bestand wird einmal beim Start des Systems und danach täglich um 01:00 Uhr abgeglichen.

### BR-029: Berücksichtigte Organisationen

Ein Anlass wird nur übernommen, wenn seine Organisation in der Liste der berücksichtigten Anlass-Organisationen steht. Ein Kurs wird nur übernommen, wenn seine Organisation in der Liste der berücksichtigten Kurs-Organisationen steht. Beide Listen müssen mindestens einen Eintrag enthalten.

### BR-030: Abgrenzung Anlass und Kurs

Ein Angebot mit Kursart gilt als Kurs, ein Angebot ohne Kursart als Anlass.

### BR-031: Ein Eintrag je Termin

Jeder Termin eines Angebots ergibt einen eigenen Eintrag in der Übersicht. Der Bezeichner eines Angebots kann daher mehrfach vorkommen.

### BR-032: Zusammenfassen zweier Termine

Hat ein Angebot genau zwei Termine, für die kein Ende hinterlegt ist, und liegen deren Starttage höchstens 14 Tage auseinander, werden sie zu einem einzigen Eintrag zusammengefasst, der vom ersten bis zum zweiten Termin reicht. Als Ort gilt der Ort des ersten Termins, ersatzweise der des zweiten.

### BR-033: Nur zukünftige Termine

Termine, die vor dem Beginn des aktuellen Tages liegen, werden nicht übernommen (siehe BR-001).

### BR-034: Zwingende Angaben eines Angebots

Bezeichner, Name, Beschreibung, Anmeldelink, Start, Organisation und Ort müssen vorhanden sein. Die Zahl der angemeldeten Teilnehmenden darf nicht negativ sein; eine hinterlegte Teilnehmerobergrenze darf ebenfalls nicht negativ sein.

### BR-035: Auswahlkriterien folgen dem Bestand

Die zur Auswahl angebotenen Organisationen und Kursarten werden aus dem aktuell geladenen Bestand abgeleitet und enthalten jeden Wert genau einmal. Die Angebotstypen "Anlass" und "Kurs" stehen unabhängig vom Bestand zur Verfügung.

### BR-036: Zugangsschlüssel

Der Zugriff auf die Cevi.DB erfolgt mit einem hinterlegten Zugangsschlüssel. Ist dieser nicht verfügbar, startet das System nicht.
