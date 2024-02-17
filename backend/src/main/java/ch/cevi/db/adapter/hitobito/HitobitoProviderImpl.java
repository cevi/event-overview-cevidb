package ch.cevi.db.adapter.hitobito;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import ch.cevi.db.adapter.domain.Kursart;
import ch.cevi.db.adapter.domain.Organisation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class HitobitoProviderImpl implements HitobitoProvider {
    Logger logger = LoggerFactory.getLogger(HitobitoApi.class);

    private final HitobitoApiProvider provider;

    private List<CeviEvent> ceviEvents;
    private final List<String> eventGroups;
    private final List<String> courseGroups;

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
    }

    @Override
    public List<CeviEvent> getEvents(Optional<String> groupFilter,
                                     Optional<LocalDate> earliestStartAt,
                                     Optional<LocalDate> latestStartAt,
                                     Optional<String> nameContains,
                                     Optional<CeviEventType> eventType,
                                     Optional<String> kursartFilter) {
        return this.ceviEvents.stream().filter(e -> groupFilter.map(f -> e.group().equals(f)).orElse(true))
                .filter(e -> earliestStartAt.map(d -> e.startsAt().toLocalDate().isEqual(d) || e.startsAt().toLocalDate().isAfter(d)).orElse(true))
                .filter(e -> latestStartAt.map(d -> e.startsAt().toLocalDate().isEqual(d) || e.startsAt().toLocalDate().isBefore(d)).orElse(true))
                .filter(e -> nameContains.map(d -> e.name().toLowerCase(Locale.ROOT).contains(d.toLowerCase(Locale.ROOT))).orElse(true))
                .filter(e -> eventType.map(d -> e.eventType().equals(d)).orElse(true))
                .filter(e -> kursartFilter.map(d -> e.kind().toLowerCase(Locale.ROOT).equals(d.toLowerCase(Locale.ROOT))).orElse(true))
                .toList();

    }

    @Override
    public List<Organisation> getOrganisations() {
        if (this.ceviEvents == null) {
            this.getEvents(Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty());
        }
        return this.ceviEvents.stream().map(e -> new Organisation(e.group())).distinct().toList();
    }

    @Override
    public List<Kursart> getKursarten() {
        if (this.ceviEvents == null) {
            this.getEvents(Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty());
        }
        return this.ceviEvents.stream().filter(e -> e.kind() != null).map(e -> new Kursart(e.kind())).distinct().toList();
    }

    private static Stream<CeviEvent> toCeviEvents(HitobitoEventPage page) {
        var dateLoockup = Arrays.stream(page.linked().event_dates()).collect(Collectors.toMap(HitobitoEventDate::id, Function.identity()));
        var groupLoockup = Arrays.stream(page.linked().groups()).distinct().collect(Collectors.toMap(HitobitoGroup::id, HitobitoGroup::name));
        Map<String, String> kindLookup = page.linked().event_kinds() == null ? Map.of() : Arrays.stream(page.linked().event_kinds()).distinct().collect(Collectors.toMap(HitobitoEventKind::id, HitobitoEventKind::label));

        return Arrays.stream(page.events()).map(e -> toCeviEvents(e, dateLoockup, groupLoockup, kindLookup)).flatMap(Collection::stream);
    }

    private static List<CeviEvent> toCeviEvents(HitobitoEvent event, Map<String, HitobitoEventDate> dateLoockup, Map<String, String> groupLookup,
                                                Map<String, String> kindLookup) {
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
                event.links().kind() != null ? CeviEventType.COURSE : CeviEventType.EVENT
        )).toList();
    }
}
