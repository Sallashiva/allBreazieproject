import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayReminderComponent } from './day-reminder.component';

describe('DayReminderComponent', () => {
  let component: DayReminderComponent;
  let fixture: ComponentFixture<DayReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
