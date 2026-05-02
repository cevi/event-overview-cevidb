import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
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
  Router,
} from '@angular/router';
import { KURSART_PRESETS } from '../models/kursart-preset';

describe('EventlistComponent', () => {
  let fixture: ComponentFixture<EventListComponent>;
  let sut: EventListComponent;
  let eventService: EventService;
  let router: Router;

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
      state: 'application_open',
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
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
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
    sut.filterByKursart({ value: ['J+S', 'GLK'] } as MatSelectChange);
    expect(fnc).toHaveBeenCalledWith({
      kursarten: ['J+S', 'GLK'],
    } as CeviEventFilter);
  });
  it('filterByKursart with empty selection sets kursarten to null', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.filterByKursart({ value: [] } as MatSelectChange);
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
    expect(fnc).toHaveBeenCalledWith({
      kursarten: preset.kursarten,
    } as CeviEventFilter);
  });
  it('applyPreset hides only the clicked chip', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.applyPreset(KURSART_PRESETS[0]);
    expect(sut.activePreset).toBe(KURSART_PRESETS[0]);
    expect(sut.activePreset).not.toBe(KURSART_PRESETS[1]);
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
    sut.kursarten = [
      'Cevi Alpin: Skihochtour',
      'J+S-Leiter*innenkurs LS/T Jugendliche',
    ];
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
  it('hasActiveFilter returns false when no filter is set', () => {
    sut.filter = {} as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeFalse();
  });
  it('hasActiveFilter returns true when eventType is set', () => {
    sut.filter = { eventType: 'COURSE' } as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeTrue();
  });
  it('hasActiveFilter returns true when groups are set', () => {
    sut.filter = { groups: ['Cevi Alpin'] } as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeTrue();
  });
  it('hasActiveFilter returns true when nameContains is set', () => {
    sut.filter = { nameContains: 'GLK' } as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeTrue();
  });
  it('hasActiveFilter returns true when kursarten are set', () => {
    sut.filter = { kursarten: ['J+S'] } as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeTrue();
  });
  it('hasActiveFilter returns true when hasAvailablePlaces is set', () => {
    sut.filter = { hasAvailablePlaces: true } as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeTrue();
  });
  it('hasActiveFilter returns true when isApplicationOpen is set', () => {
    sut.filter = { isApplicationOpen: false } as CeviEventFilter;
    expect(sut.hasActiveFilter).toBeTrue();
  });
  it('resetFilter clears all filters', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.ngOnInit();
    sut.activePreset = KURSART_PRESETS[0];
    sut.resetFilter();
    expect(sut.filter).toEqual({} as CeviEventFilter);
    expect(sut.nameFilter.getRawValue()).toEqual('');
    expect(sut.organisationFilter.getRawValue()).toEqual([]);
    expect(sut.activePreset).toBeNull();
  });
  it('resetFilter reloads events', () => {
    const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
      of(events)
    );
    sut.resetFilter();
    expect(fnc).toHaveBeenCalledWith({} as CeviEventFilter);
  });
  it('resetFilter clears all url params', () => {
    sut.resetFilter();
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({
          organisation: null,
          type: null,
          text: null,
          kursart: null,
          freeSeats: null,
          applicationOpen: null,
        }),
        replaceUrl: true,
      })
    );
  });
  it('hasFreeSeats', () => {
    expect(sut.hasFreeSeats(events[0])).toBe('Ja');
  });
  it('isApplicationOpen for course with state application_open', () => {
    expect(sut.isApplicationOpen(events[0])).toBe('Ja');
  });
  it('isApplicationOpen for course with state application_closed', () => {
    const closedCourse = { ...events[0], state: 'application_closed' };
    expect(sut.isApplicationOpen(closedCourse)).toBe('Nein');
  });
  it('isApplicationOpen for event uses date logic', () => {
    const openEvent: CeviEvent = {
      ...events[0],
      eventType: 'EVENT',
      state: null,
      applicationOpeningAt: null,
      applicationClosingAt: null,
    };
    expect(sut.isApplicationOpen(openEvent)).toBe('Ja');
  });

  describe('URL parameter synchronization', () => {
    const expectNavigate = (queryParams: Record<string, unknown>) =>
      expect(router.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: jasmine.objectContaining(queryParams),
          replaceUrl: true,
        })
      );

    it('filterByEventType updates url', () => {
      sut.filterByEventType({ value: 'COURSE' } as MatSelectChange);
      expectNavigate({ type: 'COURSE' });
    });
    it('filterByEventType clears url param when null', () => {
      sut.filterByEventType({ value: null } as MatSelectChange);
      expectNavigate({ type: null });
    });
    it('filterByKursart updates url', () => {
      sut.filterByKursart({ value: ['GLK', 'J+S'] } as MatSelectChange);
      expectNavigate({ kursart: ['GLK', 'J+S'] });
    });
    it('filterByKursart clears url param on empty selection', () => {
      sut.filterByKursart({ value: [] } as MatSelectChange);
      expectNavigate({ kursart: null });
    });
    it('filterByAvailablePlaces updates url with true', () => {
      sut.filterByAvailablePlaces({ value: true } as MatSelectChange);
      expectNavigate({ freeSeats: 'true' });
    });
    it('filterByAvailablePlaces updates url with false', () => {
      sut.filterByAvailablePlaces({ value: false } as MatSelectChange);
      expectNavigate({ freeSeats: 'false' });
    });
    it('filterByAvailablePlaces clears url param when null', () => {
      sut.filterByAvailablePlaces({ value: null } as MatSelectChange);
      expectNavigate({ freeSeats: null });
    });
    it('filterByIsApplicationOpen updates url with false', () => {
      sut.filterByIsApplicationOpen({ value: false } as MatSelectChange);
      expectNavigate({ applicationOpen: 'false' });
    });
    it('filterByIsApplicationOpen clears url param when null', () => {
      sut.filterByIsApplicationOpen({ value: null } as MatSelectChange);
      expectNavigate({ applicationOpen: null });
    });
    it('applyPreset updates url', () => {
      const preset = KURSART_PRESETS[0];
      sut.applyPreset(preset);
      expectNavigate({ kursart: preset.kursarten });
    });
    it('organisationFilter change updates url', () => {
      sut.organisationFilter.setValue(['Cevi Alpin']);
      expectNavigate({ organisation: ['Cevi Alpin'] });
    });
    it('organisationFilter empty selection clears url param', () => {
      sut.organisationFilter.setValue([]);
      expectNavigate({ organisation: null });
    });
    it('nameFilter change updates url', fakeAsync(() => {
      sut.nameFilter.setValue('GLK');
      tick(400);
      expectNavigate({ text: 'GLK' });
    }));
    it('nameFilter empty string clears url param', fakeAsync(() => {
      sut.nameFilter.setValue('');
      tick(400);
      expectNavigate({ text: null });
    }));
  });
});

describe('EventlistComponent – multiple kursart query parameters', () => {
  const masterdata: Masterdata = {
    organisations: [],
    eventTypes: [],
    kursarten: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [
        {
          provide: EventService,
          useValue: { getEventsWithFilter: () => of([]) },
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
            queryParamMap: of(convertToParamMap({ kursart: ['GLK', 'J+S'] })),
          },
        },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('reads multiple kursart values from URL', () => {
    const fixture = TestBed.createComponent(EventListComponent);
    const sut = fixture.componentInstance;
    sut.ngOnInit();
    expect(sut.filter.kursarten).toEqual(['GLK', 'J+S']);
  });
});
