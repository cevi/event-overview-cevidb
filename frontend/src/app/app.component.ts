import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CeviEvent, EventService } from './event/event.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
  data = [] as CeviEvent[];
  organisations = [] as string[];
  types = [] as string[];
  isLoading = true;
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

  constructor(private service: EventService) {
    service.getEvents().subscribe(data => {
      this.events.data = data;
      this.data = data;
      this.organisations = [...new Set(data.map(o => o.group))];
      this.types = [...new Set(data.map(o => o.eventType))];
      this.isLoading = false});
   }
}
