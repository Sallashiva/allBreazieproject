import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSignoutComponent } from './employee-signout.component';

describe('EmployeeSignoutComponent', () => {
  let component: EmployeeSignoutComponent;
  let fixture: ComponentFixture<EmployeeSignoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSignoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSignoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
