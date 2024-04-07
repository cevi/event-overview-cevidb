import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { EventListComponent } from './eventlist.component';
import { CeviEvent, EventService } from '../services/event.service';
import { Masterdata, MasterdataService } from '../services/masterdata.service';
import { MatSelectChange } from '@angular/material/select';

describe('EventlistComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('translateEventTypes', () => {
    const component = new EventListComponent(TestBed.inject(EventService), TestBed.inject(MasterdataService));

    let result = component.translateEventTypes('COURSE');
    expect(result).toEqual("Kurs");

    result = component.translateEventTypes('EVENT');
    expect(result).toEqual('Anlass');

    const events = [{  id: '5',
    name: 'GLK',
    startsAt: new Date(),
    finishAt: new Date(),
    group: 'Cevi Region Zürich',
    applicationLink: 'http://localhost/apply',
    eventType: 'COURSE',
    participantsCount: 10,
    maximumParticipants: 20}] as CeviEvent[];

    const masterdata = {  organisations: [{ name: 'Cevi Alpin'}],
      eventTypes: ['EVENT'],
      kursarten: [{ name: 'Cevi Alpin: Skihochtour'}]
    } as Masterdata;

    const initialEventReq = httpTestingController.match('http://localhost:8080/events?');
    expect(initialEventReq.length).toEqual(1);

    const masterdataReq = httpTestingController.match('http://localhost:8080/masterdata');
    expect(masterdataReq.length).toEqual(1);

    initialEventReq[0].flush(events);
    masterdataReq[0].flush(masterdata);

  });
  it('filterByOrganisation', () => {
    const component = new EventListComponent(TestBed.inject(EventService), TestBed.inject(MasterdataService));

    const events = [{  id: '5',
    name: 'GLK',
    startsAt: new Date(),
    finishAt: new Date(),
    group: 'Cevi Region Zürich',
    applicationLink: 'http://localhost/apply',
    eventType: 'COURSE',
    participantsCount: 10,
    maximumParticipants: 20}] as CeviEvent[];

    const masterdata = {  organisations: [{ name: 'Cevi Alpin'}],
      eventTypes: ['EVENT'],
      kursarten: [{ name: 'Cevi Alpin: Skihochtour'}]
    } as Masterdata;

    const initialEventReq = httpTestingController.match('http://localhost:8080/events?');
    expect(initialEventReq.length).toEqual(1);
    initialEventReq[0].flush(events);

    const masterdataReq = httpTestingController.match('http://localhost:8080/masterdata');
    expect(masterdataReq.length).toEqual(1);
    masterdataReq[0].flush(masterdata);

    component.filterByOrganisation({ value: 'Cevi Alpin'} as MatSelectChange);

    const eventReq = httpTestingController.match('http://localhost:8080/events?groupFilter=Cevi%20Alpin');
    expect(eventReq.length).toEqual(1);
    eventReq[0].flush(events);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
