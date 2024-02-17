package ch.cevi.db.adapter.hitobito;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PeriodicDataRefresh {
    private final HitobitoProvider provider;

    public PeriodicDataRefresh(HitobitoProvider provider) {
        this.provider = provider;
    }

    @Scheduled(cron = "0 1 * * * *")
    public void periodicDataRefresn() {
        provider.refreshData();
    }
}
