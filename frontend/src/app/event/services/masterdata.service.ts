import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../core/services/config.service';

export type CeviEventType = 'COURSE' | 'EVENT';

export interface Masterdata {
  organisations: Organisation[];
  eventTypes: CeviEventType[];
  kursarten: Kursart[];
}

export interface Organisation {
  name: string;
}

export interface Kursart {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MasterdataService {
  private http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  getMasterdata(): Observable<Masterdata> {
    return this.http.get<Masterdata>(this.config.apiUri + '/masterdata');
  }
}
