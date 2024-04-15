# Event Overview Backend

## Local Execution

Either specify a valid cevi.db token in the application.properties file or use an environment variable (APPLICATION_HITOBITO_API_TOKEN_FILE) which points to a file that contains a valid cevi.db token.

In IntelliJ execute the main method in the AdapterApplication class.

Note: if an error about "missing bean BuildProperties" appears, you need to execute
```
./mvnw package
```
once

## Spring Profiles

* default: configured for production
* int: configured for integration
