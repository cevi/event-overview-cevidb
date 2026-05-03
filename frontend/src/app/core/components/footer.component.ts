import { Component, inject } from '@angular/core';
import packageJson from '../../../../package.json';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  private readonly config = inject(ConfigService);
  version: string = packageJson.version;
  backendUrl = this.config.apiUri;
}
