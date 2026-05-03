import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CeviEventType } from './masterdata.service';
import { ConfigService } from '../../core/services/config.service';

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
  applicationOpeningAt: string | null;
  applicationClosingAt: string | null;
  state: string | null;
}

export interface CeviEventFilter {
  groups: string[] | null;
  earliestStartAt: Date | null;
  latestStartAt: Date | null;
  nameContains: string | null;
  eventType: CeviEventType | null;
  kursarten: string[] | null;
  hasAvailablePlaces: boolean | null;
  isApplicationOpen: boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  getEventsWithFilter(filter: CeviEventFilter): Observable<CeviEvent[]> {
    return this.http.post<CeviEvent[]>(this.config.apiUri + '/events', filter);
  }
}
