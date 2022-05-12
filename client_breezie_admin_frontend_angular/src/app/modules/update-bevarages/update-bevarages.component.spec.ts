import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBevaragesComponent } from './update-bevarages.component';

describe('UpdateBevaragesComponent', () => {
  let component: UpdateBevaragesComponent;
  let fixture: ComponentFixture<UpdateBevaragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBevaragesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBevaragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
