import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBrandDropComponent } from './setting-brand-drop.component';

describe('SettingBrandDropComponent', () => {
  let component: SettingBrandDropComponent;
  let fixture: ComponentFixture<SettingBrandDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingBrandDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBrandDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
