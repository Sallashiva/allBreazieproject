import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsEmployeeCheckinComponent } from './products-employee-checkin.component';

describe('ProductsEmployeeCheckinComponent', () => {
  let component: ProductsEmployeeCheckinComponent;
  let fixture: ComponentFixture<ProductsEmployeeCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsEmployeeCheckinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsEmployeeCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
