package ch.cevi.db.adapter.hitobito;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PeriodicDataRefresh {
    Logger logger = LoggerFactory.getLogger(PeriodicDataRefresh.class);

    private final HitobitoProvider provider;

    public PeriodicDataRefresh(HitobitoProvider provider) {
        this.provider = provider;
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void periodicDataRefresh() {
        try {
            provider.refreshData();
        } catch (RuntimeException e) {
            // keep the previously loaded data, but make a permanently failing refresh visible
            logger.atError().setCause(e).log("Scheduled refresh from Cevi.db failed, keeping the previous data");
        }
    }
}
