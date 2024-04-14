package ch.cevi.db.adapter.hitobito;

import ch.cevi.db.adapter.EventFilter;
import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.Kursart;
import ch.cevi.db.adapter.domain.Organisation;

import java.time.LocalDateTime;
import java.util.List;

public interface HitobitoProvider {
    List<CeviEvent> getEvents(EventFilter filter);
    List<Organisation> getOrganisations();
    List<Kursart> getKursarten();
    long getAnzahlAnlaesse();
    long getAnzahlKurse();
    LocalDateTime getLastRefreshDate();
    void refreshData();
}
