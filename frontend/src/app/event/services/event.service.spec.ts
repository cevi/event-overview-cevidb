import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { CeviEvent, CeviEventFilter, EventService } from './event.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('EventService', () => {
  let httpTestingController: HttpTestingController;
  let sut: EventService;

  const events = [
    {
      id: '5',
      name: 'GLK',
      startsAt: new Date(),
      finishAt: new Date(),
      group: 'Cevi Region Zürich',
      applicationLink: 'http://localhost/apply',
      eventType: 'COURSE',
      participantsCount: 10,
      maximumParticipants: 20,
    },
  ] as CeviEvent[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    sut = TestBed.inject(EventService);
  });
  it('getEventsWithFilter', (done: DoneFn) => {
    const filter = {
      group: 'Cevi Region Zürich',
      eventType: 'COURSE',
      nameContains: 'GLK',
      kursart: 'J+S-Leiter*innenkurs LS/T Jugendliche',
    } as CeviEventFilter;

    sut.getEventsWithFilter(filter).subscribe(value => {
      expect(value).toEqual(events);
      done();
    });

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: 'http://localhost:8080/events',
    });
    expect(req.request.body).toEqual(filter);
    req.flush(events);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
