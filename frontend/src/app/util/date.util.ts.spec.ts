import {
} from '@angular/common/http/testing';

import { parseIsoDate } from './date.util';

describe('DateUtil', () => {
  it('parseIsoDate', () => {
    const date = parseIsoDate('2024-04-27');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(3); // starts at 0
    expect(date.getDate()).toBe(27);
  });
});
