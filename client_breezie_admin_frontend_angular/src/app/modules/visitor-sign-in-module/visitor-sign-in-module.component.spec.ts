import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSignInModuleComponent } from './visitor-sign-in-module.component';

describe('VisitorSignInModuleComponent', () => {
  let component: VisitorSignInModuleComponent;
  let fixture: ComponentFixture<VisitorSignInModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorSignInModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSignInModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
