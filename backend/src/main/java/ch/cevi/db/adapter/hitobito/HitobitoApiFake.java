package ch.cevi.db.adapter.hitobito;

import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.util.List;

class HitobitoApiFake implements HitobitoApiProvider {
    private final List<HitobitoEventPage> events;

    public HitobitoApiFake(ResourceLoader resourceLoader, ObjectMapper objectMapper) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:fake_data/event0.json");
        Resource resource2 = resourceLoader.getResource("classpath:fake_data/event1.json");
        Resource resource3 = resourceLoader.getResource("classpath:fake_data/course0.json");
        this.events = List.of(objectMapper.readValue(resource.getInputStream(), HitobitoEventPage.class),
                objectMapper.readValue(resource2.getInputStream(), HitobitoEventPage.class),
                objectMapper.readValue(resource3.getInputStream(), HitobitoEventPage.class));
    }

    @Override
    public List<HitobitoEventPage> getEventPages() {
        return this.events;
    }
}
