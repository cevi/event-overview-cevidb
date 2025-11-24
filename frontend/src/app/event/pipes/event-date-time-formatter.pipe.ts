import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'eventDateTimeFormatter',
})
export class EventDateTimeFormatterPipe implements PipeTransform {
  private locale = inject(LOCALE_ID);

  transform(value: string | number | Date | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const hour = date.getHours();

    if (hour === 0) {
      return date.toLocaleDateString(this.locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }); // Nur das Datum für Mitternacht
    } else {
      // Format ohne Sekunden
      return date.toLocaleString(this.locale, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  }
}
