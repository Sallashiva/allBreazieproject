import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorApprovalModuleComponent } from './visitor-approval-module.component';

describe('VisitorApprovalModuleComponent', () => {
  let component: VisitorApprovalModuleComponent;
  let fixture: ComponentFixture<VisitorApprovalModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorApprovalModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorApprovalModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
