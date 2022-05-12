import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminrolesComponent } from './adminroles.component';

describe('AdminrolesComponent', () => {
  let component: AdminrolesComponent;
  let fixture: ComponentFixture<AdminrolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminrolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
