import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirtyDaysReminderComponent } from './thirty-days-reminder.component';

describe('ThirtyDaysReminderComponent', () => {
  let component: ThirtyDaysReminderComponent;
  let fixture: ComponentFixture<ThirtyDaysReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirtyDaysReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirtyDaysReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
