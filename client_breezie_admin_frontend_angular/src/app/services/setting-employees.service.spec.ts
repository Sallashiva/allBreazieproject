import { TestBed } from '@angular/core/testing';

import { SettingEmployeesService } from './setting-employees.service';

describe('SettingEmployeesService', () => {
  let service: SettingEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
