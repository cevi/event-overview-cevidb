package ch.cevi.db.adapter.hitobito;

import java.util.List;

public interface HitobitoApiProvider {
    List<HitobitoEventPage> getEventPages();
}
