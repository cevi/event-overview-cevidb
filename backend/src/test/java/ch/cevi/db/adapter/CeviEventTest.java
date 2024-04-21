package ch.cevi.db.adapter;

import ch.cevi.db.adapter.fixtures.CeviEventFixture;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

public class CeviEventTest {
    @Test
    void should_allow_more_than_max_participants() {
        var overbooked = CeviEventFixture.ceviEvent()
                .withParticipantsCount(15)
                .withMaximumParticipants(10);
        assertThat(overbooked).isNotNull();
    }

    @Test
    void should_have_available_places() {
        var lessThanMaxParticipants = CeviEventFixture.ceviEvent()
                .withParticipantsCount(45)
                .withMaximumParticipants(50);
        assertThat(lessThanMaxParticipants.hasAvailablePlaces()).isTrue();

        var noMaxParticipants = CeviEventFixture.ceviEvent()
                .withParticipantsCount(45)
                .withMaximumParticipants(null);
        assertThat(noMaxParticipants.hasAvailablePlaces()).isTrue();
    }

    @Test
    void should_not_have_available_places() {
        var moreParticipantsThanMax = CeviEventFixture.ceviEvent()
                .withParticipantsCount(55)
                .withMaximumParticipants(50);
        assertThat(moreParticipantsThanMax.hasAvailablePlaces()).isFalse();
    }

    @Test
    void should_allow_closing_application_without_opening() {
        var applicationNotOpenButClosed = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(null)
                .withApplicationClosingAt(LocalDate.now());
        assertThat(applicationNotOpenButClosed).isNotNull();
    }

    @Test
    void should_be_open_for_application() {
        var nevenOpenNeverClosed = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(null)
                .withApplicationClosingAt(null);
        assertThat(nevenOpenNeverClosed.isApplicationOpen()).isTrue();

        var neverOpenButCloseInFuture = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(null)
                .withApplicationClosingAt(LocalDate.now().plusDays(1));
        assertThat(neverOpenButCloseInFuture.isApplicationOpen()).isTrue();

        var openInPastCloseInFuture = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(LocalDate.now().minusDays(1))
                .withApplicationClosingAt(LocalDate.now().plusDays(1));
        assertThat(openInPastCloseInFuture.isApplicationOpen()).isTrue();

        var closeToday = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(null)
                .withApplicationClosingAt(LocalDate.now());
        assertThat(closeToday.isApplicationOpen()).isTrue();

        var openToday = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(LocalDate.now())
                .withApplicationClosingAt(LocalDate.now().plusDays(1));
        assertThat(openToday.isApplicationOpen()).isTrue();
    }

    @Test
    void should_not_be_open_for_application() {
        var notYetOpen = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(LocalDate.now().plusDays(1))
                .withApplicationClosingAt(LocalDate.now().plusDays(2));
        assertThat(notYetOpen.isApplicationOpen()).isFalse();

        var closedInThePast = CeviEventFixture.ceviEvent()
                .withApplicationOpeningAt(LocalDate.now().minusDays(2))
                .withApplicationClosingAt(LocalDate.now().minusDays(1));
        assertThat(closedInThePast.isApplicationOpen()).isFalse();
    }
}
