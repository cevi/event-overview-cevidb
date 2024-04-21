package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;

import java.time.LocalDate;
import java.util.Locale;

/**
 * Filter to apply to the returned events. Only filter properties != null are applied
 *
 * @param group
 * @param earliestStartAt
 * @param latestStartAt
 * @param nameContains
 * @param eventType
 * @param kursart
 * @param hasAvailablePlaces
 */
public record EventFilter(String group,
                          LocalDate earliestStartAt,
                          LocalDate latestStartAt,
                          String nameContains,
                          CeviEventType eventType,
                          String kursart,
                          Boolean hasAvailablePlaces,
                          Boolean isApplicationOpen) {
    public static EventFilter emptyFilter() {
        return new EventFilter(null, null, null, null, null, null, null, null);
    }

    public EventFilter withGroup(String group) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withEarliestStartAt(LocalDate earliestStartAt) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withLatestStartAt(LocalDate latestStartAt) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withNameContains(String nameContains) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withEventType(CeviEventType eventType) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withKursart(String kursart) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withHasAvailablePlaces(boolean hasAvailablePlaces) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public EventFilter withIsApplicationOpen(boolean isApplicationOpen) {
        return new EventFilter(group, earliestStartAt, latestStartAt, nameContains, eventType, kursart, hasAvailablePlaces, isApplicationOpen);
    }

    public boolean match(CeviEvent event) {
        return (group() == null || event.group().equals(group())) &&
                (earliestStartAt() == null || event.startsAt().toLocalDate().isEqual(earliestStartAt()) || event.startsAt().toLocalDate().isAfter(earliestStartAt())) &&
                (latestStartAt() == null || event.startsAt().toLocalDate().isEqual(latestStartAt()) || event.startsAt().toLocalDate().isBefore(latestStartAt())) &&
                (nameContains() == null || event.name().toLowerCase(Locale.ROOT).contains(nameContains().toLowerCase(Locale.ROOT))) &&
                (eventType() == null || event.eventType().equals(eventType())) &&
                (kursart() == null || event.kind().toLowerCase(Locale.ROOT).equals(kursart().toLowerCase(Locale.ROOT))) &&
                (hasAvailablePlaces() == null ||
                        (hasAvailablePlaces() && event.hasAvailablePlaces()) ||
                        (!hasAvailablePlaces() && !event.hasAvailablePlaces())
                ) &&
                (isApplicationOpen() == null ||
                        (isApplicationOpen() && event.isApplicationOpen()) ||
                        (!isApplicationOpen() && !event.isApplicationOpen()));
    }
}
