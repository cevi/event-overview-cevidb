import { Component, Input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';

// adapted from https://onthecode.co.uk/blog/select-all-option-mat-select
// needs a style in the global stylesheet. search for .app-select-check-all
@Component({
  selector: 'app-select-check-all',
  imports: [MatCheckboxModule],
  template: `
    <mat-checkbox
      class="app-select-check-all"
      [indeterminate]="isIndeterminate()"
      [checked]="isChecked()"
      (click)="$event.stopPropagation()"
      (change)="toggleSelection($event)">
      {{ text }}
    </mat-checkbox>
  `,
})
export class SelectCheckAllComponent {
  @Input()
  model!: FormControl;
  @Input() values: string[] = [];
  @Input() text = 'Alle';
  readonly changeEvent = output<boolean>();

  isChecked(): boolean {
    return Boolean(
      this.model.value &&
        this.values.length &&
        this.model.value.length === this.values.length
    );
  }

  isIndeterminate(): boolean {
    return Boolean(
      this.model.value &&
        this.values.length &&
        this.model.value.length &&
        this.model.value.length < this.values.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.setValue(this.values);
    } else {
      this.model.setValue([]);
    }
    this.changeEvent.emit(change.checked);
  }
}
