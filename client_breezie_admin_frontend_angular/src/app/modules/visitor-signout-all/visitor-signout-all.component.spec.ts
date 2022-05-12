import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSignoutAllComponent } from './visitor-signout-all.component';

describe('VisitorSignoutAllComponent', () => {
  let component: VisitorSignoutAllComponent;
  let fixture: ComponentFixture<VisitorSignoutAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorSignoutAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSignoutAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
