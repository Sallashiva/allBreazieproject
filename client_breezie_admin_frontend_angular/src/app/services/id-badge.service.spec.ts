import { TestBed } from '@angular/core/testing';

import { IdBadgeService } from './id-badge.service';

describe('IdBadgeService', () => {
  let service: IdBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
