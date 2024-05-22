import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Product } from '../../interfaces/product.interface';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent implements OnInit {
  products$: Observable<Product[]> = of([]);
  filteredProducts$: Observable<Product[]> = of([]);
  totalPages: number = 1;
  searchTerm: string = '';
  orderBy: string = '';
  categories: Category[] = [];
  selectedCategories: number[] = [];
  showFilterPopup: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProducts(1);
  }

  loadProducts(page: number): void {
    let params = `?page=${page}`;
    if (this.searchTerm) {
      params += `&search=${this.searchTerm}`;
    }
    if (this.orderBy) {
      params += `&orderby=${this.orderBy}`;
    }
    if (this.selectedCategories.length > 0) {
      params += `&categories=${this.selectedCategories.join(',')}`;
    }

    this.http.get<any>(`http://127.0.0.1:8000/api/v1/products${params}`).pipe(
      tap((response: any) => {
        this.totalPages = response.total_pages;
      }),
      map((response: any) => {
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data.map((product: Product) => ({
            ...product,
            productImages: JSON.parse(product.image_path).map((imagePath: string) =>
              'http://127.0.0.1:8000' + imagePath.replace('\/storage', '/storage')
            )
          }));
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    ).subscribe((products: Product[]) => {
      this.products$ = of(products);
      this.filteredProducts$ = of(products);
    });
  }

  searchProducts(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.loadProducts(1);
  }

  onOrderChange(orderBy: string): void {
    this.orderBy = orderBy;
    this.loadProducts(1);
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategories = [categoryId];
    this.loadProducts(1);
  }

  toggleFilterPopup(): void {
    this.showFilterPopup = !this.showFilterPopup;
  }

  handleFilterApplied(selectedCategories: number[]): void {
    this.selectedCategories = selectedCategories;
    this.loadProducts(1);
  }
}
