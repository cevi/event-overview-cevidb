package ch.cevi.db.adapter.fixtures;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;

import java.time.LocalDateTime;
import java.time.Month;

public class CeviEventFixture {
    public static CeviEvent ceviEvent() {
        return new CeviEvent("3213",
                "European YWCA General Assembly 2030",
                "Nimm teil an der Generalversammlung des European YWCA’s.",
                "https://db.cevi.ch/groups/1971/public_events/3213",
                LocalDateTime.of(2030, Month.MAY, 18, 0, 0, 0),
                LocalDateTime.of(2030, Month.MAY, 21, 0, 0, 0),
                "Fachgruppen",
                "",
                "",
                CeviEventType.EVENT,
                3,
                null,
                null,
                null,
                null);
    }

    public static CeviEvent ceviCourse() {
        return new CeviEvent("3208",
                "Gruppenleiterkurs GLK 2030",
                "Du willst eine Gruppe selbstständig leiten?",
                "https://db.cevi.ch/groups/2569/public_events/3208",
                LocalDateTime.of(2030, Month.APRIL, 8, 9, 0, 0),
                LocalDateTime.of(2030, Month.APRIL, 15, 17, 0, 0),
                "Cevi Regionalverband AG-SO-LU-ZG",
                "Stäfa",
                "J+S-Leiter*innenkurs LS/T Jugendliche",
                CeviEventType.COURSE,
                10,
                29,
                null,
                null,
                "application_open");
    }
}
