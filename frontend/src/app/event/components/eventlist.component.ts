import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CeviEvent, EventService } from '../services/event.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Masterdata, MasterdataService } from '../services/masterdata.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.scss'],
})
export class EventListComponent {
  title = 'eventoverview';
  events = new MatTableDataSource([] as CeviEvent[]);
  organisations = [] as string[];
  kursarten = [] as string[];
  types = [] as string[];
  isLoading = true;
  isError = false;
  isLoadingMasterdata = true;
  isErrorMasterdata = false;
  organisation = 'all';
  eventType = 'all';
  kursart = 'all';

  displayedColumns: string[] = ['group', 'name', 'startsAt', 'finishAt', 'freeSeats', 'link'];
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

  constructor(private service: EventService, private masterdataService: MasterdataService) {
    this.nameFilter = new FormControl('');
    this.nameFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(query => {
        this.loadEventsWithFilter();
      });

    this.loadEventsWithFilter();

    masterdataService.getMasterdata().subscribe({
      next: (data: Masterdata) => {
        this.organisations = data.organisations.map(o => o.name);
        this.types = data.eventTypes;
        this.kursarten = data.kursarten.map(k => k.name);
        this.isLoadingMasterdata = false
      },
      error: (e: any) => {
        this.isLoadingMasterdata = false;
        this.isErrorMasterdata = true;
      }
    });
  }

  translateEventTypes(eventType: string): string {
    if (eventType === 'COURSE') {
      return 'Kurs';
    } else if (eventType === 'EVENT') {
      return 'Anlass'
    } else {
      return eventType;
    }
  }

  filterByOrganisation($event: MatSelectChange) {
    this.organisation = $event.value;
    this.loadEventsWithFilter();
  }

  filterByEventType($event: MatSelectChange) {
    this.eventType = $event.value;
    this.loadEventsWithFilter();
  }

  filterByKursart($event: MatSelectChange) {
    this.kursart = $event.value;
    this.loadEventsWithFilter();
  }

  loadEventsWithFilter() {
    this.service.getEventsWithFilter(this.organisation, this.eventType, this.nameFilter.value, this.kursart).subscribe({
      next: (data: CeviEvent[]) => {
        this.events.data = data;
        this.isLoading = false},
      error: (e: any) => {
        this.isLoading = false;
        this.isError = true;
      }
    });
  }
}
