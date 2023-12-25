package ch.cevi.db.adapter.hitobito;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import ch.cevi.db.adapter.domain.Organisation;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HitobitoProvider {
    List<CeviEvent> getEvents(Optional<String> groupFilter,
                              Optional<LocalDate> earliestStartAt,
                              Optional<LocalDate> lastStartAt,
                              Optional<String> nameContains,
                              Optional<CeviEventType> eventType);
    List<Organisation> getOrganisations();
}
