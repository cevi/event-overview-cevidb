import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

export interface CeviEvent {
  id: string;
  name: string;
  startsAt: Date;
  finishAt: Date;
  group: string;
  applicationLink: string;
  eventType: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) { }

  getEvents() {
    return this.http.get<CeviEvent[]>(environment.apiUri + '/events');
  }

  getEventsForGroup(filterOrganisation: string) {
    return this.http.get<CeviEvent[]>(environment.apiUri + '/events?groupFilter=' + filterOrganisation);
  }
}
