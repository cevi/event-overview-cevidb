package ch.cevi.db.adapter;

import ch.cevi.db.adapter.fixtures.CeviEventFixture;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class EventFilterTest {
    @Test
    void should_filter_available_seats() {
        var ceviEvent = CeviEventFixture.ceviEvent();
        var sut = EventFilter.emptyFilter().withHasAvailablePlaces(true);

        // match as the event has no max participants
        assertThat(ceviEvent.maximumParticipants()).isNull();
        assertThat(sut.match(ceviEvent)).isTrue();

        var eventFull = ceviEvent.withMaximumParticipants(ceviEvent.participantsCount());
        // no match as the max participants has been reached
        assertThat(sut.match(eventFull)).isFalse();

        var eventOverbooked = ceviEvent.withMaximumParticipants(ceviEvent.participantsCount());
        // no match as there are already too many participants
        assertThat(sut.match(eventOverbooked)).isFalse();
    }

    @Test
    void should_filter_no_available_seats() {
        var ceviEvent = CeviEventFixture.ceviEvent();
        var sut = EventFilter.emptyFilter().withHasAvailablePlaces(false);

        // don't match as the event has no max participants
        assertThat(ceviEvent.maximumParticipants()).isNull();
        assertThat(sut.match(ceviEvent)).isFalse();

        var eventFull = ceviEvent.withMaximumParticipants(ceviEvent.participantsCount());
        // match as the max participants has been reached
        assertThat(sut.match(eventFull)).isTrue();

        var eventOverbooked = ceviEvent.withMaximumParticipants(ceviEvent.participantsCount());
        // match as there are already too many participants
        assertThat(sut.match(eventOverbooked)).isTrue();
    }

    @Test
    void should_not_filter_kursarten_when_null_or_empty() {
        var event = CeviEventFixture.ceviEvent().withKind("J+S-Leiter*innenkurs LS/T Jugendliche");

        assertThat(EventFilter.emptyFilter().match(event)).isTrue();
        assertThat(EventFilter.emptyFilter().withKursarten(List.of()).match(event)).isTrue();
    }

    @Test
    void should_filter_by_single_kursart() {
        var matching = CeviEventFixture.ceviEvent().withKind("J+S-Leiter*innenkurs LS/T Jugendliche");
        var nonMatching = CeviEventFixture.ceviEvent().withKind("J+S-Coachkurs LS/T");
        var sut = EventFilter.emptyFilter().withKursarten(List.of("J+S-Leiter*innenkurs LS/T Jugendliche"));

        assertThat(sut.match(matching)).isTrue();
        assertThat(sut.match(nonMatching)).isFalse();
    }

    @Test
    void should_filter_by_multiple_kursarten() {
        var event1 = CeviEventFixture.ceviEvent().withKind("J+S-Leiter*innenkurs LS/T Jugendliche");
        var event2 = CeviEventFixture.ceviEvent().withKind("J+S-Einführungskurs LS/T Kinder");
        var nonMatching = CeviEventFixture.ceviEvent().withKind("J+S-Coachkurs LS/T");
        var sut = EventFilter.emptyFilter().withKursarten(List.of(
                "J+S-Leiter*innenkurs LS/T Jugendliche",
                "J+S-Einführungskurs LS/T Kinder"
        ));

        assertThat(sut.match(event1)).isTrue();
        assertThat(sut.match(event2)).isTrue();
        assertThat(sut.match(nonMatching)).isFalse();
    }

    @Test
    void should_filter_kursarten_case_insensitive() {
        var event = CeviEventFixture.ceviEvent().withKind("J+S-Leiter*innenkurs LS/T Jugendliche");
        var sut = EventFilter.emptyFilter().withKursarten(List.of("j+s-leiter*innenkurs ls/t jugendliche"));

        assertThat(sut.match(event)).isTrue();
    }

    @Test
    void should_filter_open_application() {
        var sut = EventFilter.emptyFilter().withIsApplicationOpen(true);

        var applicationNotYetOpen = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(LocalDate.now().plusDays(1));
        assertThat(sut.match(applicationNotYetOpen)).isFalse();

        var applicationOpen = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(LocalDate.now().minusDays(1));
        assertThat(sut.match(applicationOpen)).isTrue();
    }
}
