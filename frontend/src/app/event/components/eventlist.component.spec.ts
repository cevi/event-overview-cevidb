import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './eventlist.component';
import {
  CeviEvent,
  CeviEventFilter,
  EventService,
} from '../services/event.service';
import { Masterdata, MasterdataService } from '../services/masterdata.service';
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KURSART_PRESETS } from '../models/kursart-preset';
import { FilterModalComponent } from './filter-modal.component';

describe('EventlistComponent', () => {
  let fixture: ComponentFixture<EventListComponent>;
  let sut: EventListComponent;
  let eventService: EventService;
  let router: Router;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

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
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({} as unknown as MatDialogRef<unknown>);

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
        { provide: MatDialog, useValue: dialogSpy },
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
    expect(sut.filter.nameContains).toEqual('abc');
    expect(sut.filter.kursarten).toEqual(['def']);
    expect(sut.filter.hasAvailablePlaces).toBeTrue();
    expect(sut.filter.isApplicationOpen).toBeTrue();
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

  it('activeModalFilterCount returns 0 when no filter is set', () => {
    sut.filter = {} as CeviEventFilter;
    expect(sut.activeModalFilterCount).toBe(0);
  });

  it('activeModalFilterCount counts all active filters', () => {
    sut.filter = {
      groups: ['Cevi'],
      eventType: 'COURSE',
      nameContains: 'GLK',
      kursarten: ['J+S'],
      hasAvailablePlaces: true,
      isApplicationOpen: false,
    } as CeviEventFilter;
    expect(sut.activeModalFilterCount).toBe(6);
  });

  it('activeModalFilterCount counts partial filters correctly', () => {
    sut.filter = {
      eventType: 'COURSE',
      hasAvailablePlaces: false,
    } as CeviEventFilter;
    expect(sut.activeModalFilterCount).toBe(2);
  });

  it('resetFilter clears all filters', () => {
    spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
    sut.ngOnInit();
    sut.activePreset = KURSART_PRESETS[0];
    sut.resetFilter();
    expect(sut.filter).toEqual({} as CeviEventFilter);
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

  describe('openFilterModal', () => {
    it('opens dialog with FilterModalComponent', () => {
      sut.ngOnInit();
      sut.openFilterModal();
      expect(dialogSpy.open).toHaveBeenCalledWith(
        FilterModalComponent,
        jasmine.objectContaining({ width: '520px' })
      );
    });

    it('passes current filter state to dialog', () => {
      sut.filter = { eventType: 'COURSE' } as CeviEventFilter;
      sut.openFilterModal();
      const data = dialogSpy.open.calls.mostRecent().args[1]?.data as {
        filter: CeviEventFilter;
      };
      expect(data.filter).toEqual(
        jasmine.objectContaining({ eventType: 'COURSE' })
      );
    });

    it('onFilterChange updates filter and reloads events', () => {
      const fnc = spyOn(eventService, 'getEventsWithFilter').and.returnValue(
        of(events)
      );
      let capturedOnFilterChange: ((f: CeviEventFilter) => void) | undefined;
      dialogSpy.open.and.callFake(
        (
          _comp: unknown,
          config: { data?: { onFilterChange?: (f: CeviEventFilter) => void } }
        ) => {
          capturedOnFilterChange = config?.data?.onFilterChange;
          return {} as unknown as MatDialogRef<unknown>;
        }
      );

      sut.openFilterModal();
      const newFilter = { eventType: 'COURSE' } as CeviEventFilter;
      capturedOnFilterChange?.(newFilter);

      expect(sut.filter).toBe(newFilter);
      expect(fnc).toHaveBeenCalledWith(newFilter);
    });

    it('onFilterChange clears activePreset when kursarten reference changes', () => {
      spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
      sut.activePreset = KURSART_PRESETS[0];
      sut.filter = { kursarten: ['J+S'] } as CeviEventFilter;

      let capturedOnFilterChange: ((f: CeviEventFilter) => void) | undefined;
      dialogSpy.open.and.callFake(
        (
          _comp: unknown,
          config: { data?: { onFilterChange?: (f: CeviEventFilter) => void } }
        ) => {
          capturedOnFilterChange = config?.data?.onFilterChange;
          return {} as unknown as MatDialogRef<unknown>;
        }
      );

      sut.openFilterModal();
      capturedOnFilterChange?.({ kursarten: ['GLK'] } as CeviEventFilter);

      expect(sut.activePreset).toBeNull();
    });

    it('onFilterChange preserves activePreset when kursarten reference is unchanged', () => {
      spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
      const kursarten = ['J+S'];
      sut.activePreset = KURSART_PRESETS[0];
      sut.filter = { kursarten } as CeviEventFilter;

      let capturedOnFilterChange: ((f: CeviEventFilter) => void) | undefined;
      dialogSpy.open.and.callFake(
        (
          _comp: unknown,
          config: { data?: { onFilterChange?: (f: CeviEventFilter) => void } }
        ) => {
          capturedOnFilterChange = config?.data?.onFilterChange;
          return {} as unknown as MatDialogRef<unknown>;
        }
      );

      sut.openFilterModal();
      // Same kursarten reference (modal only changed organisation, not kursarten)
      capturedOnFilterChange?.({
        kursarten,
        eventType: 'COURSE',
      } as CeviEventFilter);

      expect(sut.activePreset).toBe(KURSART_PRESETS[0]);
    });

    it('onFilterChange updates url params', () => {
      spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
      let capturedOnFilterChange: ((f: CeviEventFilter) => void) | undefined;
      dialogSpy.open.and.callFake(
        (
          _comp: unknown,
          config: { data?: { onFilterChange?: (f: CeviEventFilter) => void } }
        ) => {
          capturedOnFilterChange = config?.data?.onFilterChange;
          return {} as unknown as MatDialogRef<unknown>;
        }
      );

      sut.openFilterModal();
      capturedOnFilterChange?.({ eventType: 'COURSE' } as CeviEventFilter);

      expect(router.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: jasmine.objectContaining({ type: 'COURSE' }),
          replaceUrl: true,
        })
      );
    });
  });

  describe('URL parameter synchronization via applyPreset', () => {
    const expectNavigate = (queryParams: Record<string, unknown>) =>
      expect(router.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: jasmine.objectContaining(queryParams),
          replaceUrl: true,
        })
      );

    it('applyPreset updates url', () => {
      spyOn(eventService, 'getEventsWithFilter').and.returnValue(of(events));
      const preset = KURSART_PRESETS[0];
      sut.applyPreset(preset);
      expectNavigate({ kursart: preset.kursarten });
    });
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
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['open']),
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
