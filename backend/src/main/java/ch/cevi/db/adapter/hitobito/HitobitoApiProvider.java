package ch.cevi.db.adapter.hitobito;

import java.util.List;

interface HitobitoApiProvider {
    List<HitobitoEventPage> getEventPages();
}
