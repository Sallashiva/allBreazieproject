import { TestBed } from '@angular/core/testing';

import { RefreshmentService } from './refreshment.service';

describe('RefreshmentService', () => {
  let service: RefreshmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
