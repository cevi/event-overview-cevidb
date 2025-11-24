package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEvent;
import ch.cevi.db.adapter.domain.CeviEventType;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EventControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${application.event.groups.include}")
    String[] eventGroups;

    @Value("${application.course.groups.include}")
    String[] courseGroups;

    @Test
    void should_retrieve_events() throws Exception {
        String content = mockMvc.perform(
                post("/events")
                        .content(objectMapper.writeValueAsString(EventFilter.emptyFilter()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        // note: one is filtered because it lies in the past
        assertThat(events).hasSize(14);

        // events are sorted ascending
        var startDates = events.stream().map(CeviEvent::startsAt).toList();
        var prevStartDate = startDates.getFirst();
        for (int i=1; i<startDates.size(); i++) {
            assertThat(startDates.get(i)).isAfterOrEqualTo(prevStartDate);
            prevStartDate = startDates.get(i);
        }

        // events are only from whitelisted groups
        var group = events.stream()
                .filter(e -> e.eventType() == CeviEventType.EVENT)
                .map(CeviEvent::group).distinct().toList();
        var whitelistGroups = Arrays.stream(eventGroups).collect(Collectors.toSet());
        assertThat(group).allMatch(whitelistGroups::contains);

        // courses are only from whitelisted groups
        var courseGroup = events.stream()
                .filter(e -> e.eventType() == CeviEventType.COURSE)
                .map(CeviEvent::group).distinct().toList();
        var whitelistCourseGroups = Arrays.stream(courseGroups).collect(Collectors.toSet());
        assertThat(courseGroup).allMatch(whitelistCourseGroups::contains);

        // an event from FGI
        var ga = events.stream().filter(e -> e.id().equals("3213")).findFirst().orElseThrow();
        assertThat(ga.id()).isEqualTo("3213");
        assertThat(ga.name()).isEqualTo("European YWCA General Assembly 2030");
        assertThat(ga.description()).isEqualTo("Nimm teil an der Generalversammlung des European YWCA’s.");
        assertThat(ga.applicationLink()).isEqualTo("https://db.cevi.ch/groups/1971/public_events/3213");
        assertThat(ga.startsAt()).isEqualTo(LocalDateTime.of(LocalDate.of(2030, Month.MAY, 18), LocalTime.of(0, 0, 0)));
        assertThat(ga.finishAt()).isEqualTo(LocalDateTime.of(LocalDate.of(2030, Month.MAY, 21), LocalTime.of(0, 0, 0)));
        assertThat(ga.group()).isEqualTo("Fachgruppen");
        assertThat(ga.location()).isEqualTo("Antwerpen (Belgien)");
        assertThat(ga.kind()).isEqualTo("N/A");
        assertThat(ga.eventType()).isEqualTo(CeviEventType.EVENT);
        assertThat(ga.participantsCount()).isEqualTo(3);
        assertThat(ga.hasLimitedCapacity()).isEqualTo(false);
        assertThat(ga.maximumParticipants()).isNull();

        // an event with multiple occurences
        var versaende = events.stream().filter(e -> e.id().equals("3457")).toList();
        assertThat(versaende).hasSize(11);

        // a course with multiple occurrences
        var glk = events.stream().filter(e -> e.id().equals("3208")).toList();
        assertThat(glk).hasSize(2);
        var firstGlk = glk.getFirst();
        assertThat(firstGlk.id()).isEqualTo("3208");
        assertThat(firstGlk.name()).isEqualTo("Gruppenleiterkurs GLK 2030");
        assertThat(firstGlk.description()).isEqualTo("Du willst eine Gruppe selbstständig leiten?");
        assertThat(firstGlk.applicationLink()).isEqualTo("https://db.cevi.ch/groups/2569/public_events/3208");
        assertThat(firstGlk.startsAt()).isEqualTo(LocalDateTime.of(LocalDate.of(2030, Month.MARCH, 4), LocalTime.of(9, 0, 0)));
        assertThat(firstGlk.finishAt()).isEqualTo(LocalDateTime.of(LocalDate.of(2030, Month.MARCH, 5), LocalTime.of(17, 0, 0)));
        assertThat(firstGlk.group()).isEqualTo("Cevi Regionalverband AG-SO-LU-ZG");
        assertThat(firstGlk.location()).isEqualTo("Windisch");
        assertThat(firstGlk.kind()).isEqualTo("J+S-Leiter*innenkurs LS/T Jugendliche");
        assertThat(firstGlk.eventType()).isEqualTo(CeviEventType.COURSE);
        assertThat(firstGlk.participantsCount()).isEqualTo(36);
        assertThat(firstGlk.hasLimitedCapacity()).isEqualTo(true);
        assertThat(firstGlk.maximumParticipants()).isEqualTo(29);
    }

    @Test
    void should_filter_group() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withGroups(List.of("Fachgruppen"))))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(1);

        // an event from FGI
        var ga = events.stream().filter(e -> e.id().equals("3213")).findFirst().orElseThrow();
        assertThat(ga.name()).isEqualTo("European YWCA General Assembly 2030");
        assertThat(ga.eventType()).isEqualTo(CeviEventType.EVENT);

        content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withGroups(List.of("Cevi Regionalverband AG-SO-LU-ZG"))))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(2);


        // a course with multiple occurrences
        var glk = events.stream().filter(e -> e.id().equals("3208")).toList();
        assertThat(glk).hasSize(2);
        var firstGlk = glk.getFirst();
        assertThat(firstGlk.id()).isEqualTo("3208");
        assertThat(firstGlk.name()).isEqualTo("Gruppenleiterkurs GLK 2030");
        assertThat(firstGlk.eventType()).isEqualTo(CeviEventType.COURSE);
    }

    @Test
    void should_filter_groups() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withGroups(List.of("Fachgruppen", "Cevi Regionalverband AG-SO-LU-ZG"))))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(3);

        // an event from FGI
        var ga = events.stream().filter(e -> e.id().equals("3213")).findFirst().orElseThrow();
        assertThat(ga.name()).isEqualTo("European YWCA General Assembly 2030");
        assertThat(ga.eventType()).isEqualTo(CeviEventType.EVENT);

        // a course with multiple occurrences
        var glk = events.stream().filter(e -> e.id().equals("3208")).toList();
        assertThat(glk).hasSize(2);
        var firstGlk = glk.getFirst();
        assertThat(firstGlk.id()).isEqualTo("3208");
        assertThat(firstGlk.name()).isEqualTo("Gruppenleiterkurs GLK 2030");
        assertThat(firstGlk.eventType()).isEqualTo(CeviEventType.COURSE);
    }

    @Test
    void should_filter_earliest_start_at() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withEarliestStartAt(LocalDate.of(2030, Month.JULY, 5))))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(6);
        assertThat(events).allMatch(e -> e.startsAt().isEqual(LocalDateTime.of(2030, Month.JULY, 5, 0, 0, 0)) || e.startsAt().isAfter(LocalDateTime.of(2023, Month.JULY, 5, 0, 0, 0)));
    }

    @Test
    void should_filter_latest_start_at() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withLatestStartAt(LocalDate.of(2030, Month.JULY, 5))))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        // note: one is filtered because it lies in the past
        assertThat(events).hasSize(9);
        assertThat(events).allMatch(e -> e.startsAt().isEqual(LocalDateTime.of(2030, Month.JULY, 5, 0, 0, 0)) || e.startsAt().isBefore(LocalDateTime.of(2030, Month.JULY, 5, 0, 0, 0)));
    }

    @Test
    void should_filter_earliest_and_latest_start_at() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter()
                                        .withLatestStartAt(LocalDate.of(2030, Month.JULY, 5))
                                        .withEarliestStartAt(LocalDate.of(2030, Month.MARCH, 5))))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(6);
        assertThat(events).allMatch(e -> e.startsAt().isEqual(LocalDateTime.of(2030, Month.JULY, 5, 0, 0, 0)) || e.startsAt().isBefore(LocalDateTime.of(2030, Month.JULY, 5, 0, 0, 0)));
    }

    @Test
    void should_filter_by_name() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter()
                                        .withNameContains("Gruppenleiterkurs")))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {
        });
        assertThat(events).hasSize(2);
        assertThat(events).allMatch(e -> e.name().contains("Gruppenleiterkurs"));

        // with wrong casing
        content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter()
                                        .withNameContains("gruppenleiterkurs")))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        events = objectMapper.readValue(content, new TypeReference<>() {
        });
        assertThat(events).hasSize(2);
        assertThat(events).allMatch(e -> e.name().contains("Gruppenleiterkurs"));
    }

    @Test
    void should_filter_by_type() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withEventType(CeviEventType.EVENT)))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {
        });
        // note: one is filltered because it is in the past
        assertThat(events).hasSize(12);
        assertThat(events).allMatch(e -> e.eventType().equals(CeviEventType.EVENT));

        content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withEventType(CeviEventType.COURSE)))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        events = objectMapper.readValue(content, new TypeReference<>() {
        });
        assertThat(events).hasSize(2);
        assertThat(events).allMatch(e -> e.eventType().equals(CeviEventType.COURSE));
    }

    @Test
    void should_filter_by_kursart() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withKursart("J+S-Leiter*innenkurs LS/T Jugendliche")))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {
        });
        assertThat(events).hasSize(2);
        assertThat(events).allMatch(e -> e.kind().equals("J+S-Leiter*innenkurs LS/T Jugendliche"));

        // with wrong casing
        content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withKursart("j+s-leiter*innenkurs ls/T Jugendliche")))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        events = objectMapper.readValue(content, new TypeReference<>() {
        });
        assertThat(events).hasSize(2);
        assertThat(events).allMatch(e -> e.kind().equals("J+S-Leiter*innenkurs LS/T Jugendliche"));
    }

    @Test
    void should_filter_available_places() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withHasAvailablePlaces(true)))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(12);

        // an event from FGI
        var ga = events.stream().filter(e -> e.id().equals("3213")).findFirst().orElseThrow();
        assertThat(ga.name()).isEqualTo("European YWCA General Assembly 2030");
        assertThat(ga.eventType()).isEqualTo(CeviEventType.EVENT);
    }

    @Test
    void should_filter_is_application_open() throws Exception {
        String content = mockMvc.perform(
                        post("/events")
                                .content(objectMapper.writeValueAsString(EventFilter.emptyFilter().withIsApplicationOpen(true)))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<CeviEvent> events = objectMapper.readValue(content, new TypeReference<>() {});
        assertThat(events).hasSize(12);

        // an event from FGI
        var ga = events.stream().filter(e -> e.id().equals("3213")).findFirst().orElseThrow();
        assertThat(ga.name()).isEqualTo("European YWCA General Assembly 2030");
        assertThat(ga.eventType()).isEqualTo(CeviEventType.EVENT);
    }
}
