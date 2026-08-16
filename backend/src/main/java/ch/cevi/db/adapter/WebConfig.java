package ch.cevi.db.adapter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Central CORS policy for all endpoints (NFR-014). Browsers may call the API from Cevi websites;
 * server-side callers are unaffected, since they send no Origin.
 */
@Configuration
class WebConfig implements WebMvcConfigurer {
    private final String[] allowedOriginPatterns;

    WebConfig(@Value("${application.cors.allowed.origin.patterns}") String[] allowedOriginPatterns) {
        this.allowedOriginPatterns = allowedOriginPatterns.clone();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(allowedOriginPatterns)
                .allowedMethods("GET", "HEAD", "POST")
                .allowedHeaders("Content-Type")
                .maxAge(3600);
    }
}
