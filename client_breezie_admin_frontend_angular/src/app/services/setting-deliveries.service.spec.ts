import { TestBed } from '@angular/core/testing';

import { SettingDeliveriesService } from './setting-deliveries.service';

describe('SettingDeliveriesService', () => {
  let service: SettingDeliveriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingDeliveriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
