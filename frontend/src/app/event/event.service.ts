import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.http.get<CeviEvent[]>('http://localhost:8080/events')
  }
}
