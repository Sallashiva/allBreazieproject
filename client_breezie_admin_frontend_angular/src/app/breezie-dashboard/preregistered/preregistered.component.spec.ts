import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreregisteredComponent } from './preregistered.component';

describe('PreregisteredComponent', () => {
  let component: PreregisteredComponent;
  let fixture: ComponentFixture<PreregisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreregisteredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
