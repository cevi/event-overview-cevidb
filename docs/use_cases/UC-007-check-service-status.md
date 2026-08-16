# Use Case: Betriebszustand prüfen

## Overview

**Use Case ID:** UC-007
**Use Case Name:** Betriebszustand prüfen
**Primary Actor:** Betreiber
**Goal:** Der Betreiber überzeugt sich davon, dass der Dienst läuft, wie viele Anlässe und Kurse geladen sind, wann zuletzt abgeglichen wurde und welche Version im Einsatz ist.
**Status:** Implemented

## Preconditions

- Der Dienst, der die Anlässe und Kurse bereitstellt, ist gestartet.

## Main Success Scenario

1. Der Betreiber öffnet die Startseite des Dienstes.
2. Das System ermittelt die Anzahl der geladenen Anlässe, die Anzahl der geladenen Kurse und den Zeitpunkt des letzten Abgleichs.
3. Das System zeigt diese Angaben zusammen mit der eingesetzten Version, dem Erstellungszeitpunkt der Version sowie Verweisen auf die Übersicht und auf das Projekt an.
4. Der Betreiber beurteilt anhand der Angaben, ob der Dienst ordnungsgemäss arbeitet.

## Alternative Flows

### A1: Dienst nicht erreichbar

**Trigger:** Der Dienst antwortet nicht (Schritt 1)
**Flow:**

1. Der Betreiber erhält keine Antwort und schliesst daraus auf eine Störung.
2. Use case ends.

### A2: Abgleich liegt zu lange zurück

**Trigger:** Der angezeigte Zeitpunkt des letzten Abgleichs liegt mehr als einen Tag zurück (Schritt 4)
**Flow:**

1. Der Betreiber untersucht die Anbindung an die Cevi.DB (UC-006).
2. Use case ends.

## Postconditions

### Success Postconditions

- Der Betreiber kennt Umfang und Aktualität des geladenen Bestands sowie die eingesetzte Version.
- Der Datenbestand des Systems ist unverändert.

### Failure Postconditions

- Keine; die Prüfung verändert nichts am System.

## Business Rules

### BR-037: Inhalt der Betriebsauskunft

Die Betriebsauskunft weist die Anzahl der geladenen Anlässe, die Anzahl der geladenen Kurse, den Zeitpunkt des letzten Abgleichs, die eingesetzte Version und deren Erstellungszeitpunkt aus.

### BR-038: Zeitzone der Betriebsauskunft

Zeitpunkte in der Betriebsauskunft werden in der Zeitzone Europe/Zurich und im Format Tag.Monat.Jahr Stunde:Minute:Sekunde dargestellt.

### BR-039: Offene Betriebsauskunft

Die Betriebsauskunft ist ohne Anmeldung abrufbar und enthält keine personenbezogenen Daten.
