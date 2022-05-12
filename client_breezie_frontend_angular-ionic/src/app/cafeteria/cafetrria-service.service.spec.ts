import { TestBed } from '@angular/core/testing';

import { CafetrriaServiceService } from './cafetrria-service.service';

describe('CafetrriaServiceService', () => {
  let service: CafetrriaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CafetrriaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
