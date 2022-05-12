import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeModuleComponent } from './add-employee-module.component';

describe('AddEmployeeModuleComponent', () => {
  let component: AddEmployeeModuleComponent;
  let fixture: ComponentFixture<AddEmployeeModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
