import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Masterdata, MasterdataService } from './masterdata.service';

describe('MasterdataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let sut: MasterdataService;

  const masterdata = {  organisations: [{ name: 'Cevi Alpin'}],
  eventTypes: ['EVENT'],
  kursarten: [{ name: 'Cevi Alpin: Skihochtour'}]
} as Masterdata;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    sut = TestBed.inject(MasterdataService);
  });
  it('getMasterdata', (done: DoneFn) => {
    sut.getMasterdata().subscribe((value) => {
      expect(value).toEqual(masterdata);
      done();
    });

    const req = httpTestingController.expectOne({ method: 'GET', url: 'http://localhost:8080/masterdata'});
    req.flush(masterdata);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
});
