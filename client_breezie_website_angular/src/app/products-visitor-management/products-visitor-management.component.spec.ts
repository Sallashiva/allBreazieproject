import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsVisitorManagementComponent } from './products-visitor-management.component';

describe('ProductsVisitorManagementComponent', () => {
  let component: ProductsVisitorManagementComponent;
  let fixture: ComponentFixture<ProductsVisitorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsVisitorManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsVisitorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
