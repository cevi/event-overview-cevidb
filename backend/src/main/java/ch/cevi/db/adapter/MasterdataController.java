package ch.cevi.db.adapter;

import ch.cevi.db.adapter.domain.CeviEventType;
import ch.cevi.db.adapter.domain.Masterdata;
import ch.cevi.db.adapter.hitobito.HitobitoProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@CrossOrigin
class MasterdataController {
    private final HitobitoProvider provider;

    public MasterdataController(HitobitoProvider provider) {
        this.provider = provider;
    }

    @GetMapping("/masterdata")
    ResponseEntity<Masterdata> getMasterdata() {
        var organisations = provider.getOrganisations();
        return ResponseEntity.ok(new Masterdata(organisations, Arrays.stream(CeviEventType.values()).toList()));
    }
}
