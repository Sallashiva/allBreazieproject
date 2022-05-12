import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTimelineUpdateComponent } from './employee-timeline-update.component';

describe('EmployeeTimelineUpdateComponent', () => {
  let component: EmployeeTimelineUpdateComponent;
  let fixture: ComponentFixture<EmployeeTimelineUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTimelineUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTimelineUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
