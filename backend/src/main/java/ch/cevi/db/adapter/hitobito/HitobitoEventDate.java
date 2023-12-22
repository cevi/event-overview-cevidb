package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoEventDate(String id, String start_at, String finish_at, String location) {
    public HitobitoEventDate {
        Objects.requireNonNull(id);
        Objects.requireNonNull(start_at, () -> "start_at mustn't be null for Event Date with Id " + id);
    }
}
