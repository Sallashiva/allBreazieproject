import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingEmployeesComponent } from './setting-employees.component';

describe('SettingEmployeesComponent', () => {
  let component: SettingEmployeesComponent;
  let fixture: ComponentFixture<SettingEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
