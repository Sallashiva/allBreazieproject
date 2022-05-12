import { TestBed } from '@angular/core/testing';

import { EvacuationService } from './evacuation.service';

describe('EvacuationService', () => {
  let service: EvacuationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvacuationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
