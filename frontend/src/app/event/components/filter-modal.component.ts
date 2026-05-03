import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SelectCheckAllComponent } from '../../core/components/select-check-all.component';
import { CeviEventFilter } from '../services/event.service';

export interface FilterModalData {
  filter: CeviEventFilter;
  organisations: string[];
  kursarten: string[];
  types: string[];
  onFilterChange: (f: CeviEventFilter) => void;
}

@Component({
  selector: 'app-filter-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SelectCheckAllComponent,
  ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent {
  readonly data = inject<FilterModalData>(MAT_DIALOG_DATA);

  localFilter: CeviEventFilter;
  readonly nameFilter: FormControl;
  readonly organisationFilter: FormControl;

  constructor() {
    this.localFilter = { ...this.data.filter };
    this.nameFilter = new FormControl(this.data.filter.nameContains ?? '');
    this.organisationFilter = new FormControl(this.data.filter.groups ?? []);

    this.organisationFilter.valueChanges.subscribe((value: string[]) => {
      this.localFilter = { ...this.localFilter, groups: value };
      this.data.onFilterChange({ ...this.localFilter });
    });

    this.nameFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value: string) => {
        this.localFilter = {
          ...this.localFilter,
          nameContains: value?.trim() || null,
        };
        this.data.onFilterChange({ ...this.localFilter });
      });
  }

  setEventType(event: MatChipListboxChange): void {
    this.localFilter = { ...this.localFilter, eventType: event.value ?? null };
    this.data.onFilterChange({ ...this.localFilter });
  }

  setKursarten(event: MatSelectChange): void {
    this.localFilter = {
      ...this.localFilter,
      kursarten: event.value?.length ? event.value : null,
    };
    this.data.onFilterChange({ ...this.localFilter });
  }

  setHasAvailablePlaces(event: MatChipListboxChange): void {
    this.localFilter = {
      ...this.localFilter,
      hasAvailablePlaces: event.value ?? null,
    };
    this.data.onFilterChange({ ...this.localFilter });
  }

  setIsApplicationOpen(event: MatChipListboxChange): void {
    this.localFilter = {
      ...this.localFilter,
      isApplicationOpen: event.value ?? null,
    };
    this.data.onFilterChange({ ...this.localFilter });
  }

  translateEventType(type: string): string {
    if (type === 'COURSE') return $localize`:@@eventType.course:Kurs`;
    if (type === 'EVENT') return $localize`:@@eventType.event:Anlass`;
    return type;
  }
}
