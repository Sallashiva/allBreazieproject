import { TestBed } from '@angular/core/testing';

import { SettingVisitorService } from './setting-visitor.service';

describe('SettingVisitorService', () => {
  let service: SettingVisitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingVisitorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
