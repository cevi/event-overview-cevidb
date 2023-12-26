import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CeviEvent, EventService } from './event/event.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Masterdata, MasterdataService } from './event/masterdata.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eventoverview';
  events = new MatTableDataSource([] as CeviEvent[]);
  organisations = [] as string[];
  types = [] as string[];
  isLoading = true;
  isError = false;
  isLoadingMasterdata = true;
  isErrorMasterdata = false;
  organisation = 'all';
  eventType = 'all';

  displayedColumns: string[] = ['group', 'name', 'startsAt', 'finishAt', 'link'];
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

  loadEventsWithFilter() {
    this.service.getEventsWithFilter(this.organisation, this.eventType, this.nameFilter.value).subscribe({
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
