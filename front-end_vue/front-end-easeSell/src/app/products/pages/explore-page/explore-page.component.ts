import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Product } from '../../interfaces/product.interface';
import { Category } from '../../interfaces/category.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent implements OnInit {
  products$: Observable<Product[]> = of([]);
  filteredProducts$: Observable<Product[]> = of([]);
  totalPages: number = 1;
  currentPage: number = 1;
  searchTerm: string = '';
  orderBy: string = '';
  categories: Category[] = [];
  selectedCategories: number[] = [];
  showFilterPopup: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts(1);
  }

  loadProducts(page: number): void {
    this.currentPage = page;
    let params = `?page=${page}`;
    if (this.searchTerm) {
      params += `&search=${encodeURIComponent(this.searchTerm)}`;
    }
    if (this.orderBy) {
      params += `&orderby=${this.orderBy}`;
    }
    if (this.selectedCategories.length > 0) {
      params += `&categories=${this.selectedCategories.join(',')}`;
    }

    this.http.get<any>(`http://127.0.0.1:8000/api/v1/products${params}`).pipe(
      tap((response: any) => {
        if (response && response.data && Array.isArray(response.data.data)) {
          this.totalPages = response.data.last_page;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No products found matching the specified criteria.';
        }
      }),
      map((response: any) => {
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data)
          return response.data.data.map((product: Product) => ({
            ...product,
            currentImageIndex: 0,
            productImages: JSON.parse(product.image_path).map((imagePath: string) =>
              'http://127.0.0.1:8000' + imagePath.replace('/storage', '/storage')
            )
          }));
        } else {
          console.error('Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Products not found';
        return of([]);
      })
    ).subscribe((products: Product[]) => {
      this.products$ = of(products);
      this.filteredProducts$ = of(products);
    }, error => {
      // Handle HTTP request error here
      console.error('HTTP request error:', error);
      this.errorMessage = 'Products not found';
    });
  }

  goToLogin(): void {
    if (!this.authService.isUserLoggedIn) {
      this.router.navigate(['/auth/login']);
    }
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
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    } else {
      this.selectedCategories.push(categoryId);
    }
    this.loadProducts(1);
  }

  toggleFilterPopup(): void {
    this.showFilterPopup = !this.showFilterPopup;
  }

  handleFilterApplied(selectedCategories: number[]): void {
    this.selectedCategories = selectedCategories;
    this.loadProducts(1);
  }

  nextImage(product: Product): void {
    if (product.currentImageIndex !== undefined) {
      product.currentImageIndex = (product.currentImageIndex + 1) % product.productImages.length;
    } else {
      product.currentImageIndex = 0;
    }
  }

  contactSeller(sellerId: number): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const payload = { user2_id: sellerId };

      this.http.post('http://127.0.0.1:8000/api/v1/chats', payload, { headers })
        .subscribe(
          (response) => {
            console.log('Chat creado:', response);
            this.router.navigate(['/messages']);
          },
          (error) => {
            console.error('Error al crear el chat:', error);
          }
        );
    } else {
      console.error('Token de autenticación no encontrado.');
    }
  }
}
