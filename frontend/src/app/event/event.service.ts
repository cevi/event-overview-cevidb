import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getEventsWithFilter(filterOrganisation: string, filterEventType: string) {
    let params = new HttpParams();

    if (filterOrganisation !== 'all') {
      params = params.set('groupFilter', filterOrganisation);
    }
    if (filterEventType !== 'all') {
      params = params.set('eventType', filterEventType);
    }

    return this.http.get<CeviEvent[]>(environment.apiUri + '/events?' + params.toString());
  }
}
