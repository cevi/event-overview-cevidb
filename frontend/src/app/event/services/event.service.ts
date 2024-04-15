import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CeviEventType } from './masterdata.service';

export interface CeviEvent {
  id: string;
  name: string;
  startsAt: Date;
  finishAt: Date;
  group: string;
  applicationLink: string;
  eventType: string;
  participantsCount: number;
  maximumParticipants: number | null;
}

export interface CeviEventFilter {
  group: string | null;
  earliestStartAt: Date | null;
  latestStartAt: Date | null;
  nameContains: string | null;
  eventType: CeviEventType | null;
  kursart: string | null;
  hasAvailablePlaces: boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEventsWithFilter(filter: CeviEventFilter): Observable<CeviEvent[]> {
    return this.http.post<CeviEvent[]>(environment.apiUri + '/events', filter);
  }
}
