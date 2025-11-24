# Changelog

## Version 1.0.14, 24.11.2025

- chore: bump spring boot to v4
- chore: bump springdoc-openapi-starter-webmvc-ui to 2.8.14

## Version 1.0.13, 30.08.2025

- bugfix: name of Region AG-SO-LU-ZG and WS has changed. Thus, their courses were not visible anymore
- chore: added Region Ostschweiz
- chore: bump springdoc-openapi-starter-webmvc-ui to 2.8.11
- chore: bump spring-boot-starter-parent to 3.5.5

## Version 1.0.12, 23.12.2024

- bump springboot 3.4.1
- bugfix: allow a maximum participants count of 0

## Version 1.0.11, 24.11.2024

- feature: multi select for organisations
- chore: bump spring boot to 3.3.5

## Version 1.0.10, 27.09.2024

- chore: bump spring boot to 3.3.4
- chore: bump springdoc to 2.6

## Version 1.0.9, 09.06.2024

- chore: bump spring boot to 3.3.0

## Version 1.0.8, 21.04.2024

- bugfix: free places were not indicated correctly
- feature: filter if registration is open or not

## Version 1.0.7, 15.04.2024

- feature: use a post request for event filtering
- feature: allow filtering for events that have available places

## Version 1.0.6, 01.04.2024

- feature: return the number of participants and the maximum participants with the event information
-chore: bump spring boot to 3.2.4

## Version 1.0.5, 19.03.2024

-dev: output statistics and build information when visiting the api
-chore: bump springdoc

## Version 1.0.4, 17.03.2024

-bugfix: [#30](https://github.com/cevi/event-overview-cevidb/issues/30) run update at one in the morning
-dev: add a profile for the integration environment

## Version 1.0.3, 03.03.2024

-bugfix: [#30](https://github.com/cevi/event-overview-cevidb/issues/30) need to enable scheduling for nightly update

## Version 1.0.2, 17.02.2024

-bugfix: [#30](https://github.com/cevi/event-overview-cevidb/issues/30) load data from hitobito at startup and refresh every night, only retrieve events that start today or in the future.