import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingVisitorsComponent } from './setting-visitors.component';

describe('SettingVisitorsComponent', () => {
  let component: SettingVisitorsComponent;
  let fixture: ComponentFixture<SettingVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingVisitorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
