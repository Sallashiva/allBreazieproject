import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleDialogComponent } from './admin-role-dialog.component';

describe('AdminRoleDialogComponent', () => {
  let component: AdminRoleDialogComponent;
  let fixture: ComponentFixture<AdminRoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRoleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
