import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import localeDECH from '@angular/common/locales/de-CH';
import { registerLocaleData } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlDeu } from './core/internationalization/MatPaginatorIntlDeu';

registerLocaleData(localeDECH)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'de-CH' },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlDeu}
]
};
