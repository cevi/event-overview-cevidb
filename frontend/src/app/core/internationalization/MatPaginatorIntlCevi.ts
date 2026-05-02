import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorIntlCevi extends MatPaginatorIntl {
  override itemsPerPageLabel = $localize`:@@paginator.itemsPerPage:Einträge pro Seite`;
  override nextPageLabel = $localize`:@@paginator.nextPage:Nächste Seite`;
  override previousPageLabel = $localize`:@@paginator.previousPage:Vorherige Seite`;
  override firstPageLabel = $localize`:@@paginator.firstPage:Erste Seite`;
  override lastPageLabel = $localize`:@@paginator.lastPage:Letzte Seite`;

  private readonly ofLabel = $localize`:@@paginator.of:von`;

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} ${this.ofLabel} ${length}`;
  };
}
