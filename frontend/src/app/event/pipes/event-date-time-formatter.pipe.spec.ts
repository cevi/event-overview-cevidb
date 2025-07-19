import { EventDateTimeFormatterPipe } from './event-date-time-formatter.pipe';

describe('EventDateTimeFormatterPipe', () => {

  let pipe: EventDateTimeFormatterPipe;

  beforeEach(() => {
    pipe = new EventDateTimeFormatterPipe('de-CH');
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
