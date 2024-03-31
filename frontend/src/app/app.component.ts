import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/components/footer.component';
import { HeaderComponent } from './core/components/header.component';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  iframe = false;

  constructor(private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {}

  ngOnInit() {
    this.prepareForIFrameIfRequested();
  }

  prepareForIFrameIfRequested() {
    this.route.queryParamMap.subscribe(params => {
      if (params.has("iframe") && params.get("iframe") === 'true') {
        this.iframe = true;
        this.renderer.addClass(this.document.body, 'no-margin');
      }
    });
  }
}
