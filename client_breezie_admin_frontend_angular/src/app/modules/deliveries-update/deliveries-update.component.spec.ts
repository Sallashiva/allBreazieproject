import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveriesUpdateComponent } from './deliveries-update.component';

describe('DeliveriesUpdateComponent', () => {
  let component: DeliveriesUpdateComponent;
  let fixture: ComponentFixture<DeliveriesUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveriesUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
