package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoLinks(String[] dates, String[] groups, String kind) {
    public HitobitoLinks {
        Objects.requireNonNull(dates);
        Objects.requireNonNull(groups);
    }
}
