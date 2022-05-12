import { TestBed } from '@angular/core/testing';

import { SettingBrandingService } from './setting-branding.service';

describe('SettingBrandingService', () => {
  let service: SettingBrandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingBrandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
