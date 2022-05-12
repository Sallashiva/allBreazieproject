import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateringModelTrialComponent } from './catering-model-trial.component';

describe('CateringModelTrialComponent', () => {
  let component: CateringModelTrialComponent;
  let fixture: ComponentFixture<CateringModelTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CateringModelTrialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CateringModelTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
