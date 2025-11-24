package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEventType;
import ch.cevi.db.adapter.domain.Kursart;
import ch.cevi.db.adapter.domain.Masterdata;
import ch.cevi.db.adapter.domain.Organisation;
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
@ActiveProfiles("test")
class MasterDataControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_provide_organisations() throws Exception {
        String content = mockMvc.perform(
                get("/masterdata")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        Masterdata masterdata = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(masterdata.organisations()).hasSize(3);
        assertThat(masterdata.organisations()).contains(new Organisation("Cevi Regionalverband AG-SO-LU-ZG"));
    }

    @Test
    void should_provide_cevieventtypes() throws Exception {
        String content = mockMvc.perform(
                        get("/masterdata")
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        Masterdata masterdata = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(masterdata.eventTypes()).hasSize(2);
        assertThat(masterdata.eventTypes()).contains(CeviEventType.COURSE);
    }

    @Test
    void should_provide_kursarten() throws Exception {
        String content = mockMvc.perform(
                        get("/masterdata")
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        Masterdata masterdata = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(masterdata.kursarten()).hasSize(2);
        assertThat(masterdata.kursarten().stream().map(Kursart::name)).contains("J+S-Leiter*innenkurs LS/T Jugendliche");
    }
}
