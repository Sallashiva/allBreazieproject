import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdBadgesComponent } from './id-badges.component';

describe('IdBadgesComponent', () => {
  let component: IdBadgesComponent;
  let fixture: ComponentFixture<IdBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdBadgesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
