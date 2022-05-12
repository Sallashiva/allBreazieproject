import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlessComponent } from './contactless.component';

describe('ContactlessComponent', () => {
  let component: ContactlessComponent;
  let fixture: ComponentFixture<ContactlessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactlessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
