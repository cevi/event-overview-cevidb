package ch.cevi.db.adapter.config;

import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
public class BuildPropertiesConfig {
    @Bean
    public BuildProperties buildProperties() {
        final Properties p = new Properties();
        p.setProperty("version", "0.0.1");
        p.setProperty("time", "2024-03-19T23:24:15+01:00");
        return new BuildProperties(p);
    }
}
