package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class CeviEventTest {
    @Test
    void should_allow_more_than_max_participants() {
        var event = new CeviEvent("1", "name", "desription", "link",
                LocalDateTime.now(), LocalDateTime.now(), "group", "location", "kind", CeviEventType.COURSE,
                15, 10);
        assertThat(event).isNotNull();
    }
}
