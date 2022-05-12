import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveriesModelComponent } from './deliveries-model.component';

describe('DeliveriesModelComponent', () => {
  let component: DeliveriesModelComponent;
  let fixture: ComponentFixture<DeliveriesModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveriesModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveriesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
