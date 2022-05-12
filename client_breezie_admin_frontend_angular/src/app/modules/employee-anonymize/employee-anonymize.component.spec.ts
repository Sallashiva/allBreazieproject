import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAnonymizeComponent } from './employee-anonymize.component';

describe('EmployeeAnonymizeComponent', () => {
  let component: EmployeeAnonymizeComponent;
  let fixture: ComponentFixture<EmployeeAnonymizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAnonymizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAnonymizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
