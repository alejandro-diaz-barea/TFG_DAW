import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-my-products-page',
  templateUrl: './my-products-page.component.html',
  styleUrls: ['./my-products-page.component.css']
})
export class MyProductsPageComponent implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    // Obtener el token de autenticación del almacenamiento local (o de donde sea que esté almacenado)
    const token = localStorage.getItem('accessToken');

    // Verificar si hay un token disponible
    if (!token) {
      console.error('Token de autenticación no encontrado.');
      return;
    }

    // Configurar las cabeceras HTTP con el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Realizar la solicitud HTTP con las cabeceras configuradas
    this.http.get<any>('http://127.0.0.1:8000/api/v1/user-products', { headers }).pipe(
      tap((response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.errorMessage = ''; // Reiniciar el mensaje de error si se reciben datos exitosamente
        } else {
          this.errorMessage = 'No se encontraron productos.';
        }
      }),
      map((response: any) => {
        if (response.data && Array.isArray(response.data)) {
          return response.data.map((product: any) => ({
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
        console.error('Error al obtener los productos:', error);
        this.errorMessage = 'Productos no encontrados';
        return of([]);
      })
    ).subscribe((products: any[]) => {
      this.products$ = of(products);
      this.filteredProducts$ = of(products);
    }, error => {
      // Handle HTTP request error here
      console.error('Error en la solicitud HTTP:', error);
      this.errorMessage = 'Productos no encontrados';
    });
  }

  nextImage(product: Product): void {
    if (product.currentImageIndex !== undefined) {
      product.currentImageIndex = (product.currentImageIndex + 1) % product.productImages.length;
    } else {
      product.currentImageIndex = 0;
    }
  }

  prevImage(product: Product): void {
    if (product.currentImageIndex !== undefined) {
      product.currentImageIndex = (product.currentImageIndex - 1 + product.productImages.length) % product.productImages.length;
    } else {
      product.currentImageIndex = 0;
    }
  }
}
