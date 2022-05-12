import { TestBed } from '@angular/core/testing';

import { SettingVisitorFieldsService } from './setting-visitor-fields.service';

describe('SettingVisitorFieldsService', () => {
  let service: SettingVisitorFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingVisitorFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
