import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreezieDashboardComponent } from './breezie-dashboard.component';

describe('BreezieDashboardComponent', () => {
  let component: BreezieDashboardComponent;
  let fixture: ComponentFixture<BreezieDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreezieDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreezieDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
