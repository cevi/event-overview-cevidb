# Changelog

## Version 1.0.5, 19.03.2024

* dev: output statistics and build information when visiting the api
* chore: bump springdoc

## Version 1.0.4, 17.03.2024

* bugfix: [#30](https://github.com/cevi/event-overview-cevidb/issues/30) run update at one in the morning
* dev: add a profile for the integration environment

## Version 1.0.3, 03.03.2024

* bugfix: [#30](https://github.com/cevi/event-overview-cevidb/issues/30) need to enable scheduling for nightly update

## Version 1.0.2, 17.02.2024

* bugfix: [#30](https://github.com/cevi/event-overview-cevidb/issues/30) load data from hitobito at startup and refresh every night, only retrieve events that start today or in the future.