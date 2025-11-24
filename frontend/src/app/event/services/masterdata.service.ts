import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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

  getMasterdata(): Observable<Masterdata> {
    return this.http.get<Masterdata>(environment.apiUri + '/masterdata');
  }
}
