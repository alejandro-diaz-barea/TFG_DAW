import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interfaces';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedIn: boolean = false;
  private currentUser?: User;

  constructor() { }

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
        const { access_token, address, id, name , email} = responseData;

        // Almacena el token en el almacenamiento local del navegador
        localStorage.setItem('accessToken', access_token);

        this.currentUser = { access_token, address, id, name, email };

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
        if (response.status === 422) {
          // Error de validación, extraer errores del cuerpo de la respuesta
          const validationErrors = responseData['message']; // Acceso seguro con corchetes
          return { success: false, errors: validationErrors };
        } else {
          // Otro tipo de error
          console.error('Error during registration:', responseData.error);
          return { success: false, errors: { general: 'Error during registration' } };
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, errors: { general: 'Error during registration' } };
    }
  }


  //Mantener sesion
  async checkAuthStatus(): Promise<boolean> {
    const url = 'http://127.0.0.1:8000/api/v1/auth/checktoken';
    const token = localStorage.getItem('accessToken');

    if (!token) {
      // Si no hay token en el local, el usuario no está autenticado
      return false;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        const { access_token, id, name, address, email } = responseData;
        if (access_token && id && name && address && email) {
          // Actualiza el token en el localstorage
          localStorage.setItem('accessToken', access_token);
          // Actualiza el usuario actual
          this.currentUser = { id, name, email, access_token, address };
          this.isLoggedIn = true;
          return true;
        }
      } else {
        // En caso de respuesta no exitosa, no está autenticado
        this.isLoggedIn = false;
        this.currentUser = undefined;
        return false;
      }
    } catch (error) {
      console.error('Error during checkAuthStatus:', error);
      // En caso de error, no está autenticado
      this.isLoggedIn = false;
      this.currentUser = undefined;
      return false;
    }

    return false;
  }



  logout(): void {
    // Elimina el token del almacenamiento local al cerrar sesión
    localStorage.removeItem('accessToken');
    this.isLoggedIn = false;
    this.currentUser = undefined;

  }
}
