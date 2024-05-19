import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProductsPageComponent } from './my-products-page.component';

describe('MyProductsPageComponent', () => {
  let component: MyProductsPageComponent;
  let fixture: ComponentFixture<MyProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyProductsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
