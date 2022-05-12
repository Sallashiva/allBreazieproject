import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorAnonymizeModuleComponent } from './visitor-anonymize-module.component';

describe('VisitorAnonymizeModuleComponent', () => {
  let component: VisitorAnonymizeModuleComponent;
  let fixture: ComponentFixture<VisitorAnonymizeModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorAnonymizeModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorAnonymizeModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
