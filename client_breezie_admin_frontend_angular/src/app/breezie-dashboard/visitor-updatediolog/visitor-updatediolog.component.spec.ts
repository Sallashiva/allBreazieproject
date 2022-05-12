import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorUpdatediologComponent } from './visitor-updatediolog.component';

describe('VisitorUpdatediologComponent', () => {
  let component: VisitorUpdatediologComponent;
  let fixture: ComponentFixture<VisitorUpdatediologComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorUpdatediologComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorUpdatediologComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
