import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FifteenDaysReminderComponent } from './fifteen-days-reminder.component';

describe('FifteenDaysReminderComponent', () => {
  let component: FifteenDaysReminderComponent;
  let fixture: ComponentFixture<FifteenDaysReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FifteenDaysReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FifteenDaysReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
