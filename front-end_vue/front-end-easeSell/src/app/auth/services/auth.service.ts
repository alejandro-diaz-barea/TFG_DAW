import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { Observable, of, retry } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import { catchError, map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedIn: boolean = false;
  private currentUser?: User;

  constructor(private http: HttpClient) { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  get currentUserInfo(): User | undefined {
    return this.currentUser;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        const { access_token, user, address, id, name } = responseData;

        // Almacena el token en el almacenamiento local del navegador
        localStorage.setItem('accessToken', access_token);

        this.currentUser = { ...user, access_token, address, id, name };

        console.log(this.currentUser)
        this.isLoggedIn = true;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }


  async register(userData: { name: string, email: string, password: string, address: string, phone_number: string }): Promise<{ success: boolean, errors?: any }> {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log('Registration response:', responseData);

      if (response.ok) {
        return { success: true };
      } else {
        console.error('Error during registration:', responseData.error);
        return { success: false, errors: responseData.message };
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, errors: { general: 'Error during registration' } };
    }
  }

  // checkAuthStatus(): Observable<boolean> {
  //   const url = 'http://127.0.0.1:8000/api/v1/auth/checktoken';
  //   const token = localStorage.getItem('accessToken');

  //   if (!token) {
  //     // Si no hay token en el almacenamiento local, el usuario no está autenticado
  //     return of(false);
  //   }

  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
  //     map(response => {
  //       const { token, user } = response;
  //       if (token && user) {
  //         // Actualiza el token en el almacenamiento local
  //         localStorage.setItem('accessToken', token);
  //         // Actualiza el usuario actual con los datos recibidos
  //         this.currentUser= {
  //           id: user.id,
  //           name: user.name,
  //           email: user.email,

  //           // Agrega aquí el resto de los campos que desees
  //         };
  //         this.isLoggedIn = true;
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //     catchError(() => {
  //       // En caso de error, el usuario no está autenticado
  //       this.isLoggedIn = false;
  //       this.currentUser = undefined;
  //       return of(false);
  //     })
  //   );
  // }

  logout(): void {
    // Elimina el token del almacenamiento local al cerrar sesión
    localStorage.removeItem('accessToken');
    this.isLoggedIn = false;
    this.currentUser = undefined;

  }
}
