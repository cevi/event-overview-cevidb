package ch.cevi.db.adapter;

import ch.cevi.db.adapter.hitobito.HitobitoProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
@CrossOrigin
class HomeController {
    private final HitobitoProvider provider;

    private final BuildProperties buildProperties;

    public HomeController(HitobitoProvider provider, BuildProperties buildProperties) {
        this.provider = provider;
        this.buildProperties = buildProperties;
    }

    @GetMapping("/")
    ResponseEntity<String> getHome() {
        var formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        ZoneId zone = ZoneId.of("Europe/Zurich");

        return ResponseEntity.ok("""
          <h1>Cevi Event API</h1>
          <p>Stellt Anlässe und Kurse von der Cevi.db bereit. Siehe <a href="https://events.cevi.tools">Frontend</a></p>
          <p><a href="https://github.com/cevi/event-overview-cevidb">GitHub Repository</a></p>
          <p>Aktuell sind %s Anlässe und %s Kurse geladen</p>
          <p>Die letzte Aktualisierung erfolgte am %s</p>
          <p>Version: %s, gebaut am %s</p>
            """.formatted(provider.getAnzahlAnlaesse(), provider.getAnzahlKurse(),
            formatter.format(provider.getLastRefreshDate()),
            buildProperties.getVersion(), formatter.format(LocalDateTime.ofInstant(buildProperties.getTime(), zone))));
    }
}
