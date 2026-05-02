import {
  Component,
  OnInit,
  Renderer2,
  DOCUMENT,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/components/footer.component';
import { HeaderComponent } from './core/components/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject<Document>(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly locale = inject(LOCALE_ID);

  iframe = false;

  ngOnInit() {
    this.document.documentElement.lang = this.locale.split('-')[0];
    this.prepareForIFrameIfRequested();
  }

  prepareForIFrameIfRequested() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('iframe') && params.get('iframe') === 'true') {
        this.iframe = true;
        this.renderer.addClass(this.document.body, 'no-margin');
      }
    });
  }
}
