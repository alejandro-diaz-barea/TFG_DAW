import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public isLoggedIn: boolean = false; // Variable para mantener el estado de inicio de sesión
  private currentUser?: User; // Usuario actualmente autenticado

  constructor() { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn; // Retorna el estado de inicio de sesión actual
  }

  get currentUserInfo(): User | undefined {
    return this.currentUser; // Retorna la información del usuario actualmente autenticado
  }

  login(email: string, password: string): Observable<boolean> {
    // Simula una verificación de credenciales sin hacer ninguna llamada HTTP
    if (email === 'user@example.com' && password === 'password') {
      // Si las credenciales son válidas, establece el estado de inicio de sesión como verdadero
      this.isLoggedIn = true;
      // Simplemente crea un usuario ficticio para demostrar el concepto
      this.currentUser = { id: 1, user: 'example_user', email: email };
      return of(true); // Retorna un observable con el resultado del inicio de sesión
    } else {
      // Si las credenciales no son válidas, retorna un error observable o un valor falso
      return of(false);
    }
  }

  logout(): void {
    // Simplemente establece el estado de inicio de sesión como falso al cerrar sesión
    this.isLoggedIn = false;
    // También limpia la información del usuario actual
    this.currentUser = undefined;
  }
}
