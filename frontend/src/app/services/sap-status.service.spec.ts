import { TestBed } from '@angular/core/testing';

import { SapStatusService } from './sap-status.service';

describe('SapStatusService', () => {
  let service: SapStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SapStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
