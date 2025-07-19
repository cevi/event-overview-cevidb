import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventDateTimeFormatter'
})
export class EventDateTimeFormatterPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: any): string {
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
