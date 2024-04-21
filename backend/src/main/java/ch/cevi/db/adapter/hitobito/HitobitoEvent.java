package ch.cevi.db.adapter.hitobito;

import java.time.LocalDate;
import java.util.Objects;

public record HitobitoEvent(String id, String name, String description, String external_application_link, HitobitoLinks links,
                            int participant_count, Integer maximum_participants, LocalDate application_opening_at, LocalDate application_closing_at) {
    public HitobitoEvent {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(external_application_link);
        Objects.requireNonNull(links);
    }
}
