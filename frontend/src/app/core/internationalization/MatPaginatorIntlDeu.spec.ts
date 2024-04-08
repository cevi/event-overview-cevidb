import { TestBed } from '@angular/core/testing';
import { MatPaginatorIntlDeu } from './MatPaginatorIntlDeu';
import { MatPaginatorIntl } from '@angular/material/paginator';

describe('MatPaginatorIntlDeu', () => {
  let sut: MatPaginatorIntlDeu;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlDeu }],
    });

    sut = TestBed.inject(MatPaginatorIntl);
  });
  describe('getRangeLabel', () => {
    it('zero', () => {
      expect(sut.getRangeLabel(0, 10, 0)).toEqual('0 von 0');
    });
    it('first page', () => {
      expect(sut.getRangeLabel(0, 10, 10)).toEqual('1 - 10 von 10');
    });
    it('last page', () => {
      expect(sut.getRangeLabel(9, 10, 100)).toEqual('91 - 100 von 100');
    });
  });
});
