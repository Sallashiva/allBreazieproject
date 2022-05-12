import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFoodCateringComponent } from './update-food-catering.component';

describe('UpdateFoodCateringComponent', () => {
  let component: UpdateFoodCateringComponent;
  let fixture: ComponentFixture<UpdateFoodCateringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFoodCateringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFoodCateringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
