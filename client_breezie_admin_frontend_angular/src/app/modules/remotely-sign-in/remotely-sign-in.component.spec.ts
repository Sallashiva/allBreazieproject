import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemotelySignInComponent } from './remotely-sign-in.component';

describe('RemotelySignInComponent', () => {
  let component: RemotelySignInComponent;
  let fixture: ComponentFixture<RemotelySignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemotelySignInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemotelySignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
