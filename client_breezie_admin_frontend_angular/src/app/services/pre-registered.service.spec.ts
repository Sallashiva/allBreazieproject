import { TestBed } from '@angular/core/testing';

import { PreRegisteredService } from './pre-registered.service';

describe('PreRegisteredService', () => {
  let service: PreRegisteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreRegisteredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
