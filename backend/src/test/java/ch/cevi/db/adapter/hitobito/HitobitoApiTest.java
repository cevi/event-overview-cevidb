package ch.cevi.db.adapter.hitobito;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class HitobitoApiTest {
    private static final String TOKEN = "s3cret-token";

    private static String page(String nextPageLink) {
        String next = nextPageLink == null ? "null" : "\"" + nextPageLink + "\"";
        return """
                {"current_page":1,"total_pages":1,"next_page_link":%s,"events":[],
                 "linked":{"event_dates":[],"groups":[]}}
                """.formatted(next);
    }

    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
    private final HitobitoApi sut = new HitobitoApi("db.cevi.ch", 1, TOKEN, builder.build());

    @Test
    void should_send_the_token_as_header_and_never_in_the_url() {
        server.expect(ExpectedCount.twice(), requestTo(not(containsString(TOKEN))))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-Token", TOKEN))
                .andRespond(withSuccess(page(null), MediaType.APPLICATION_JSON));

        assertThat(sut.getEventPages()).hasSize(2);
        server.verify();
    }

    @Test
    void should_follow_a_page_link_of_the_configured_instance() {
        server.expect(requestTo(startsWith("https://db.cevi.ch/groups/1/events.json")))
                .andRespond(withSuccess(page("https://db.cevi.ch/groups/1/events/simple.json?page=2"), MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://db.cevi.ch/groups/1/events/simple.json?page=2"))
                .andExpect(header("X-Token", TOKEN))
                .andRespond(withSuccess(page(null), MediaType.APPLICATION_JSON));
        server.expect(requestTo(startsWith("https://db.cevi.ch/groups/1/events/course.json")))
                .andRespond(withSuccess(page(null), MediaType.APPLICATION_JSON));

        assertThat(sut.getEventPages()).hasSize(3);
        server.verify();
    }

    @Test
    void should_refuse_a_page_link_pointing_to_another_host() {
        server.expect(requestTo(startsWith("https://db.cevi.ch/groups/1/events.json")))
                .andRespond(withSuccess(page("https://angreifer.example/x"), MediaType.APPLICATION_JSON));

        assertThatThrownBy(sut::getEventPages)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("db.cevi.ch");
        server.verify();
    }

    @Test
    void should_refuse_an_unencrypted_page_link() {
        server.expect(requestTo(startsWith("https://db.cevi.ch/groups/1/events.json")))
                .andRespond(withSuccess(page("http://db.cevi.ch/groups/1/events.json?page=2"), MediaType.APPLICATION_JSON));

        assertThatThrownBy(sut::getEventPages).isInstanceOf(IllegalStateException.class);
        server.verify();
    }

    @Test
    void should_stop_after_the_maximum_number_of_pages() {
        server.expect(ExpectedCount.manyTimes(), requestTo(startsWith("https://db.cevi.ch/")))
                .andRespond(withSuccess(page("https://db.cevi.ch/groups/1/events.json?page=2"), MediaType.APPLICATION_JSON));

        assertThatThrownBy(sut::getEventPages)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("200 pages");
    }
}
