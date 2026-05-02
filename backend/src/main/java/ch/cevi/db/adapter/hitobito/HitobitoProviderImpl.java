package ch.cevi.db.adapter.hitobito;

import ch.cevi.db.adapter.EventFilter;
import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import ch.cevi.db.adapter.domain.Kursart;
import ch.cevi.db.adapter.domain.Organisation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class HitobitoProviderImpl implements HitobitoProvider {
    Logger logger = LoggerFactory.getLogger(HitobitoProviderImpl.class);

    private final HitobitoApiProvider provider;

    private List<CeviEvent> ceviEvents;
    private final List<String> eventGroups;
    private final List<String> courseGroups;

    private LocalDateTime lastRefreshAt;

    public HitobitoProviderImpl(HitobitoApiProvider provider, String[] eventGroups, String[] courseGroups) {
        Objects.requireNonNull(eventGroups);
        Objects.requireNonNull(courseGroups);
        if (eventGroups.length == 0) {
            throw new IllegalArgumentException("Event groups whitelist must contain at least one entry");
        }
        if (courseGroups.length == 0) {
            throw new IllegalArgumentException("Course groups whitelist must contain at least one entry");
        }

        this.provider = provider;
        this.eventGroups = Arrays.stream(eventGroups).toList();
        this.courseGroups = Arrays.stream(courseGroups).toList();
        this.refreshData();
    }

    @Override
    public void refreshData() {
        logger.atInfo().log("refreshing Data from Hitobito");
        this.ceviEvents = this.provider.getEventPages().stream()
                .flatMap(HitobitoProviderImpl::toCeviEvents)
                .sorted(Comparator.comparing(CeviEvent::startsAt))
                .filter(e -> e.eventType() != CeviEventType.EVENT || eventGroups.contains(e.group()))
                .filter(e -> e.eventType() != CeviEventType.COURSE || courseGroups.contains(e.group()))
                .toList();
        logger.atInfo().log("Retrieved {} events and courses", ceviEvents.size());
        this.lastRefreshAt = LocalDateTime.now();
    }

    @Override
    public List<CeviEvent> getEvents(EventFilter filter) {
        return this.ceviEvents.stream().filter(filter::match).toList();
    }

    @Override
    public List<Organisation> getOrganisations() {
        return this.ceviEvents.stream().map(e -> new Organisation(e.group())).distinct().toList();
    }

    @Override
    public List<Kursart> getKursarten() {
        return this.ceviEvents.stream().filter(e -> e.kind() != null).map(e -> new Kursart(e.kind())).distinct().toList();
    }

    @Override
    public long getAnzahlAnlaesse() {
        return this.ceviEvents.stream().filter(e -> e.eventType().equals(CeviEventType.EVENT)).count();
    }

    @Override
    public long getAnzahlKurse() {
        return this.ceviEvents.stream().filter(e -> e.eventType().equals(CeviEventType.COURSE)).count();
    }

    @Override
    public LocalDateTime getLastRefreshDate() {
        return this.lastRefreshAt;
    }

    private static Stream<CeviEvent> toCeviEvents(HitobitoEventPage page) {
        var dateLoockup = Arrays.stream(page.linked().event_dates()).collect(Collectors.toMap(HitobitoEventDate::id, Function.identity()));
        var groupLoockup = Arrays.stream(page.linked().groups()).distinct().collect(Collectors.toMap(HitobitoGroup::id, HitobitoGroup::name));
        Map<String, String> kindLookup = page.linked().event_kinds() == null ? Map.of() : Arrays.stream(page.linked().event_kinds()).distinct().collect(Collectors.toMap(HitobitoEventKind::id, HitobitoEventKind::label));

        return Arrays.stream(page.events()).map(e -> toCeviEvents(e, dateLoockup, groupLoockup, kindLookup)).flatMap(Collection::stream)
                .filter(e -> e.startsAt().isAfter(LocalDate.now().atStartOfDay()));
    }

    private static List<CeviEvent> toCeviEvents(HitobitoEvent event, Map<String, HitobitoEventDate> dateLoockup, Map<String, String> groupLookup,
                                                Map<String, String> kindLookup) {
        var dates = Arrays.stream(event.links().dates()).map(dateLoockup::get).toList();

        if (shouldMergeDates(dates)) {
            var start = dates.get(0);
            var end = dates.get(1);
            String location = !start.location().isBlank() ? start.location() : end.location();
            return List.of(new CeviEvent(
                    event.id(),
                    event.name(),
                    event.description() != null ? event.description() : "",
                    event.external_application_link(),
                    OffsetDateTime.parse(start.start_at()).toLocalDateTime(),
                    OffsetDateTime.parse(end.start_at()).toLocalDateTime(),
                    groupLookup.get(event.links().groups()[0]),
                    location,
                    (event.links().kind() != null && kindLookup.get(event.links().kind()) != null) ? kindLookup.get(event.links().kind()) : "N/A",
                    event.links().kind() != null ? CeviEventType.COURSE : CeviEventType.EVENT,
                    event.participant_count(),
                    event.maximum_participants(),
                    event.application_opening_at(),
                    event.application_closing_at(),
                    event.state()
            ));
        }

        return Arrays.stream(event.links().dates()).map(d -> new CeviEvent(
                event.id(),
                event.name(),
                event.description() != null ? event.description() : "",
                event.external_application_link(),
                OffsetDateTime.parse(dateLoockup.get(d).start_at()).toLocalDateTime(),
                dateLoockup.get(d).finish_at() == null ? null : OffsetDateTime.parse(dateLoockup.get(d).finish_at()).toLocalDateTime(),
                groupLookup.get(event.links().groups()[0]),
                dateLoockup.get(d) != null ? dateLoockup.get(d).location() : "",
                (event.links().kind() != null && kindLookup.get(event.links().kind()) != null) ? kindLookup.get(event.links().kind()) : "N/A",
                event.links().kind() != null ? CeviEventType.COURSE : CeviEventType.EVENT,
                event.participant_count(),
                event.maximum_participants(),
                event.application_opening_at(),
                event.application_closing_at(),
                event.state()
        )).toList();
    }

    private static boolean shouldMergeDates(List<HitobitoEventDate> dates) {
        if (dates.size() != 2) return false;
        var first = dates.get(0);
        var second = dates.get(1);
        if (first.finish_at() != null || second.finish_at() != null) return false;
        long daysBetween = ChronoUnit.DAYS.between(
                OffsetDateTime.parse(first.start_at()),
                OffsetDateTime.parse(second.start_at())
        );
        return daysBetween >= 0 && daysBetween <= 14;
    }
}
