import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorFieldsComponent } from './visitor-fields.component';

describe('VisitorFieldsComponent', () => {
  let component: VisitorFieldsComponent;
  let fixture: ComponentFixture<VisitorFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
