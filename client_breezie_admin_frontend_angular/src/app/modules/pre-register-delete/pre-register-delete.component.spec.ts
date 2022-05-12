import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegisterDeleteComponent } from './pre-register-delete.component';

describe('PreRegisterDeleteComponent', () => {
  let component: PreRegisterDeleteComponent;
  let fixture: ComponentFixture<PreRegisterDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreRegisterDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegisterDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
