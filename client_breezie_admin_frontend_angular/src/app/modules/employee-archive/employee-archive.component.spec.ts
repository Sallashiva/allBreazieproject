import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeArchiveComponent } from './employee-archive.component';

describe('EmployeeArchiveComponent', () => {
  let component: EmployeeArchiveComponent;
  let fixture: ComponentFixture<EmployeeArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
