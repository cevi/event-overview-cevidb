import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CeviEvent, EventService } from './event.service';
import { Masterdata, MasterdataService } from './masterdata.service';

describe('MasterdataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('getMasterdata', (done: DoneFn) => {
    const service = TestBed.inject(MasterdataService);

    const masterdata = {  organisations: [{ name: 'Cevi Alpin'}],
      eventTypes: ['EVENT'],
      kursarten: [{ name: 'Cevi Alpin: Skihochtour'}]
    } as Masterdata;

    service.getMasterdata().subscribe((value) => {
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
