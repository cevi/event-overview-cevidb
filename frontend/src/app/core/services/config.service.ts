import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private config = { apiUri: '' };

  load(): Observable<void> {
    return this.http.get<{ apiUri: string }>('/assets/config.json').pipe(
      tap(c => (this.config = c)),
      map(() => undefined)
    );
  }

  get apiUri(): string {
    return this.config.apiUri;
  }
}
