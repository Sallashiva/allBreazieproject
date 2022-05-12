import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkModuleComponent } from './add-bulk-module.component';

describe('AddBulkModuleComponent', () => {
  let component: AddBulkModuleComponent;
  let fixture: ComponentFixture<AddBulkModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBulkModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
