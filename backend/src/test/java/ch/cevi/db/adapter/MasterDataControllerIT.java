package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.Masterdata;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("integration")
class MasterDataControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_retrieve_masterdata() throws Exception {
        String content = mockMvc.perform(
                get("/masterdata")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        Masterdata masterdata = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(masterdata.organisations()).hasSizeGreaterThan(5);
        assertThat(masterdata.eventTypes()).hasSizeGreaterThanOrEqualTo(2);
        assertThat(masterdata.kursarten()).hasSizeGreaterThan(20);
    }
}
