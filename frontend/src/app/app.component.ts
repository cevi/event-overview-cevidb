import { Component, OnInit, Renderer2, DOCUMENT, inject } from '@angular/core';
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
  private route = inject(ActivatedRoute);
  private document = inject<Document>(DOCUMENT);
  private renderer = inject(Renderer2);

  iframe = false;

  ngOnInit() {
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
