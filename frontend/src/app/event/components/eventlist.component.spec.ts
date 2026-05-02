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
import { KURSART_PRESETS } from '../models/kursart-preset';

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
    expect(sut.filter.kursarten).toEqual(['def']);
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
    expect(fnc).toHaveBeenCalledWith({ kursarten: ['J+S'] } as CeviEventFilter);
  });
  it('filterByKursart with null sets kursarten to null', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.filterByKursart({ value: null } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({ kursarten: null } as CeviEventFilter);
  });
  it('filterByKursart clears activePreset', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.activePreset = KURSART_PRESETS[0];
    sut.filterByKursart({ value: 'J+S' } as MatSelectChange);
    expect(sut.activePreset).toBeNull();
  });
  it('applyPreset sets kursarten and activePreset', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    const preset = KURSART_PRESETS[0];
    sut.applyPreset(preset);
    expect(sut.activePreset).toBe(preset);
    expect(fnc).toHaveBeenCalledWith({ kursarten: preset.kursarten } as CeviEventFilter);
  });
  it('applyPreset toggles off when clicking active preset', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    const preset = KURSART_PRESETS[0];
    sut.applyPreset(preset);
    sut.applyPreset(preset);
    expect(sut.activePreset).toBeNull();
    expect(sut.filter.kursarten).toBeNull();
  });
  it('applyPreset switches to a different preset', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.applyPreset(KURSART_PRESETS[0]);
    sut.applyPreset(KURSART_PRESETS[1]);
    expect(sut.activePreset).toBe(KURSART_PRESETS[1]);
    expect(sut.filter.kursarten).toEqual(KURSART_PRESETS[1].kursarten);
  });
  it('applyPreset "weitere" filters to kursarten not in named presets', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.kursarten = ['Cevi Alpin: Skihochtour', 'J+S-Leiter*innenkurs LS/T Jugendliche'];
    sut.applyPreset('weitere');
    expect(sut.activePreset).toBe('weitere');
    expect(sut.filter.kursarten).toEqual(['Cevi Alpin: Skihochtour']);
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
