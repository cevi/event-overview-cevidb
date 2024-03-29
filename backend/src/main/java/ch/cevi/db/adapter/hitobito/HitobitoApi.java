package ch.cevi.db.adapter.hitobito;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

class HitobitoApi implements HitobitoApiProvider {
    Logger logger = LoggerFactory.getLogger(HitobitoApi.class);

    private final String firstEventPageUrl;
    private final String firstCoursePageUrl;

    public HitobitoApi(String hitobitoInstance, int hitobitoGroupId, String hitobitoToken) {
        Objects.requireNonNull(hitobitoInstance);
        Objects.requireNonNull(hitobitoToken);

        this.firstEventPageUrl =  "https://" + hitobitoInstance + "/groups/" + hitobitoGroupId + "/events.json?token=" + hitobitoToken;
        this.firstCoursePageUrl = "https://" + hitobitoInstance + "/groups/" + hitobitoGroupId + "/events/course.json?token=" + hitobitoToken;
    }

    @Override
    public List<HitobitoEventPage> getEventPages() {
        List<HitobitoEventPage> pages = new LinkedList<>();
        pages.addAll(discoverEventPages(firstEventPageUrl + "&start_date=" + LocalDate.now()));
        pages.addAll(discoverEventPages(firstCoursePageUrl + "&start_date=" + LocalDate.now()));
        return pages;
    }

    private List<HitobitoEventPage> discoverEventPages(String startUrl) {
        List<HitobitoEventPage> pages = new LinkedList<>();

        var converter = new MappingJackson2HttpMessageConverter();
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        var restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().addFirst(converter);

        String nextPageUrl = startUrl;
        while (nextPageUrl != null) {
            long startMillis = System.currentTimeMillis();
            var page = restTemplate.getForObject(nextPageUrl, HitobitoEventPage.class);
            logger.atDebug().log("Request to Cevi.db took {}ms", System.currentTimeMillis() - startMillis);
            pages.add(page);
            nextPageUrl = page.next_page_link();
        }

        return pages;
    }
}
