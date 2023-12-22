package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoEventKind(String id, String label) {
    public HitobitoEventKind {
        Objects.requireNonNull(id);
        Objects.requireNonNull(label, () -> "label mustn't be null for Event Kind with Id " + id);
    }
}
