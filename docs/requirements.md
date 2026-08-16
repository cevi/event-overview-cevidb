# Anforderungen

Die Benutzergeschichten folgen der Form *Als [Rolle] möchte ich [Ziel], damit [Nutzen]*.

**Status:** `Implemented` bezeichnet eine im laufenden System umgesetzte Anforderung.
`Needs review` bezeichnet eine Anforderung, deren Schwellenwert abgeleitet und nicht gemessen ist
und vom Betreiber zu bestätigen bleibt.

## Funktionale Anforderungen

### Übersicht und Anmeldung

| ID     | Titel                          | Benutzergeschichte                                                                                                                                                               | Priorität | Status      |
|--------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| FR-001 | Angebotsübersicht anzeigen     | Als Besucher möchte ich alle Anlässe und Kurse in einer Liste mit Organisation, Name, Start, Ende, freien Plätzen und Anmeldezustand sehen, damit ich mir einen Überblick verschaffen kann. | High      | Implemented |
| FR-002 | Nur kommende Angebote          | Als Besucher möchte ich ausschliesslich Angebote sehen, deren Start am aktuellen Tag oder später liegt, damit ich mich nicht mit vergangenen Terminen befassen muss.               | High      | Implemented |
| FR-003 | Liste seitenweise blättern     | Als Besucher möchte ich die Liste seitenweise durchblättern und zwischen 10, 20, 50 und 100 Einträgen pro Seite wählen, damit ich auch bei vielen Angeboten den Überblick behalte. | High      | Implemented |
| FR-004 | Liste sortieren                | Als Besucher möchte ich die Liste nach einer Spalte meiner Wahl sortieren, damit ich Angebote nach dem für mich wichtigsten Merkmal ordnen kann.                                   | Medium    | Implemented |
| FR-005 | Beschreibung aufklappen        | Als Besucher möchte ich einen Eintrag aufklappen und die ausführliche Beschreibung lesen, damit ich beurteilen kann, ob das Angebot zu mir passt.                                  | High      | Implemented |
| FR-006 | Anmeldung aufrufen             | Als Besucher möchte ich den Anmeldelink eines Angebots in einem neuen Fenster öffnen, damit ich mich in der Cevi.DB anmelden kann, ohne die Übersicht zu verlieren.                | High      | Implemented |
| FR-007 | Freie Plätze ausweisen         | Als Besucher möchte ich je Angebot sehen, ob noch Plätze frei sind, damit ich mich nicht um ein bereits ausgebuchtes Angebot bemühe.                                               | High      | Implemented |
| FR-008 | Anmeldezustand ausweisen       | Als Besucher möchte ich je Angebot sehen, ob die Anmeldung offen ist, damit ich erkenne, ob ich mich jetzt anmelden kann.                                                          | High      | Implemented |
| FR-009 | Fehlerhinweis beim Laden       | Als Besucher möchte ich einen verständlichen Hinweis erhalten, wenn Angebote oder Auswahlkriterien nicht geladen werden können, damit ich die leere Ansicht nicht für ein leeres Angebot halte. | High      | Implemented |

### Filtern

| ID     | Titel                            | Benutzergeschichte                                                                                                                                                                | Priorität | Status      |
|--------|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| FR-010 | Nach Organisation filtern        | Als Besucher möchte ich eine oder mehrere durchführende Organisationen wählen — einschliesslich einer Sammelauswahl für alle —, damit ich nur die Angebote meiner Region sehe.        | High      | Implemented |
| FR-011 | Nach Angebotstyp filtern         | Als Besucher möchte ich zwischen Anlass und Kurs unterscheiden, damit ich gezielt nach Ausbildung oder nach Erlebnis suchen kann.                                                     | High      | Implemented |
| FR-012 | Nach Name suchen                 | Als Besucher möchte ich einen Suchtext eingeben, der ohne Rücksicht auf Gross- und Kleinschreibung an beliebiger Stelle im Namen vorkommen darf, damit ich ein bekanntes Angebot direkt finde. | High      | Implemented |
| FR-013 | Nach Kursart filtern             | Als Besucher möchte ich eine oder mehrere Kursarten wählen, damit ich nur die für meine Ausbildung passenden Kurse sehe.                                                              | High      | Implemented |
| FR-014 | Nach freien Plätzen filtern      | Als Besucher möchte ich die Liste auf Angebote mit beziehungsweise ohne freie Plätze einschränken, damit ich nur Angebote sehe, an denen ich noch teilnehmen kann.                    | Medium    | Implemented |
| FR-015 | Nach offener Anmeldung filtern   | Als Besucher möchte ich die Liste auf Angebote mit beziehungsweise ohne offene Anmeldung einschränken, damit ich nur Angebote sehe, für die ich mich jetzt anmelden kann.             | Medium    | Implemented |
| FR-016 | Beliebte Filter anbieten         | Als Besucher möchte ich einen beliebten Filter wie "J+S-Leiter/-in werden" mit einem Griff wählen, damit ich die passenden Kursarten nicht einzeln kennen und auswählen muss.          | High      | Implemented |
| FR-017 | Beliebter Filter ersetzt Auswahl | Als Besucher möchte ich, dass ein gewählter beliebter Filter die bisher gewählten Kursarten vollständig ersetzt, damit das Ergebnis meiner Wahl entspricht und sich nicht mit Früherem vermischt. | Medium    | Implemented |
| FR-018 | Filter zurücksetzen              | Als Besucher möchte ich alle gesetzten Kriterien mit einem Griff entfernen, damit ich ohne Umwege wieder die gesamte Übersicht sehe.                                                  | High      | Implemented |
| FR-019 | Anzahl aktiver Kriterien         | Als Besucher möchte ich am Zugang zur Filterauswahl sehen, wie viele Kriterien aktiv sind, damit ich eine unerwartet kurze Liste erklären kann.                                       | Medium    | Implemented |
| FR-020 | Verzögerte Namenssuche           | Als Besucher möchte ich, dass die Namenssuche erst nach einer kurzen Eingabepause ausgelöst wird, damit die Liste beim Tippen nicht bei jedem Zeichen springt.                        | Medium    | Implemented |

### Teilen und Einbetten

| ID     | Titel                              | Benutzergeschichte                                                                                                                                                                | Priorität | Status      |
|--------|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| FR-021 | Kriterien in der Adresse abbilden  | Als Besucher möchte ich, dass alle gesetzten Kriterien laufend in der Adresse der Seite erscheinen, damit ich meine Sicht durch Kopieren der Adresse weitergeben kann.                | High      | Implemented |
| FR-022 | Kriterien aus der Adresse übernehmen | Als Besucher möchte ich beim Öffnen einer geteilten Adresse genau die darin enthaltenen Kriterien vorfinden, damit ich dieselbe Auswahl sehe wie der Absender.                      | High      | Implemented |
| FR-023 | Verlauf nicht überfüllen           | Als Besucher möchte ich, dass eine Filteränderung den aktuellen Verlaufseintrag ersetzt statt einen neuen anzulegen, damit mich "Zurück" zur vorherigen Seite und nicht durch meine Filterschritte führt. | Low       | Implemented |
| FR-024 | Eingebettete Darstellung           | Als Website-Betreiber möchte ich die Übersicht über eine gekennzeichnete Adresse ohne Seitenkopf, Seitenfuss und Seitenrand einbinden, damit sie sich in meine eigene Seite einfügt.  | High      | Implemented |
| FR-025 | Vorbelegte Kriterien beim Einbetten | Als Website-Betreiber möchte ich die eingebettete Übersicht über die Adresse auf meine Organisation vorbelegen, damit meine Besucher unmittelbar meine Angebote sehen.               | High      | Implemented |

### Sprache

| ID     | Titel                     | Benutzergeschichte                                                                                                                                            | Priorität | Status      |
|--------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| FR-026 | Sprache wechseln          | Als Besucher möchte ich zwischen Deutsch und Französisch wechseln, damit ich die Übersicht in meiner Sprache lesen kann.                                          | High      | Implemented |
| FR-027 | Sprachwahl merken         | Als Besucher möchte ich, dass meine Sprachwahl für spätere Besuche erhalten bleibt, damit ich sie nicht bei jedem Besuch erneut treffen muss.                     | Medium    | Implemented |
| FR-028 | Kriterien beim Wechsel behalten | Als Besucher möchte ich beim Sprachwechsel meine gesetzten Kriterien behalten, damit ich meine Auswahl nicht erneut zusammenstellen muss.                   | Medium    | Implemented |

### Abgleich mit der Cevi.DB

| ID     | Titel                                  | Benutzergeschichte                                                                                                                                                                | Priorität | Status      |
|--------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| FR-029 | Täglicher Abgleich                     | Als Betreiber möchte ich, dass der Bestand täglich um 01:00 Uhr selbsttätig aus der Cevi.DB übernommen wird, damit die Übersicht ohne mein Zutun aktuell bleibt.                      | High      | Implemented |
| FR-030 | Abgleich beim Start                    | Als Betreiber möchte ich, dass beim Start des Dienstes ein vollständiger Abgleich erfolgt, damit nach einer Neuinstallation sofort ein aktueller Bestand bereitsteht.                 | High      | Implemented |
| FR-031 | Beschränkung auf berücksichtigte Organisationen | Als Betreiber möchte ich je eine Liste berücksichtigter Organisationen für Anlässe und für Kurse hinterlegen, damit nur die fachlich gewollten Angebote in der Übersicht erscheinen. | High      | Implemented |
| FR-032 | Unterscheidung Anlass und Kurs         | Als Besucher möchte ich, dass ein Angebot mit Kursart als Kurs und ein Angebot ohne Kursart als Anlass geführt wird, damit die Unterscheidung im Filter verlässlich greift.           | High      | Implemented |
| FR-033 | Ein Eintrag je Termin                  | Als Besucher möchte ich jeden Termin eines Angebots als eigene Zeile sehen, damit ich den für mich passenden Durchführungstermin erkenne.                                             | High      | Implemented |
| FR-034 | Zwei Starttermine zusammenfassen       | Als Besucher möchte ich zwei zusammengehörende Starttermine ohne Ende, die höchstens 14 Tage auseinanderliegen, als einen Eintrag von-bis sehen, damit ein zweiteiliger Kurs nicht wie zwei Angebote wirkt. | Medium    | Implemented |
| FR-035 | Auswahlkriterien aus dem Bestand       | Als Besucher möchte ich nur Organisationen und Kursarten zur Auswahl angeboten bekommen, die im aktuellen Bestand vorkommen, damit keine Auswahl ins Leere führt.                     | High      | Implemented |
| FR-036 | Bestand bei fehlgeschlagenem Abgleich behalten | Als Besucher möchte ich weiterhin den zuletzt erfolgreich geladenen Bestand sehen, wenn die Cevi.DB nicht erreichbar ist, damit ein Ausfall der Cevi.DB die Übersicht nicht leert.  | High      | Implemented |
| FR-037 | Abbruch bei unvollständigen Angaben    | Als Betreiber möchte ich, dass ein Abgleich mit unvollständigen oder unzulässigen Angaben abbricht und den bisherigen Bestand unverändert lässt, damit keine fehlerhaften Angebote veröffentlicht werden. | High      | Implemented |
| FR-038 | Betrieb mit Testdaten                  | Als Betreiber möchte ich den Dienst wahlweise gegen hinterlegte Testdaten statt gegen die Cevi.DB betreiben, damit ich Entwicklung und Tests ohne Zugangsschlüssel durchführen kann.  | Medium    | Implemented |

### Betrieb

| ID     | Titel                     | Benutzergeschichte                                                                                                                                                        | Priorität | Status      |
|--------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| FR-039 | Betriebsauskunft          | Als Betreiber möchte ich auf der Startseite des Dienstes die Anzahl geladener Anlässe und Kurse, den Zeitpunkt des letzten Abgleichs sowie Version und Erstellungszeitpunkt sehen, damit ich Umfang und Aktualität des Bestands beurteilen kann. | High      | Implemented |
| FR-040 | Schnittstellenbeschreibung | Als Website-Betreiber möchte ich eine abrufbare OpenAPI-Beschreibung der Schnittstelle vorfinden, damit ich die Angebotsdaten auch ausserhalb der eingebetteten Ansicht nutzen kann. | Low       | Implemented |

## Nicht-funktionale Anforderungen

| ID      | Titel                              | Anforderung                                                                                                                                              | Kategorie       | Priorität | Status        |
|---------|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|---------------|
| NFR-001 | Antwortzeit Angebotsliste          | Der Abruf der vollständigen Angebotsliste über die Schnittstelle muss in 95 % der Fälle innerhalb von 500 ms beantwortet werden.                              | Performance     | High      | Needs review  |
| NFR-002 | Reaktionszeit beim Filtern         | Nach dem Ändern eines Filterkriteriums muss die eingeschränkte Liste innerhalb von 1 Sekunde dargestellt sein.                                                | Performance     | High      | Needs review  |
| NFR-003 | Eingabepause der Namenssuche       | Die Namenssuche wird nach 400 ms ohne weitere Eingabe ausgelöst; eine unveränderte Eingabe löst keine erneute Suche aus.                                      | Usability       | Medium    | Implemented   |
| NFR-004 | Aktualität des Bestands            | Der angezeigte Bestand darf im Normalbetrieb nie älter als 24 Stunden sein.                                                                                  | Availability    | High      | Implemented   |
| NFR-005 | Verfügbarkeit                      | Der Dienst muss über einen Kalendermonat hinweg zu mindestens 99 % erreichbar sein.                                                                           | Availability    | Medium    | Needs review  |
| NFR-006 | Gleichzeitige Anfragen             | Der Dienst muss mindestens 20 gleichzeitige Anfragen ohne Fehlerantwort verarbeiten (Tomcat-Obergrenze: 20 Bearbeitungsstränge).                              | Scalability     | Medium    | Implemented   |
| NFR-007 | Bestandsgrösse im Arbeitsspeicher  | Der Dienst muss mindestens 5 000 Einträge im Arbeitsspeicher halten und ausliefern können, ohne die Speicherobergrenze aus C-008 zu überschreiten.            | Scalability     | Medium    | Needs review  |
| NFR-008 | Vollständige Zweisprachigkeit      | 100 % der in der Oberfläche sichtbaren Texte müssen in Deutsch und Französisch vorliegen; unübersetzte Texte lassen den Übersetzungslauf fehlschlagen.        | Usability       | High      | Implemented   |
| NFR-009 | Sprachabhängige Formate            | Datum, Uhrzeit und die Beschriftung der Seitenblätterung müssen der gewählten Sprache folgen.                                                                 | Usability       | Medium    | Implemented   |
| NFR-010 | Bedienung auf Mobilgeräten         | Die Übersicht muss ab einer Anzeigebreite von 360 px ohne waagrechtes Blättern bedienbar sein.                                                                | Usability       | High      | Needs review  |
| NFR-011 | Zugang ohne Anmeldung              | Übersicht, Schnittstelle und Betriebsauskunft müssen ohne Anmeldung erreichbar sein und dürfen keine personenbezogenen Daten ausgeben.                        | Security        | High      | Implemented   |
| NFR-012 | Verschlüsselter Transport          | Sämtliche Zugriffe auf Frontend, Schnittstelle und Cevi.DB müssen über HTTPS erfolgen.                                                                        | Security        | High      | Implemented   |
| NFR-013 | Schutz des Zugangsschlüssels       | Der Zugangsschlüssel zur Cevi.DB wird aus einer Datei ausserhalb des Auslieferungsstands gelesen und darf in keiner Antwort und in keinem Protokolleintrag erscheinen. | Security        | High      | Implemented   |
| NFR-014 | Abruf von fremden Websites         | Die Schnittstelle muss den Abruf von beliebigen Ursprungsseiten zulassen, und die Übersicht muss sich in fremde Seiten einbetten lassen.                      | Security        | High      | Implemented   |
| NFR-015 | Automatisierte Prüfung             | Jeder Push löst Unit-Tests für Backend und Frontend, einen Produktionsbau und die Playwright-Tests aus; schlägt einer der Schritte fehl, gilt der Bau als fehlgeschlagen. | Maintainability | High      | Implemented   |
| NFR-016 | Testabdeckung von Verhaltensänderungen | Jede Änderung am fachlichen Verhalten muss durch mindestens einen neuen oder erweiterten automatisierten Test abgedeckt sein.                             | Maintainability | High      | Implemented   |
| NFR-017 | Nachvollziehbare Versionsstände    | Backend und Frontend führen je einen eigenen Changelog; jede veröffentlichte Version ist dort mit Datum und Änderungen aufgeführt.                            | Maintainability | Medium    | Implemented   |
| NFR-018 | Entwicklung ohne lokale Laufzeiten | Sämtliche Bau-, Test- und Ausführungsbefehle müssen in Containern über `tooling/docker.sh` laufen, ohne lokal installiertes Node, Java oder Maven.            | Portability     | High      | Implemented   |

## Randbedingungen

| ID    | Titel                            | Randbedingung                                                                                                                                        | Kategorie   | Priorität | Status      |
|-------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------|-----------|-------------|
| C-001 | Laufzeitumgebung Backend         | Das Backend muss auf Java 25 laufen.                                                                                                                 | Technical   | High      | Implemented |
| C-002 | Rahmenwerk Backend               | Das Backend muss auf Spring Boot 4.1 aufsetzen.                                                                                                      | Technical   | High      | Implemented |
| C-003 | Rahmenwerk Frontend              | Das Frontend muss auf Angular 22 mit Angular Material aufsetzen.                                                                                     | Technical   | High      | Implemented |
| C-004 | Keine eigene Datenhaltung        | Das System darf keinen eigenen persistenten Datenbestand führen; der Bestand wird ausschliesslich im Arbeitsspeicher gehalten.                        | Technical   | High      | Implemented |
| C-005 | Alleinige Datenquelle            | Anlässe und Kurse dürfen ausschliesslich über die Hitobito-Schnittstelle von `db.cevi.ch` bezogen werden; das System schreibt nicht zurück.           | Technical   | High      | Implemented |
| C-006 | Zugangsschlüssel                 | Der Zugriff auf die Cevi.DB erfordert einen Schlüssel mit dem Umfang "Anlässe dieser Ebene", hinterlegt über `APPLICATION_HITOBITO_API_TOKEN_FILE`. Fehlt er, startet das System nicht. | Operational | High      | Implemented |
| C-007 | Anmeldung ausserhalb des Systems | Die Anmeldung zu einem Anlass oder Kurs erfolgt ausschliesslich über den Anmeldelink in der Cevi.DB.                                                  | Business    | High      | Implemented |
| C-008 | Speicher- und Strangbudget       | Das Backend muss mit rund 400 MB Heap und höchstens 20 Tomcat-Bearbeitungssträngen auskommen.                                                          | Operational | High      | Implemented |
| C-009 | Einzelne Installation aus main   | Es besteht genau eine Installation, die aus `main` ausgeliefert wird; Abwärtskompatibilität zwischen Versionen ist nicht erforderlich.                | Operational | High      | Implemented |
| C-010 | Sprachvarianten als eigene Baustände | Die Sprachen werden zur Bauzeit erzeugt und unter eigenen Basisadressen (`/de/`, `/fr/`) ausgeliefert; Quellsprache ist `de-CH`.                  | Technical   | High      | Implemented |
| C-011 | Kodierung der Properties-Dateien | `.properties`-Dateien werden von Spring Boot als ISO-8859-1 gelesen und müssen daher rein aus ASCII bestehen; Sonderzeichen sind als `\uXXXX` zu schreiben. | Technical   | High      | Implemented |
| C-012 | Werkzeuge über Docker            | `npm`, `npx`, `mvn` und `ng` dürfen nicht unmittelbar aufgerufen werden; alle Befehle laufen über `tooling/docker.sh`.                                | Operational | High      | Implemented |
| C-013 | Unterstützte Browser             | Die Oberfläche muss in den jeweils zwei jüngsten Versionen von Chrome, Firefox, Safari und Edge bedienbar sein.                                       | Technical   | Medium    | Needs review |
| C-014 | Abgleich der Organisationen über den Namen | Berücksichtigte Organisationen werden über ihren in der Cevi.DB geführten Namen abgeglichen; Umbenennungen dort erfordern eine Anpassung der Konfiguration. | Technical   | High      | Implemented |

## Offene Punkte

- **Schwellenwerte bestätigen:** NFR-001, NFR-002, NFR-005, NFR-007 und NFR-010 tragen abgeleitete,
  nicht gemessene Werte. Der Betreiber bestätigt oder korrigiert sie; danach wechselt der Status auf
  `Implemented` oder `Open`.
- **C-013 Browserunterstützung:** Es ist kein Browserumfang festgeschrieben; die angegebene Menge
  entspricht der Vorgabe des Angular-Baustands und ist zu bestätigen.
- **Risiko zu C-014:** Der Namensabgleich hat in der Vergangenheit mehrfach zu still verschwundenen
  Organisationen geführt (Changelog 1.0.13 und Unreleased). Eine Überwachung, die eine leer
  gebliebene berücksichtigte Organisation meldet, ist bislang nicht gefordert — bei Bedarf als
  eigene Anforderung aufzunehmen.

## Nachverfolgbarkeit

| Use Case                                             | Anforderungen                        |
|------------------------------------------------------|--------------------------------------|
| UC-001 Anlässe und Kurse durchsuchen                  | FR-001 – FR-009, NFR-001, NFR-009    |
| UC-002 Anlässe und Kurse filtern                      | FR-010 – FR-020, NFR-002, NFR-003    |
| UC-003 Gefilterte Ansicht teilen                      | FR-021 – FR-023                      |
| UC-004 Anzeigesprache wechseln                        | FR-026 – FR-028, NFR-008, NFR-009, C-010 |
| UC-005 Übersicht in fremde Website einbetten          | FR-024, FR-025, FR-040, NFR-014      |
| UC-006 Anlassdaten abgleichen                         | FR-029 – FR-038, NFR-004, C-005, C-006, C-014 |
| UC-007 Betriebszustand prüfen                         | FR-039, NFR-011                      |
