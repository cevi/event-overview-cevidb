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
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';

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
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(
              convertToParamMap({
                organisation: 'Cevi',
                type: 'EVENT',
                text: 'abc',
                kursart: 'def',
                freeSeats: 'true',
                applicationOpen: 'true',
              })
            ),
          },
        },
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
  it('initial filter from query parameters', () => {
    sut.ngOnInit();
    expect(sut.filter.groups).toEqual(['Cevi']);
    expect(sut.filter.eventType).toEqual('EVENT');
    expect(sut.nameFilter.getRawValue()).toEqual('abc');
    expect(sut.filter.kursart).toEqual('def');
    expect(sut.filter.hasAvailablePlaces).toBeTrue();
    expect(sut.filter.isApplicationOpen).toBeTrue();
  });
  it('translateEventTypes', () => {
    let result = sut.translateEventTypes('COURSE');
    expect(result).toEqual('Kurs');

    result = sut.translateEventTypes('EVENT');
    expect(result).toEqual('Anlass');
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
  it('filterByIsApplicationOpen', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.filterByIsApplicationOpen({ value: true } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({
      isApplicationOpen: true,
    } as CeviEventFilter);
  });
  it('hasFreeSeats', () => {
    expect(sut.hasFreeSeats(events[0])).toBe('Ja');
  });
  it('isApplicationOpen', () => {
    expect(sut.isApplicationOpen(events[0])).toBe('Ja');
  });
});
