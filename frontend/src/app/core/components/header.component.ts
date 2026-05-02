import { Component, LOCALE_ID, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly locale = inject(LOCALE_ID);
  currentLang: 'de' | 'fr' = this.locale.startsWith('fr') ? 'fr' : 'de';

  switchLanguage(lang: 'de' | 'fr'): void {
    localStorage.setItem('lang', lang);
    const baseHref =
      document.querySelector('base')?.getAttribute('href') ?? '/';
    if (baseHref !== '/' && baseHref !== './') {
      globalThis.location.href = `/${lang}/${globalThis.location.search}`;
    }
  }
}
