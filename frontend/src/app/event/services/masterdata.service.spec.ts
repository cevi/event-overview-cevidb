import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { Masterdata, MasterdataService } from './masterdata.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('MasterdataService', () => {
  let httpTestingController: HttpTestingController;
  let sut: MasterdataService;

  const masterdata = {
    organisations: [{ name: 'Cevi Alpin' }],
    eventTypes: ['EVENT'],
    kursarten: [{ name: 'Cevi Alpin: Skihochtour' }],
  } as Masterdata;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    sut = TestBed.inject(MasterdataService);
  });
  it('getMasterdata', (done: DoneFn) => {
    sut.getMasterdata().subscribe(value => {
      expect(value).toEqual(masterdata);
      done();
    });

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: 'http://localhost:8080/masterdata',
    });
    req.flush(masterdata);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
