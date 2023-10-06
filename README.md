# Anlassübersicht basierend auf der CeviDB

Aus der CeviDB werden automatisiert Kurse, Lager oder weitere Anlässe ausgegeben.

## Idee

Aus der Cevi DB werden automatisch Anlässe als Webseite ausgegeben. Diese können initial gefiltert werden (
beispielsweise nur Anlässe einer bestimmten Ortsgruppe oder Ebene). Anschliessend direkt auf der Webseite können die
Anlässe weiter gefiltert werden (nur Kurse, nur Lager, o.ä.) oder sortiert werden (Altersgruppe bei Kursen, Datum, etc).

## Umsetzung

- Variante A: Webseite, die als iFrame auf verschiedenen Webseiten eingebunden werden kann. Initiale Filterung via
  GET-Parameter.
    - ➕ ohne Code-Kentnisse Nutzbar
    - ➖ eigenes Hosting
- Variante B: Code-Lösung, die auf verschiedenen Webseiten direkt eingebunden werden kann. Initiale Filterung im Code.
    - ➖ Code-Kenntnisse nötig

## Einsatz

Der Cevi Schweiz möchte eine Übersicht von allen Kursen, insbesondere J+S-Kurse, aus der ganzen Bewegung (Cevi Schweiz,
Cevi Region Bern, Cevi WS, etc) auf einer einzelnen Seite auflisten, so dass alle Mitglieder alle Cevi-Kurse in einer
einfachen Umgebung finden.

## Beispiele

- Übersicht: https://cevi-alpin.ch/touren/
- Verknüpfung: https://cevi-alpin.ch/tour/klettertour-3/ vs https://db.cevi.ch/groups/3030/events/2658.html

## Proof of Concept

The following code is a proof of concept for the idea. It is not yet production ready.
The application is written in TypeScript using NextJS and React. The data is fetched from the CeviDB via the Event API.

### Prerequisites

  * Node 18+
  * Openslide
  * Cevi.DB API Token with Scope `Anlässe dieser und der darunterliegenden Ebenen` for the integration environment.

### Proof of Concept: Development

To start the development server, run:

```bash
npm install
HITOBITO_INSTANCE=cevi.puzzle.ch HITOBITO_API_TOKEN=xxx HITOBITO__GROUP_ID=1 npm run dev
```

Note: you need to replace xxx with the proper token.

The webpage is available under http://localhost:3000

### Proof of Concept: Production

To build the production version, run:

```bash
docker-compose up --build
```

The webpage is available under http://localhost:3000

### Troubleshooting

Depending on your (firewall) configuration you might encounter the following error when running ```npm install```
```
gyp ERR! stack FetchError: request to https://nodejs.org/download/release/v18.18.0/node-v18.18.0-headers.tar.gz failed, reason: unable to get local issuer certificate
```

This seems to be related to the following error (https://github.com/nodejs/help/issues/3686#issuecomment-1011865975) and can be resolved with the following command:
```
wget https://nodejs.org/download/release/v18.18.0/node-v18.18.0-headers.tar.gz --directory-prefix=/tmp
npm install --tarball=/tmp/node-v18.18.0-headers.tar.gz
```

Another problem you might encounter is
```
unable to load "/usr/lib/vips-modules-8.14/vips-openslide.so" -- libopenslide.so.0: cannot open shared object file: No such file or directory
```

To solve this you need to intall openslide (example for Arch Linux):
```
sudo pacman -S openslide
```
