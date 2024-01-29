package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("integration")
class EventControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_retrieve_events() throws Exception {
        String content = mockMvc.perform(
                get("/events")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSizeGreaterThan(20);
        assertThat(events.stream().filter(e -> e.id().equals("3821")).findFirst().orElseThrow().name()).isEqualTo("YMCA Europe / General Assembly");
        assertThat(events.stream().filter(e -> e.id().equals("3860")).findFirst().orElseThrow().name()).isEqualTo("Gruppenleiterkurs GLK 2024");
    }
}
