package ch.cevi.db.adapter.hitobito;

import ch.cevi.db.adapter.EventFilter;
import ch.cevi.db.adapter.domain.CeviEventType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class HitobitoProviderImplTest {

    private static final String GROUP_ID = "g1";
    private static final String GROUP_NAME = "Cevi Alpin";
    private static final String[] GROUPS = {GROUP_NAME};

    private HitobitoProviderImpl sut(HitobitoEventPage... pages) {
        return new HitobitoProviderImpl(() -> List.of(pages), GROUPS, GROUPS);
    }

    private HitobitoEventPage pageWithCourseEvent(String eventId, HitobitoEventDate... dates) {
        var dateIds = java.util.Arrays.stream(dates).map(HitobitoEventDate::id).toArray(String[]::new);
        var event = new HitobitoEvent(eventId, "Kurs", null, "https://db.cevi.ch/public_events/" + eventId,
                new HitobitoLinks(dateIds, new String[]{GROUP_ID}, "k1"),
                0, null, null, null);
        var linked = new HitobitoLinked(dates, new HitobitoGroup[]{new HitobitoGroup(GROUP_ID, GROUP_NAME)},
                new HitobitoEventKind[]{new HitobitoEventKind("k1", "Ski- und Snowboardtour")});
        return new HitobitoEventPage(1, 1, null, new HitobitoEvent[]{event}, linked);
    }

    @Test
    void should_merge_two_start_only_dates_into_single_event() {
        var date1 = new HitobitoEventDate("d1", "2050-12-27T00:00:00.000+01:00", null, "Hospental");
        var date2 = new HitobitoEventDate("d2", "2051-01-02T00:00:00.000+01:00", null, "");
        var provider = sut(pageWithCourseEvent("1", date1, date2));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(1);
        assertThat(events.getFirst().startsAt()).isEqualTo("2050-12-27T00:00:00");
        assertThat(events.getFirst().finishAt()).isEqualTo("2051-01-02T00:00:00");
        assertThat(events.getFirst().location()).isEqualTo("Hospental");
    }

    @Test
    void should_use_second_location_when_first_is_blank() {
        var date1 = new HitobitoEventDate("d1", "2050-06-13T00:00:00.000+02:00", null, "");
        var date2 = new HitobitoEventDate("d2", "2050-06-14T00:00:00.000+02:00", null, "Haslital");
        var provider = sut(pageWithCourseEvent("2", date1, date2));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(1);
        assertThat(events.getFirst().location()).isEqualTo("Haslital");
    }

    @Test
    void should_not_merge_when_one_date_has_finish_at() {
        var date1 = new HitobitoEventDate("d1", "2050-05-30T00:00:00.000+02:00", "2050-05-31T00:00:00.000+02:00", "");
        var date2 = new HitobitoEventDate("d2", "2050-06-05T00:00:00.000+02:00", null, "");
        var provider = sut(pageWithCourseEvent("3", date1, date2));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(2);
    }

    @Test
    void should_not_merge_when_gap_exceeds_14_days() {
        var date1 = new HitobitoEventDate("d1", "2050-01-01T00:00:00.000+01:00", null, "");
        var date2 = new HitobitoEventDate("d2", "2050-02-01T00:00:00.000+01:00", null, "");
        var provider = sut(pageWithCourseEvent("4", date1, date2));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(2);
    }

    @Test
    void should_not_merge_single_date() {
        var date1 = new HitobitoEventDate("d1", "2050-06-01T00:00:00.000+02:00", null, "");
        var provider = sut(pageWithCourseEvent("5", date1));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(1);
        assertThat(events.getFirst().finishAt()).isNull();
    }

    @Test
    void should_not_merge_more_than_two_dates() {
        var date1 = new HitobitoEventDate("d1", "2050-07-01T00:00:00.000+02:00", null, "");
        var date2 = new HitobitoEventDate("d2", "2050-07-05T00:00:00.000+02:00", null, "");
        var date3 = new HitobitoEventDate("d3", "2050-07-10T00:00:00.000+02:00", null, "");
        var provider = sut(pageWithCourseEvent("6", date1, date2, date3));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(3);
    }

    @Test
    void merged_event_has_correct_type_and_kind() {
        var date1 = new HitobitoEventDate("d1", "2050-12-27T00:00:00.000+01:00", null, "");
        var date2 = new HitobitoEventDate("d2", "2051-01-02T00:00:00.000+01:00", null, "");
        var provider = sut(pageWithCourseEvent("7", date1, date2));

        var events = provider.getEvents(EventFilter.emptyFilter());

        assertThat(events).hasSize(1);
        assertThat(events.getFirst().eventType()).isEqualTo(CeviEventType.COURSE);
        assertThat(events.getFirst().kind()).isEqualTo("Ski- und Snowboardtour");
        assertThat(events.getFirst().group()).isEqualTo(GROUP_NAME);
    }
}
