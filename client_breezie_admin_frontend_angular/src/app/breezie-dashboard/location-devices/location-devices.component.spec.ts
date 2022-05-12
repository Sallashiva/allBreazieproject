import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDevicesComponent } from './location-devices.component';

describe('LocationDevicesComponent', () => {
  let component: LocationDevicesComponent;
  let fixture: ComponentFixture<LocationDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
