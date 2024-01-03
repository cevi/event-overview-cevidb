package ch.cevi.db.adapter.domain;

import java.util.Objects;

public record Kursart (String name) {
    public Kursart {
        Objects.requireNonNull(name);
    }
}
