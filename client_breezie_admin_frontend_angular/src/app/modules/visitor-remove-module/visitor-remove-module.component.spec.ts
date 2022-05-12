import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorRemoveModuleComponent } from './visitor-remove-module.component';

describe('VisitorRemoveModuleComponent', () => {
  let component: VisitorRemoveModuleComponent;
  let fixture: ComponentFixture<VisitorRemoveModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorRemoveModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorRemoveModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
