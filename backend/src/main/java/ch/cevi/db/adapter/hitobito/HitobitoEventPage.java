package ch.cevi.db.adapter.hitobito;

import java.util.Objects;

record HitobitoEventPage(int current_page, int total_pages, String next_page_link, HitobitoEvent[] events, HitobitoLinked linked) {
    public HitobitoEventPage {
        Objects.requireNonNull(events);
        Objects.requireNonNull(linked);
    }
}
