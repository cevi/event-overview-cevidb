import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectCheckAllComponent } from './select-check-all.component';
import { FormControl } from '@angular/forms';

describe('SelectCheckAll', () => {
  let fixture: ComponentFixture<SelectCheckAllComponent>;
  let sut: SelectCheckAllComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [SelectCheckAllComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCheckAllComponent);
    sut = fixture.componentInstance;
    sut.model = new FormControl([]);
    sut.values = [];
    sut.text = 'Alle';
  });
  it('component loaded', () => {
    expect(sut).not.toBeNull();
  });
  it('is not checked', () => {
    expect(sut.isChecked()).toBe(false);
  });
  it('is not indeterminate', () => {
    expect(sut.isIndeterminate()).toBe(false);
  });
});
