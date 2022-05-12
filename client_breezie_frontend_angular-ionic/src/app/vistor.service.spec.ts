import { TestBed } from '@angular/core/testing';

import { VistorService } from './vistor.service';

describe('VistorService', () => {
  let service: VistorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
