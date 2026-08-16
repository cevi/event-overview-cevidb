# Vision

## Problemstellung

Die Anlässe und Kurse des Cevi werden in der Cevi.DB (Hitobito) unter `db.cevi.ch` geführt. Wer
sich für ein Angebot interessiert, muss dort je Organisation einzeln nachsehen; eine gemeinsame,
öffentlich zugängliche Sicht über alle Regionen, Verbände und Fachgruppen hinweg gibt es nicht.
Ohne Anmeldung an der Cevi.DB ist der Bestand ausserdem nur eingeschränkt einsehbar. Für die
Websites der einzelnen Cevi-Organisationen fehlt eine Möglichkeit, ihre eigenen Angebote aktuell
und ohne Pflegeaufwand darzustellen.

Die Folge: Interessierte finden Angebote nicht, Kurse bleiben unterbelegt, und Organisationen
pflegen dieselben Termine mehrfach von Hand.

## Vision Statement

Die Anlass- und Kursübersicht ist die eine öffentliche Stelle, an der alle kommenden Anlässe und
Kurse des Cevi ohne Anmeldung auffindbar sind. Sie holt ihren Bestand selbsttätig aus der Cevi.DB,
lässt sich in wenigen Schritten auf das persönlich Relevante einschränken, führt zur Anmeldung in
der Cevi.DB — und kann als eingeschränkte Sicht sowohl als Link geteilt als auch in beliebige
Cevi-Websites eingebettet werden.

## Zielgruppen und Stakeholder

| Rolle                | Beschreibung                                                                        | Nutzen                                                                                  |
|----------------------|-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Besucher             | Cevianerinnen und Cevianer sowie Interessierte, die ein Angebot suchen              | Finden kommende Anlässe und Kurse ohne Anmeldung und gelangen direkt zur Anmeldung        |
| Website-Betreiber    | Verantwortliche für die Website einer Cevi-Organisation                             | Zeigen ihre Angebote stets aktuell auf der eigenen Seite, ohne sie selbst zu pflegen      |
| Betreiber            | Betreiber des Dienstes (Betrieb, Wartung, Weiterentwicklung)                         | Erkennen an der Betriebsauskunft, ob der Dienst läuft und der Bestand aktuell ist         |
| Cevi.DB (Hitobito)   | Führendes System für Anlässe, Kurse und Anmeldungen                                  | Bleibt alleinige Datenquelle und alleiniger Ort der Anmeldung                             |

## Systemkontext

Siehe [systemcontext.puml](systemcontext.puml). Das System besteht aus zwei Bestandteilen:

- **Web-Frontend (Angular)** — die öffentliche Übersicht mit Liste, Filtern, Sprachwahl und
  eingebetteter Darstellung.
- **Backend (Spring Boot)** — gleicht den Bestand mit der Cevi.DB ab, hält ihn im Arbeitsspeicher
  und stellt Angebote sowie Auswahlkriterien über eine offene Schnittstelle bereit.

Die Cevi.DB ist das führende System. Das Backend liest ausschliesslich; es schreibt nichts zurück
und führt keinen eigenen persistenten Datenbestand (siehe [entity_model.md](entity_model.md)).

## Umfang

### In Scope

- Anzeigen aller kommenden Anlässe und Kurse der berücksichtigten Organisationen (UC-001)
- Einschränken der Übersicht nach Organisation, Angebotstyp, Name, Kursart, freien Plätzen und
  offener Anmeldung sowie über fest hinterlegte beliebte Filter (UC-002)
- Teilen einer eingeschränkten Sicht als Link (UC-003)
- Anzeige in Deutsch und Französisch (UC-004)
- Einbetten der Übersicht in fremde Websites ohne Seitenkopf und Seitenfuss (UC-005)
- Täglicher und startseitiger Abgleich des Bestands mit der Cevi.DB (UC-006)
- Betriebsauskunft über Umfang, Aktualität und Version (UC-007)

### Out of Scope

- Anmeldung, Abmeldung und Teilnehmerverwaltung — findet ausschliesslich in der Cevi.DB statt
- Erfassen oder Ändern von Anlässen und Kursen
- Benutzerkonten, Anmeldung am System, personenbezogene Daten
- Vergangene Anlässe, Archiv, Statistiken
- Benachrichtigungen, Abonnements, Kalenderexport
- Eigene Datenhaltung über den Arbeitsspeicher hinaus

## Erfolgskriterien

| Kriterium                | Messgrösse                                                                                     |
|--------------------------|-------------------------------------------------------------------------------------------------|
| Vollständigkeit          | Alle kommenden Angebote der berücksichtigten Organisationen erscheinen in der Übersicht           |
| Aktualität               | Der angezeigte Bestand ist nie älter als 24 Stunden                                               |
| Auffindbarkeit           | Ein Besucher gelangt mit höchstens drei Bedienschritten von der Startansicht zur Anmeldung        |
| Verbreitung              | Die Übersicht ist in mindestens einer fremden Cevi-Website eingebettet                            |
| Betriebsaufwand          | Der Betrieb erfordert ausser dem Erneuern des Zugangsschlüssels keine wiederkehrende Handarbeit   |

## Annahmen und Risiken

- **Annahme:** Die Cevi.DB stellt die benötigten Angaben über ihre Schnittstelle bereit und bleibt
  in Struktur und Feldnamen stabil.
- **Risiko:** Die berücksichtigten Organisationen werden über ihren Namen abgeglichen. Wird eine
  Organisation in der Cevi.DB umbenannt, verschwinden ihre Angebote unbemerkt aus der Übersicht
  (in der Vergangenheit mehrfach eingetreten).
- **Risiko:** Fällt die Cevi.DB aus, bleibt der zuletzt geladene Bestand sichtbar und veraltet
  still. Erst die Betriebsauskunft (UC-007) macht dies sichtbar.
- **Annahme:** Der Bestand ist klein genug, um vollständig im Arbeitsspeicher gehalten und
  ungeteilt an das Frontend ausgeliefert zu werden.

## Weiterführende Dokumente

- [Anforderungen](requirements.md)
- [Use-Case-Übersicht](use_cases.puml) und [Use-Case-Spezifikationen](use_cases/)
- [Entitätsmodell](entity_model.md)
