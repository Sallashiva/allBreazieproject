import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryModelTrialComponent } from './delivery-model-trial.component';

describe('DeliveryModelTrialComponent', () => {
  let component: DeliveryModelTrialComponent;
  let fixture: ComponentFixture<DeliveryModelTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryModelTrialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryModelTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
