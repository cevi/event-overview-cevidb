import { Component } from '@angular/core';
import packageJson from '../../../../package.json';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  version: string = packageJson.version;
  backendUrl = environment.apiUri;
}
