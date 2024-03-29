import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Masterdata {
  organisations: Organisation[];
  eventTypes: string[];
  kursarten: Kursart[];
}

export interface Organisation {
  name: string;
}

export interface Kursart {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterdataService {
  constructor(private http: HttpClient) { }

  getMasterdata() {
    return this.http.get<Masterdata>(environment.apiUri + '/masterdata');
  }
}
