import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterModalComponent } from './filter-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipListboxChange } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { CeviEventFilter } from '../services/event.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('FilterModalComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers({ advanceTimeDelta: 1, shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let fixture: ComponentFixture<FilterModalComponent>;
  let sut: FilterModalComponent;
  let onFilterChange: Mock;

  const initialFilter: CeviEventFilter = {
    groups: ['Cevi'],
    eventType: null,
    nameContains: 'test',
    kursarten: null,
    hasAvailablePlaces: null,
    isApplicationOpen: null,
    earliestStartAt: null,
    latestStartAt: null,
  };

  beforeEach(async () => {
    onFilterChange = vi.fn().mockName('onFilterChange');

    await TestBed.configureTestingModule({
      imports: [FilterModalComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            filter: initialFilter,
            organisations: ['Cevi', 'CVJM'],
            kursarten: ['Kurs A', 'Kurs B'],
            types: ['COURSE', 'EVENT'],
            onFilterChange,
          },
        },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModalComponent);
    sut = fixture.componentInstance;
  });

  it('initializes localFilter from data.filter', () => {
    expect(sut.localFilter.groups).toEqual(['Cevi']);
    expect(sut.localFilter.nameContains).toEqual('test');
  });

  it('initializes nameFilter with filter.nameContains', () => {
    expect(sut.nameFilter.getRawValue()).toEqual('test');
  });

  it('initializes organisationFilter with filter.groups', () => {
    expect(sut.organisationFilter.getRawValue()).toEqual(['Cevi']);
  });

  it('does not call onFilterChange during initialization', () => {
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('setEventType calls onFilterChange with correct eventType', () => {
    sut.setEventType({ value: 'COURSE' } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'COURSE' })
    );
  });

  it('setEventType with undefined sets eventType to null', () => {
    sut.setEventType({ value: undefined } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: null })
    );
  });

  it('setHasAvailablePlaces calls onFilterChange with true', () => {
    sut.setHasAvailablePlaces({ value: true } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ hasAvailablePlaces: true })
    );
  });

  it('setHasAvailablePlaces calls onFilterChange with false', () => {
    sut.setHasAvailablePlaces({ value: false } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ hasAvailablePlaces: false })
    );
  });

  it('setHasAvailablePlaces with undefined sets to null', () => {
    sut.setHasAvailablePlaces({ value: undefined } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ hasAvailablePlaces: null })
    );
  });

  it('setIsApplicationOpen calls onFilterChange with false', () => {
    sut.setIsApplicationOpen({ value: false } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ isApplicationOpen: false })
    );
  });

  it('setIsApplicationOpen with undefined sets to null', () => {
    sut.setIsApplicationOpen({ value: undefined } as MatChipListboxChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ isApplicationOpen: null })
    );
  });

  it('setKursarten calls onFilterChange with kursarten', () => {
    sut.setKursarten({ value: ['Kurs A'] } as MatSelectChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ kursarten: ['Kurs A'] })
    );
  });

  it('setKursarten with empty array sets kursarten to null', () => {
    sut.setKursarten({ value: [] } as MatSelectChange);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ kursarten: null })
    );
  });

  it('organisationFilter change calls onFilterChange immediately', () => {
    sut.organisationFilter.setValue(['CVJM']);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ groups: ['CVJM'] })
    );
  });

  it('nameFilter change calls onFilterChange after debounce', async () => {
    sut.nameFilter.setValue('search');
    await vi.advanceTimersByTimeAsync(400);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ nameContains: 'search' })
    );
  });

  it('nameFilter empty string sets nameContains to null', async () => {
    sut.nameFilter.setValue('');
    await vi.advanceTimersByTimeAsync(400);
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ nameContains: null })
    );
  });

  it('translateEventType returns Kurs for COURSE', () => {
    expect(sut.translateEventType('COURSE')).toEqual('Kurs');
  });

  it('translateEventType returns Anlass for EVENT', () => {
    expect(sut.translateEventType('EVENT')).toEqual('Anlass');
  });

  it('translateEventType returns raw value for unknown type', () => {
    expect(sut.translateEventType('UNKNOWN')).toEqual('UNKNOWN');
  });
});
