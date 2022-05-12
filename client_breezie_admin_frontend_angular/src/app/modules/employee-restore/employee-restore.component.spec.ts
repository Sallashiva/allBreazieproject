import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRestoreComponent } from './employee-restore.component';

describe('EmployeeRestoreComponent', () => {
  let component: EmployeeRestoreComponent;
  let fixture: ComponentFixture<EmployeeRestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeRestoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
