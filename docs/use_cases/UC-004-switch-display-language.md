# Use Case: Anzeigesprache wechseln

## Overview

**Use Case ID:** UC-004
**Use Case Name:** Anzeigesprache wechseln
**Primary Actor:** Besucher
**Goal:** Der Besucher stellt die Übersicht auf die von ihm bevorzugte Sprache um und findet sie bei einem späteren Besuch wieder in dieser Sprache vor.
**Status:** Implemented

## Preconditions

- Die Übersicht ist geöffnet und wird nicht im eingebetteten Modus dargestellt (UC-005), da die Sprachwahl Teil des Seitenkopfs ist.

## Main Success Scenario

1. Das System zeigt die Übersicht in der aktuell gültigen Sprache und hebt diese in der Sprachwahl hervor.
2. Der Besucher wählt die gewünschte Sprache (Deutsch oder Französisch).
3. Das System merkt sich die gewählte Sprache für spätere Besuche.
4. Das System lädt die Übersicht in der gewählten Sprache neu und behält dabei die gesetzten Filterkriterien bei.
5. Der Besucher arbeitet mit der Übersicht in der neuen Sprache weiter.

## Alternative Flows

### A1: Bereits gewählte Sprache erneut gewählt

**Trigger:** Der Besucher wählt die Sprache, in der die Übersicht bereits dargestellt wird (Schritt 2)
**Flow:**

1. Das System merkt sich die Wahl erneut; die Darstellung bleibt unverändert.
2. Use case ends.

## Postconditions

### Success Postconditions

- Die Übersicht wird in der gewählten Sprache dargestellt.
- Die Sprachwahl ist für spätere Besuche gespeichert.
- Die gesetzten Filterkriterien sind unverändert.

### Failure Postconditions

- Keine; die Sprachwahl verändert keine Anlassdaten.

## Business Rules

### BR-020: Verfügbare Sprachen

Die Übersicht steht in Deutsch und Französisch zur Verfügung. Deutsch ist die Ausgangssprache und wird verwendet, solange keine andere Sprache gewählt wurde.

### BR-021: Sprachwahl bleibt erhalten

Die gewählte Sprache wird für spätere Besuche desselben Besuchers gespeichert.

### BR-022: Sprachwahl erhält die Filterkriterien

Beim Wechsel der Sprache bleiben die in der Adresse abgebildeten Filterkriterien (BR-017) erhalten.

### BR-023: Sprachabhängige Darstellung von Datum und Uhrzeit

Datums- und Uhrzeitangaben sowie die Beschriftung der Seitenblätterung folgen der gewählten Sprache.
