import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  CeviEvent,
  CeviEventFilter,
  EventService,
} from '../services/event.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Masterdata, MasterdataService } from '../services/masterdata.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { parseIsoDate } from '../../util/date.util';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss'],
})
export class EventListComponent implements OnInit {
  title = 'eventoverview';
  events = new MatTableDataSource([] as CeviEvent[]);
  organisations = [] as string[];
  kursarten = [] as string[];
  types = [] as string[];
  isLoading = true;
  isError = false;
  isLoadingMasterdata = true;
  isErrorMasterdata = false;
  filter = {} as CeviEventFilter;

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

  private sort!: MatSort;
  private paginator!: MatPaginator;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.events.sort = this.sort;
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.events.paginator = this.paginator;
  }

  constructor(
    private service: EventService,
    private masterdataService: MasterdataService
  ) {
    this.nameFilter = new FormControl('');
    this.nameFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(value => {
        this.filter.nameContains = value;
        this.loadEventsWithFilter();
      });
  }

  ngOnInit(): void {
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
      return 'Kurs';
    } else if (eventType === 'EVENT') {
      return 'Anlass';
    } else {
      return eventType;
    }
  }

  filterByOrganisation($event: MatSelectChange) {
    this.filter.group = $event.value;
    this.loadEventsWithFilter();
  }

  filterByEventType($event: MatSelectChange) {
    this.filter.eventType = $event.value;
    this.loadEventsWithFilter();
  }

  filterByKursart($event: MatSelectChange) {
    this.filter.kursart = $event.value;
    this.loadEventsWithFilter();
  }

  filterByAvailablePlaces($event: MatSelectChange) {
    this.filter.hasAvailablePlaces = $event.value;
    this.loadEventsWithFilter();
  }

  filterByIsApplicationOpen($event: MatSelectChange) {
    this.filter.isApplicationOpen = $event.value;
    this.loadEventsWithFilter();
  }

  loadEventsWithFilter() {
    console.log(this.filter);
    this.service.getEventsWithFilter(this.filter).subscribe({
      next: (data: CeviEvent[]) => {
        this.events.data = data;
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
      ? 'Ja'
      : 'Nein';
  }

  isApplicationOpen(element: CeviEvent) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (element.applicationClosingAt === null ||
      parseIsoDate(element.applicationClosingAt) >= today) &&
      (element.applicationOpeningAt === null ||
        parseIsoDate(element.applicationOpeningAt) <= today)
      ? 'Ja'
      : 'Nein';
  }
}
