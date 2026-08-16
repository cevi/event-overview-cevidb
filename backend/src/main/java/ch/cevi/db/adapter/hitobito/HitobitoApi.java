package ch.cevi.db.adapter.hitobito;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.http.HttpClient;
import java.time.Duration;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

class HitobitoApi implements HitobitoApiProvider {
    /**
     * Hard upper bound on the pages fetched per request. A compromised or broken upstream could
     * otherwise keep pointing at a next page forever until the heap is exhausted.
     */
    private static final int MAX_PAGES = 200;
    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration READ_TIMEOUT = Duration.ofSeconds(30);

    Logger logger = LoggerFactory.getLogger(HitobitoApi.class);

    private final RestClient restClient;

    private final String hitobitoInstance;
    private final String hitobitoToken;
    private final String firstEventPageUrl;
    private final String firstCoursePageUrl;

    public HitobitoApi(String hitobitoInstance, int hitobitoGroupId, String hitobitoToken) {
        this(hitobitoInstance, hitobitoGroupId, hitobitoToken, defaultRestClient());
    }

    HitobitoApi(String hitobitoInstance, int hitobitoGroupId, String hitobitoToken, RestClient restClient) {
        Objects.requireNonNull(hitobitoInstance);
        Objects.requireNonNull(hitobitoToken);

        this.hitobitoInstance = hitobitoInstance;
        this.hitobitoToken = hitobitoToken;
        this.restClient = restClient;
        this.firstEventPageUrl = "https://" + hitobitoInstance + "/groups/" + hitobitoGroupId + "/events.json";
        this.firstCoursePageUrl = "https://" + hitobitoInstance + "/groups/" + hitobitoGroupId + "/events/course.json";
    }

    private static RestClient defaultRestClient() {
        // Without these the JDK default applies, which is "wait forever": a hanging Cevi.db would
        // block the calling thread — during startup that is the whole application.
        var httpClient = HttpClient.newBuilder()
                .connectTimeout(CONNECT_TIMEOUT)
                // NEVER: a redirect to another host must not silently carry the token along
                .followRedirects(HttpClient.Redirect.NEVER)
                .build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(READ_TIMEOUT);
        return RestClient.builder().requestFactory(requestFactory).build();
    }

    @Override
    public List<HitobitoEventPage> getEventPages() {
        List<HitobitoEventPage> pages = new LinkedList<>();
        pages.addAll(discoverEventPages(firstEventPageUrl + "?start_date=" + LocalDate.now()));
        pages.addAll(discoverEventPages(firstCoursePageUrl + "?start_date=" + LocalDate.now()));
        return pages;
    }

    private List<HitobitoEventPage> discoverEventPages(String startUrl) {
        List<HitobitoEventPage> pages = new LinkedList<>();

        String nextPageUrl = startUrl;
        while (nextPageUrl != null) {
            if (pages.size() >= MAX_PAGES) {
                throw new IllegalStateException("Aborting: Cevi.db offered more than " + MAX_PAGES + " pages");
            }
            pages.add(fetchPage(nextPageUrl));
            nextPageUrl = pages.getLast().next_page_link();
        }

        return pages;
    }

    private HitobitoEventPage fetchPage(String pageUrl) {
        var uri = trustedUri(pageUrl);

        long startMillis = System.currentTimeMillis();
        // The token goes into a header, never into the URL: URLs end up in access logs, proxy logs
        // and in the exception messages of RestClient.
        var page = restClient.get().uri(uri)
                .header("X-Token", hitobitoToken)
                .retrieve()
                .body(HitobitoEventPage.class);
        logger.atDebug().log("Request to Cevi.db took {}ms", System.currentTimeMillis() - startMillis);
        return page;
    }

    /**
     * Pagination links are supplied by the upstream and are therefore untrusted input. Following one
     * blindly would send the token to any host Cevi.db names.
     */
    private URI trustedUri(String pageUrl) {
        URI uri;
        try {
            uri = new URI(pageUrl);
        } catch (Exception e) {
            throw new IllegalStateException("Cevi.db offered a malformed page link", e);
        }
        if (!"https".equals(uri.getScheme()) || !hitobitoInstance.equalsIgnoreCase(uri.getHost())) {
            throw new IllegalStateException("Refusing to follow a page link outside of " + hitobitoInstance);
        }
        return uri;
    }
}
