import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSignOutModuleComponent } from './visitor-sign-out-module.component';

describe('VisitorSignOutModuleComponent', () => {
  let component: VisitorSignOutModuleComponent;
  let fixture: ComponentFixture<VisitorSignOutModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorSignOutModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSignOutModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
