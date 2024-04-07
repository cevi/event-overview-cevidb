import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CeviEvent, EventService } from './event.service';

describe('EventService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('getEventsWithFilter', (done: DoneFn) => {
    const service = TestBed.inject(EventService);

    const events = [{  id: '5',
      name: 'GLK',
      startsAt: new Date(),
      finishAt: new Date(),
      group: 'Cevi Region Zürich',
      applicationLink: 'http://localhost/apply',
      eventType: 'COURSE',
      participantsCount: 10,
      maximumParticipants: 20}] as CeviEvent[];

    service.getEventsWithFilter('Cevi Region Zürich', 'COURSE', 'GLK', 'J+S-Leiter*innenkurs LS/T Jugendliche').subscribe((value) => {
      expect(value).toEqual(events);
      done();
    });

    const req = httpTestingController.expectOne({ method: 'GET',
    url: 'http://localhost:8080/events?groupFilter=Cevi%20Region%20Z%C3%BCrich&eventType=COURSE&nameContains=GLK&kursartFilter=J%2BS-Leiter*innenkurs%20LS/T%20Jugendliche'});
    req.flush(events);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
