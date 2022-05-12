import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeUpdateDialogComponent } from './add-employee-update-dialog.component';

describe('AddEmployeeUpdateDialogComponent', () => {
  let component: AddEmployeeUpdateDialogComponent;
  let fixture: ComponentFixture<AddEmployeeUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
