package ch.cevi.db.adapter.domain;

import java.util.List;

public record Masterdata(List<Organisation> organisations, List<CeviEventType> eventTypes, List<Kursart> kursarten) {
}
