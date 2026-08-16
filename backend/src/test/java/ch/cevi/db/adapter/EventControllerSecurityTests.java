package ch.cevi.db.adapter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EventControllerSecurityTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_reject_a_filter_list_beyond_the_limit() throws Exception {
        var tooManyGroups = Collections.nCopies(201, "Fachgruppen");

        mockMvc.perform(post("/events")
                        .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withGroups(tooManyGroups)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_reject_a_search_text_beyond_the_limit() throws Exception {
        mockMvc.perform(post("/events")
                        .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withNameContains("x".repeat(201))))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_accept_a_filter_list_at_the_limit() throws Exception {
        var groups = Collections.nCopies(200, "Fachgruppen");

        mockMvc.perform(post("/events")
                        .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withGroups(groups)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void should_reject_a_body_beyond_the_size_limit() throws Exception {
        // list entries are short enough to pass @Size but together exceed the body limit
        var body = objectMapper.writeValueAsString(
                EventFilter.emptyFilter().withGroups(List.of("g".repeat(RequestSizeLimitFilter.MAX_BODY_BYTES + 1))));

        mockMvc.perform(post("/events")
                        .content(body)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isPayloadTooLarge());
    }

    @Test
    void should_allow_a_cevi_origin() throws Exception {
        mockMvc.perform(options("/events")
                        .header("Origin", "https://www.cevi.ch")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk());
    }

    @Test
    void should_reject_a_foreign_origin() throws Exception {
        mockMvc.perform(options("/events")
                        .header("Origin", "https://angreifer.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }
}
