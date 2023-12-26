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
import { FormsModule } from '@angular/forms';
import { Masterdata, MasterdataService } from './event/masterdata.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
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
  displayedColumns: string[] = ['group', 'name', 'startsAt', 'finishAt', 'link'];

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
    this.loadEventsWithFilter('all');

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

  filterByOrganisation($event: MatSelectChange) {
    this.loadEventsWithFilter($event.value);
  }

  loadEventsWithFilter(organisation: string) {
    if (organisation === 'all') {
      this.service.getEvents().subscribe({
        next: (data: CeviEvent[]) => {
          this.events.data = data;
          this.isLoading = false},
        error: (e: any) => {
          this.isLoading = false;
          this.isError = true;
        }
      });
    } else {
      this.service.getEventsForGroup(organisation).subscribe({
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
}
