import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SelectCheckAllComponent } from '../../core/components/select-check-all.component';
import { parseIsoDate } from '../../util/date.util';
import { EventDateTimeFormatterPipe } from '../pipes/event-date-time-formatter.pipe';
import {
  CeviEvent,
  CeviEventFilter,
  EventService,
} from '../services/event.service';
import {
  CeviEventType,
  Masterdata,
  MasterdataService,
} from '../services/masterdata.service';
import {
  ALL_NAMED_PRESET_KURSARTEN,
  KursartPreset,
  KURSART_PRESETS,
} from '../models/kursart-preset';

@Component({
  selector: 'app-event-list',
  imports: [
    SelectCheckAllComponent,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    EventDateTimeFormatterPipe,
  ],
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss'],
})
export class EventListComponent implements OnInit {
  private readonly service = inject(EventService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly masterdataService = inject(MasterdataService);

  readonly KURSART_PRESETS = KURSART_PRESETS;

  data = new MatTableDataSource([] as CeviEvent[]);
  organisations = [] as string[];
  kursarten = [] as string[];
  types = [] as string[];
  isLoading = true;
  isError = false;
  isLoadingMasterdata = true;
  isErrorMasterdata = false;
  filter = {} as CeviEventFilter;
  activePreset: KursartPreset | 'weitere' | null = null;

  displayedColumns: string[] = [
    'group',
    'name',
    'startsAt',
    'finishAt',
    'freeSeats',
    'applicationOpen',
    'link',
  ];
  public nameFilter!: FormControl;
  public organisationFilter!: FormControl;

  private sort!: MatSort;
  private paginator!: MatPaginator;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.data.sort = this.sort;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.data.paginator = this.paginator;
  }

  constructor() {
    this.nameFilter = new FormControl('');
    this.organisationFilter = new FormControl(this.organisations);
    this.organisationFilter.valueChanges.subscribe(value => {
      this.filter.groups = value;
      this.loadEventsWithFilter();
      this.updateUrlParams();
    });

    this.nameFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.filter.nameContains = value;
        this.loadEventsWithFilter();
        this.updateUrlParams();
      });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('organisation')) {
        this.organisationFilter.setValue(params.getAll('organisation'));
      }
      if (params.has('type')) {
        this.filter.eventType = params.get('type') as CeviEventType;
      }
      if (params.has('text')) {
        this.nameFilter.setValue(params.get('text'));
      }
      if (params.has('kursart')) {
        this.filter.kursarten = params.getAll('kursart');
      }
      if (params.has('freeSeats')) {
        this.filter.hasAvailablePlaces = params.get('freeSeats') === 'true';
      }
      if (params.has('applicationOpen')) {
        this.filter.isApplicationOpen =
          params.get('applicationOpen') === 'true';
      }
    });

    this.loadEventsWithFilter();

    this.masterdataService.getMasterdata().subscribe({
      next: (data: Masterdata) => {
        this.organisations = data.organisations.map(o => o.name);
        this.types = data.eventTypes;
        this.kursarten = data.kursarten.map(k => k.name);
        this.isLoadingMasterdata = false;
      },
      error: () => {
        this.isLoadingMasterdata = false;
        this.isErrorMasterdata = true;
      },
    });
  }

  translateEventTypes(eventType: string): string {
    if (eventType === 'COURSE') {
      return $localize`:@@eventType.course:Kurs`;
    } else if (eventType === 'EVENT') {
      return $localize`:@@eventType.event:Anlass`;
    } else {
      return eventType;
    }
  }

  filterByEventType($event: MatSelectChange) {
    this.filter.eventType = $event.value;
    this.loadEventsWithFilter();
    this.updateUrlParams();
  }

  applyPreset(preset: KursartPreset | 'weitere') {
    this.activePreset = preset;
    this.filter.kursarten =
      preset === 'weitere'
        ? this.kursarten.filter(k => !ALL_NAMED_PRESET_KURSARTEN.includes(k))
        : preset.kursarten;
    this.loadEventsWithFilter();
    this.updateUrlParams();
  }

  filterByKursart($event: MatSelectChange) {
    this.activePreset = null;
    this.filter.kursarten = $event.value?.length ? $event.value : null;
    this.loadEventsWithFilter();
    this.updateUrlParams();
  }

  filterByAvailablePlaces($event: MatSelectChange) {
    this.filter.hasAvailablePlaces = $event.value;
    this.loadEventsWithFilter();
    this.updateUrlParams();
  }

  filterByIsApplicationOpen($event: MatSelectChange) {
    this.filter.isApplicationOpen = $event.value;
    this.loadEventsWithFilter();
    this.updateUrlParams();
  }

  private updateUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        organisation: this.filter.groups?.length ? this.filter.groups : null,
        type: this.filter.eventType ?? null,
        text: this.filter.nameContains?.trim().length
          ? this.filter.nameContains
          : null,
        kursart: this.filter.kursarten?.length ? this.filter.kursarten : null,
        freeSeats:
          this.filter.hasAvailablePlaces == null
            ? null
            : String(this.filter.hasAvailablePlaces),
        applicationOpen:
          this.filter.isApplicationOpen == null
            ? null
            : String(this.filter.isApplicationOpen),
      },
      replaceUrl: true,
    });
  }

  loadEventsWithFilter() {
    this.service.getEventsWithFilter(this.filter).subscribe({
      next: (data: CeviEvent[]) => {
        this.data.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      },
    });
  }

  hasFreeSeats(element: CeviEvent) {
    return element.maximumParticipants === null ||
      element.maximumParticipants > element.participantsCount
      ? $localize`:@@common.yes:Ja`
      : $localize`:@@common.no:Nein`;
  }

  isApplicationOpen(element: CeviEvent) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (element.applicationClosingAt === null ||
      parseIsoDate(element.applicationClosingAt) >= today) &&
      (element.applicationOpeningAt === null ||
        parseIsoDate(element.applicationOpeningAt) <= today)
      ? $localize`:@@common.yes:Ja`
      : $localize`:@@common.no:Nein`;
  }
}
