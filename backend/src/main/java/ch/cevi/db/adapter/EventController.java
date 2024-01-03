package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import ch.cevi.db.adapter.hitobito.HitobitoProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
class EventController {
    private final HitobitoProvider provider;

    public EventController(HitobitoProvider provider) {
        this.provider = provider;
    }

    @GetMapping("/events")
    ResponseEntity<List<CeviEvent>> getEvents(@RequestParam Optional<String> groupFilter,
                                              @RequestParam Optional<LocalDate> earliestStartAt,
                                              @RequestParam Optional<LocalDate> latestStartAt,
                                              @RequestParam Optional<String> nameContains,
                                              @RequestParam Optional<CeviEventType> eventType,
                                              @RequestParam Optional<String> kursartFilter) {
        return ResponseEntity.ok(provider.getEvents(groupFilter, earliestStartAt, latestStartAt, nameContains, eventType, kursartFilter));
    }
}
