# Event Overview

Visit https://events.cevi.tools/.

Allows the user to search and filter events and courses from the cevi.db. The data is loaded at startup and refreshed once per day.

![Systemcontext](docs/systemcontext.png)

See [Changelog Backend](backend/CHANGELOG.md) and [Changelog Frontend](frontend/CHANGELOG.md)

## External Integration

Supports external integration as an iframe. To hide the header and footer the parameter iframe can be set to true, e. g. https://events.cevi.tools?iframe=true

Furthermore filter criterias can be set by uri. The parameters are as follows:
* organisation, e. g. organisation=Cevi Alpin
* type, possible values: COURSE/EVENT. e. g. type=COURSE
* text, e. g. text=GLK
* kursart, e. g. kursart=Gruppenleiter/-innen-Kurs 1
* hasAvailablePlaces: possible values: true/false. e. g. hasAvailablePlaces=true
* applicationOpen: possible values: true/false. e. g. applicationOpen=false

Example: https://events.cevi.tools?iframe=true&organisation=Cevi Schweiz&ype=EVENT&hasAvailablePlaces=true&applicationOpen=true

## Prepare

Prerequisites
  * JDK 21
  * Node 20+
  * Cevi.DB API Token with Scope `Anlässe dieser Ebene`.

Put the token in a file and configure the file path in the environment variable APPLICATION_HITOBITO_API_TOKEN_FILE
```
APPLICATION_HITOBITO_API_TOKEN_FILE=/path_to_the_file_containing_the_token
```

## Build and run the backend

```
cd backend
./mvnw spring-boot:run
```

The backend is accessible under port 8080. e. g. http://localhost:8080/events. You can view an OpenApi specification under http://localhost:8080/swagger-ui/index.html

## Build and run the frontend

```
cd frontend
npm ci
npm run start:int # using the int backend
```
