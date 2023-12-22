package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoGroup(String id, String name) {
    public HitobitoGroup {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name, "Group name mustn't be null for group id " + id);
    }
}
