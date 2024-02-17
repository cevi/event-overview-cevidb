package ch.cevi.db.adapter.hitobito;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class HitobitoConfig {
    @Bean
    @ConditionalOnProperty(
            value="application.fake.hitobito.enable",
            havingValue = "true")
    public HitobitoApiProvider hitobitoFake(ResourceLoader resourceLoader, ObjectMapper objectMapper) throws IOException {
        return new HitobitoApiFake(resourceLoader, objectMapper);
    }

    @Bean
    @ConditionalOnProperty(
            value="application.fake.hitobito.enable",
            havingValue = "false",
            matchIfMissing = true)
    public HitobitoApiProvider hitobitoApiProvider(
            @Value("${application.hitobito.instance}")
            String hitobitoInstance,
            @Value("${application.hitobito.group.id}")
            int hitobitoGroupId,
            @Value("${application.hitobito.api.token.file}")
            String hitobitoTokenFile) throws IOException {
        if (!Files.exists(Path.of(hitobitoTokenFile))) {
            throw new IllegalArgumentException("Need to configure application.hitobito.api.token.file with an existing file!");
        }
        var hitobitoToken = Files.readString(Path.of(hitobitoTokenFile)).trim();
        return new HitobitoApi(hitobitoInstance, hitobitoGroupId, hitobitoToken);
    }

    @Bean
    public HitobitoProvider hitobitoProvider(HitobitoApiProvider apiProvider,
                                             @Value("${application.event.groups.include}")
                                             String[] eventGroups,
                                             @Value("${application.course.groups.include}")
                                             String[] courseGroups) {
        return new HitobitoProviderImpl(apiProvider, eventGroups, courseGroups);
    }
}
