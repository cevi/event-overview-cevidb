import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import localeDECH from '@angular/common/locales/de-CH';
import localeFRCH from '@angular/common/locales/fr-CH';
import { registerLocaleData } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlCevi } from './core/internationalization/MatPaginatorIntlCevi';

registerLocaleData(localeDECH);
registerLocaleData(localeFRCH);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCevi },
  ],
};
