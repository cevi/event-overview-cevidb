package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Filter to apply to the returned events. Only filter properties != null are applied.
 * <p>
 * The list and text sizes are capped: every entry is compared against every event, so an unbounded
 * list would let a single small request cause an arbitrary amount of work (see NFR-022).
 *
 * @param groups
 * @param earliestStartAt
 * @param latestStartAt
 * @param nameContains
 * @param eventType
 * @param kursarten
 * @param hasAvailablePlaces
 */
public record EventFilter(@Size(max = 200) List<String> groups,
                          LocalDate earliestStartAt,
                          LocalDate latestStartAt,
                          @Size(max = 200) String nameContains,
                          CeviEventType eventType,
                          @Size(max = 200) List<String> kursarten,
                          Boolean hasAvailablePlaces,
                          Boolean isApplicationOpen) {
    public static EventFilter emptyFilter() {
        return new EventFilter(null, null, null, null, null, null, null, null);
    }

    public EventFilter withGroups(List<String> groups) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withEarliestStartAt(LocalDate earliestStartAt) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withLatestStartAt(LocalDate latestStartAt) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withNameContains(String nameContains) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withEventType(CeviEventType eventType) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withKursarten(List<String> kursarten) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withHasAvailablePlaces(boolean hasAvailablePlaces) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withIsApplicationOpen(boolean isApplicationOpen) {
        return new EventFilter(groups, earliestStartAt, latestStartAt, nameContains, eventType, kursarten, hasAvailablePlaces, isApplicationOpen);
    }

    public boolean match(CeviEvent event) {
        return matcher().test(event);
    }

    /**
     * Prepares the lookups once and returns a predicate to run over the whole event list — a linear
     * search per event and per filter entry would multiply out.
     */
    public Predicate<CeviEvent> matcher() {
        return matchesGroup()
                .and(matchesEarliestStart())
                .and(matchesLatestStart())
                .and(matchesName())
                .and(matchesEventType())
                .and(matchesKursart())
                .and(matchesAvailablePlaces())
                .and(matchesApplicationOpen());
    }

    private Predicate<CeviEvent> matchesGroup() {
        if (groups == null) return event -> true;
        Set<String> lookup = new HashSet<>(groups);
        return event -> lookup.contains(event.group());
    }

    private Predicate<CeviEvent> matchesEarliestStart() {
        if (earliestStartAt == null) return event -> true;
        return event -> !event.startsAt().toLocalDate().isBefore(earliestStartAt);
    }

    private Predicate<CeviEvent> matchesLatestStart() {
        if (latestStartAt == null) return event -> true;
        return event -> !event.startsAt().toLocalDate().isAfter(latestStartAt);
    }

    private Predicate<CeviEvent> matchesName() {
        if (nameContains == null) return event -> true;
        String lookup = lowerCase(nameContains);
        return event -> lowerCase(event.name()).contains(lookup);
    }

    private Predicate<CeviEvent> matchesEventType() {
        if (eventType == null) return event -> true;
        return event -> event.eventType().equals(eventType);
    }

    private Predicate<CeviEvent> matchesKursart() {
        if (kursarten == null || kursarten.isEmpty()) return event -> true;
        Set<String> lookup = kursarten.stream().map(EventFilter::lowerCase).collect(Collectors.toCollection(HashSet::new));
        return event -> lookup.contains(lowerCase(event.kind()));
    }

    private Predicate<CeviEvent> matchesAvailablePlaces() {
        if (hasAvailablePlaces == null) return event -> true;
        return event -> event.hasAvailablePlaces() == hasAvailablePlaces;
    }

    private Predicate<CeviEvent> matchesApplicationOpen() {
        if (isApplicationOpen == null) return event -> true;
        return event -> event.isApplicationOpen() == isApplicationOpen;
    }

    private static String lowerCase(String value) {
        return value == null ? null : value.toLowerCase(Locale.ROOT);
    }
}
