package ch.cevi.db.adapter;

import ch.cevi.db.adapter.hitobito.HitobitoProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
class HomeController {
    private final HitobitoProvider provider;

    private final BuildProperties buildProperties;

    public HomeController(HitobitoProvider provider, BuildProperties buildProperties) {
        this.provider = provider;
        this.buildProperties = buildProperties;
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    ResponseEntity<String> getHome() {
        var formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        ZoneId zone = ZoneId.of("Europe/Zurich");

        // Everything interpolated below is escaped, so a value taken from the Cevi.db data cannot
        // turn this page into a script carrier later on.
        return ResponseEntity.ok("""
          <h1>Cevi Event API</h1>
          <p>Stellt Anlässe und Kurse von der Cevi.db bereit. Siehe <a href="https://events.cevi.tools">Frontend</a></p>
          <p><a href="https://github.com/cevi/event-overview-cevidb">GitHub Repository</a></p>
          <p>Aktuell sind %s Anlässe und %s Kurse geladen</p>
          <p>Die letzte Aktualisierung erfolgte am %s</p>
          <p>Version: %s, gebaut am %s</p>
            """.formatted(provider.getAnzahlAnlaesse(), provider.getAnzahlKurse(),
            escape(formatter.format(provider.getLastRefreshDate())),
            escape(buildProperties.getVersion()),
            escape(formatter.format(LocalDateTime.ofInstant(buildProperties.getTime(), zone)))));
    }

    private static String escape(String value) {
        return HtmlUtils.htmlEscape(value);
    }
}
