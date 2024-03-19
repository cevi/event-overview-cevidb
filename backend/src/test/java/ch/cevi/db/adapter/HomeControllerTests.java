package ch.cevi.db.adapter;

import ch.cevi.db.adapter.hitobito.HitobitoProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class HomeControllerTests {


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private HitobitoProvider provider;

    @Test
    void should_give_some_information() throws Exception {
        var formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

        String content = mockMvc.perform(
                get("/"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);

        assertThat(content).isEqualToIgnoringWhitespace("""
                <h1>Cevi Event API</h1>
                <p>Stellt Anlässe und Kurse von der Cevi.db bereit. Siehe <a href="https://events.cevi.tools">Frontend</a></p>
                <p><a href="https://github.com/cevi/event-overview-cevidb">GitHub Repository</a></p>
                <p>Aktuell sind 12 Anlässe und 2 Kurse geladen</p>
                <p>Die letzte Aktualisierung erfolgte am %s</p>
                <p>Version: 0.0.1, gebaut am 19.03.2024 23:24:15</p>
                """.formatted(formatter.format(provider.getLastRefreshDate())));
    }
}
