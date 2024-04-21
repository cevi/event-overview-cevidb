package ch.cevi.db.adapter.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

public record CeviEvent(String id, String name, String description, String applicationLink, LocalDateTime startsAt,
                        LocalDateTime finishAt, String group, String location, String kind, CeviEventType eventType,
                        int participantsCount, Integer maximumParticipants, LocalDate applicationOpeningAt, LocalDate applicationClosingAt) {
    public CeviEvent {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name, () -> "Name mustn't be null for event " + id);
        Objects.requireNonNull(description, () -> "Description mustn't be null für event " + id);
        Objects.requireNonNull(applicationLink, () -> "Application Link mustn't be null for event " + id);
        Objects.requireNonNull(startsAt, () -> "Start mustn't be null for event " + id);
        Objects.requireNonNull(group, () -> "Group mustn't be null for event " + id);
        Objects.requireNonNull(location, () -> "Location mustn't be null for event " + id);
        if (participantsCount < 0) {
            throw new IllegalArgumentException("The participantCount must be at least 0");
        }
        if (maximumParticipants != null && maximumParticipants < 1) {
            throw new IllegalArgumentException("The maximum participants must be at least 1 if set");
        }
    }

    public CeviEvent withParticipantsCount(Integer participantsCount) {
        return new CeviEvent(id, name, description, applicationLink, startsAt, finishAt, group, location, kind, eventType, participantsCount, maximumParticipants, applicationOpeningAt, applicationClosingAt);
    }

    public CeviEvent withMaximumParticipants(Integer maximumParticipants) {
        return new CeviEvent(id, name, description, applicationLink, startsAt, finishAt, group, location, kind, eventType, participantsCount, maximumParticipants, applicationOpeningAt, applicationClosingAt);
    }

    public CeviEvent withApplicationOpeningAt(LocalDate applicationOpeningAt) {
        return new CeviEvent(id, name, description, applicationLink, startsAt, finishAt, group, location, kind, eventType, participantsCount, maximumParticipants, applicationOpeningAt, applicationClosingAt);
    }

    public CeviEvent withApplicationClosingAt(LocalDate applicationClosingAt) {
        return new CeviEvent(id, name, description, applicationLink, startsAt, finishAt, group, location, kind, eventType, participantsCount, maximumParticipants, applicationOpeningAt, applicationClosingAt);
    }

    public boolean hasLimitedCapacity() {
        return maximumParticipants != null;
    }

    public boolean hasAvailablePlaces() {
        return this.maximumParticipants() == null || this.maximumParticipants() > this.participantsCount();
    }

    public boolean isApplicationOpen() {
        return (this.applicationClosingAt == null || LocalDate.now().isBefore(this.applicationClosingAt) || LocalDate.now().isEqual(this.applicationClosingAt)) &&
                (this.applicationOpeningAt == null || LocalDate.now().isAfter(this.applicationOpeningAt) || LocalDate.now().isEqual(this.applicationOpeningAt));
    }
}
