# Anlassübersicht basierend auf der CeviDB

Aus der CeviDB werden automatisiert Kurse, Lager oder weitere Anlässe ausgegeben.

## Idee

Aus der Cevi DB werden automatisch Anlässe als Webseite ausgegeben. Diese können initial gefiltert werden (beispielsweise nur Anlässe einer bestimmten Ortsgruppe oder Ebene). Anschliessend direkt auf der Webseite können die Anlässe weiter gefiltert werden (nur Kurse, nur Lager, o.ä.) oder sortiert werden (Altersgruppe bei Kursen, Datum, etc).

## Umsetzung

- Variante A: Webseite, die als iFrame auf verschiedenen Webseiten eingebunden werden kann. Initiale Filterung via GET-Parameter.
  - ➕ ohne Code-Kentnisse Nutzbar
  - ➖ eigenes Hosting
- Variante B: Code-Lösung, die auf verschiedenen Webseiten direkt eingebunden werden kann. Initiale Filterung im Code.
  - ➖ Code-Kenntnisse nötig

## Einsatz

Der Cevi Schweiz möchte eine Übersicht von allen Kursen, insbesondere J+S-Kurse, aus der ganzen Bewegung (Cevi Schweiz, Cevi Region Bern, Cevi WS, etc) auf einer einzelnen Seite auflisten, so dass alle Mitglieder alle Cevi-Kurse in einer einfachen Umgebung finden.

## Beispiele

- Übersicht: https://cevi-alpin.ch/touren/
- Verknüpfung: https://cevi-alpin.ch/tour/klettertour-3/ vs https://db.cevi.ch/groups/3030/events/2658.html


## Proof of Concept: Development

To start the development server, run:

```bash
CEVI_DB_TOKEN=xxx npm run dev
```

Where `xxx` is the API token for the CeviDB API with the `Anlässe dieser und der darunterliegenden Ebenen` scope.
