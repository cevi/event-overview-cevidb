package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoLinked(HitobitoEventDate[] event_dates, HitobitoGroup[] groups, HitobitoEventKind[] event_kinds) {
    public HitobitoLinked {
        Objects.requireNonNull(event_dates);
        Objects.requireNonNull(groups);
    }
}
