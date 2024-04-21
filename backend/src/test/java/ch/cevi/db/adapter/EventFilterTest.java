package ch.cevi.db.adapter;

import ch.cevi.db.adapter.fixtures.CeviEventFixture;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class EventFilterTest {
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
