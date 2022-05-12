import { TestBed } from '@angular/core/testing';

import { ContactlessService } from './contactless.service';

describe('ContactlessService', () => {
  let service: ContactlessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactlessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
