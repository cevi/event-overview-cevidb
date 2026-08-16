package ch.cevi.db.adapter;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Guards the encoding of the .properties files.
 * <p>
 * Spring Boot reads .properties as ISO-8859-1, so a literal umlaut only survives as long as
 * the file itself stays ISO-8859-1 encoded. Saving it as UTF-8 turns "Zürich" into "ZÃ¼rich",
 * and a lossy conversion replaces the umlaut with U+FFFD - the latter is what happened to the
 * group whitelists in v1.0.13. Either way the group name silently stops matching the one
 * delivered by the Cevi.db, and every event of that organisation disappears from the overview
 * without an error showing up anywhere.
 * <p>
 * Non-ASCII characters therefore have to be written as \\uXXXX escapes, which
 * {@link Properties} resolves independently of the file encoding.
 */
class ApplicationPropertiesTest {
    @Test
    void should_read_event_groups_including_umlauts() throws IOException {
        var eventGroups = groupsOf("application.event.groups.include");

        assertThat(eventGroups).contains("Cevi Region Zürich", "Cevi Familie-Füür");
    }

    @Test
    void should_read_course_groups_including_umlauts() throws IOException {
        var courseGroups = groupsOf("application.course.groups.include");

        assertThat(courseGroups).contains("Cevi Region Zürich");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/application.properties",
            "/application-int.properties",
            "/application-test.properties",
            "/application-integration.properties"})
    void should_be_written_in_pure_ascii(String resource) throws IOException {
        var content = readRaw(resource);

        assertThat(content.chars().filter(character -> character > 127).count())
                .describedAs("%s must stay pure ASCII - write non-ASCII characters as \\uXXXX escapes", resource)
                .isZero();
    }

    private String[] groupsOf(String key) throws IOException {
        var value = load("/application.properties").getProperty(key);

        assertThat(value).describedAs("property %s", key).isNotNull();
        return Arrays.stream(value.split(",")).map(String::trim).toArray(String[]::new);
    }

    private Properties load(String resource) throws IOException {
        var properties = new Properties();
        try (InputStream in = openRequired(resource)) {
            // same reader Spring Boot uses for .properties: ISO-8859-1 plus \\uXXXX escapes
            properties.load(in);
        }
        return properties;
    }

    private String readRaw(String resource) throws IOException {
        try (InputStream in = openRequired(resource)) {
            // one char per byte, so any byte above 127 stays visible
            return new String(in.readAllBytes(), StandardCharsets.ISO_8859_1);
        }
    }

    private InputStream openRequired(String resource) {
        var in = getClass().getResourceAsStream(resource);
        assertThat(in).describedAs("resource %s", resource).isNotNull();
        return in;
    }
}
