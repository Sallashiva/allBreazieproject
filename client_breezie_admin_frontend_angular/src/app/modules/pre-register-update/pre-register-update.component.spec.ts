import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegisterUpdateComponent } from './pre-register-update.component';

describe('PreRegisterUpdateComponent', () => {
  let component: PreRegisterUpdateComponent;
  let fixture: ComponentFixture<PreRegisterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreRegisterUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegisterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
