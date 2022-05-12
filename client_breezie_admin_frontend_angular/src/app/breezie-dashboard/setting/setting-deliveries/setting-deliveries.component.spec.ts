import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDeliveriesComponent } from './setting-deliveries.component';

describe('SettingDeliveriesComponent', () => {
  let component: SettingDeliveriesComponent;
  let fixture: ComponentFixture<SettingDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingDeliveriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
