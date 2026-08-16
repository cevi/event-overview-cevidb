package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.hitobito.HitobitoProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
class EventController {
    private final HitobitoProvider provider;

    public EventController(HitobitoProvider provider) {
        this.provider = provider;
    }

    @PostMapping("/events")
    ResponseEntity<List<CeviEvent>> getEvents(@Valid @RequestBody EventFilter filter) {
        return ResponseEntity.ok(provider.getEvents(filter));
    }
}
