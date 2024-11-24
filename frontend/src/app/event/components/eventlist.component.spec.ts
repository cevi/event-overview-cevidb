import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './eventlist.component';
import {
  CeviEvent,
  CeviEventFilter,
  EventService,
} from '../services/event.service';
import { Masterdata, MasterdataService } from '../services/masterdata.service';
import { MatSelectChange } from '@angular/material/select';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('EventlistComponent', () => {
  let fixture: ComponentFixture<EventListComponent>;
  let sut: EventListComponent;
  let eventService: EventService;

  const events: CeviEvent[] = [
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
      applicationClosingAt: null,
      applicationOpeningAt: null,
    },
  ];

  const masterdata: Masterdata = {
    organisations: [{ name: 'Cevi Alpin' }],
    eventTypes: ['EVENT'],
    kursarten: [{ name: 'Cevi Alpin: Skihochtour' }],
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        {
          provide: EventService,
          useValue: {
            getEventsWithFilter: () => of(events),
          },
        },
        {
          provide: MasterdataService,
          useValue: { getMasterdata: () => of(masterdata) },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: EventListComponent }]),
      ],
    }).compileComponents();

    eventService = TestBed.inject(EventService);
    fixture = TestBed.createComponent(EventListComponent);
    sut = fixture.componentInstance;
  });
  it('loaded masterdata and events', () => {
    sut.ngOnInit();
    expect(sut.kursarten.length).toEqual(1);
    expect(sut.organisations.length).toEqual(1);
    expect(sut.types.length).toEqual(1);
    expect(sut.isLoading).toEqual(false);
    expect(sut.isLoadingMasterdata).toEqual(false);
    expect(sut.data.data.length).toEqual(1);
  });
  it('translateEventTypes', () => {
    let result = sut.translateEventTypes('COURSE');
    expect(result).toEqual('Kurs');

    result = sut.translateEventTypes('EVENT');
    expect(result).toEqual('Anlass');
  });
  it('filterByOrganisation', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.filterByOrganisation({ value: 'Cevi Alpin' } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({
      groups: ['Cevi Alpin'],
    } as CeviEventFilter);
  });
  it('filterByEventType', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.filterByEventType({ value: 'COURSE' } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({
      eventType: 'COURSE',
    } as CeviEventFilter);
  });
  it('filterByKursart', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.filterByKursart({ value: 'J+S' } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({ kursart: 'J+S' } as CeviEventFilter);
  });
  it('filterByAvailablePlaces', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.filterByAvailablePlaces({ value: true } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({
      hasAvailablePlaces: true,
    } as CeviEventFilter);
  });
  it('hasFreeSeats', () => {
    expect(sut.hasFreeSeats(events[0])).toBe('Ja');
  });
  it('isApplicationOpen', () => {
    expect(sut.isApplicationOpen(events[0])).toBe('Ja');
  });
});
