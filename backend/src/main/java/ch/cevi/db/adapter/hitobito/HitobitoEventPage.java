package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

public record HitobitoEventPage(int current_page, int total_pages, String next_page_link, HitobitoEvent[] events, HitobitoLinked linked) {
    public HitobitoEventPage {
        Objects.requireNonNull(events);
        if (linked == null) linked = new HitobitoLinked(new HitobitoEventDate[0], new HitobitoGroup[0], null);
    }
}
