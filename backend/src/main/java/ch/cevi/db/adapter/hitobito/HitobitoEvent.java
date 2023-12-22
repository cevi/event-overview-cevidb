package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoEvent(String id, String name, String description, String external_application_link, HitobitoLinks links) {
    public HitobitoEvent {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(external_application_link);
        Objects.requireNonNull(links);
    }
}
