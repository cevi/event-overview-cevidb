import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventDateTimeFormatterPipe } from './event-date-time-formatter.pipe';

describe('EventDateTimeFormatterPipe', () => {
  let pipe: EventDateTimeFormatterPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventDateTimeFormatterPipe,
        { provide: LOCALE_ID, useValue: 'de-DE' },
      ],
    });

    pipe = TestBed.inject(EventDateTimeFormatterPipe);
  });

  it('should format a date with time correctly', () => {
    const dateWithTime = new Date('2025-07-19T15:30:00');
    const formattedDate = pipe.transform(dateWithTime);

    expect(formattedDate).toBe('19.07.2025, 15:30');
  });

  it('should format a date without time correctly for midnight', () => {
    const dateAtMidnight = new Date('2025-07-19T00:00:00');
    const formattedDate = pipe.transform(dateAtMidnight);

    expect(formattedDate).toBe('19.07.2025');
  });
});
