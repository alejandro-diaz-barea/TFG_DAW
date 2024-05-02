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
        const { access_token, user,address,id ,name} = responseData;
        // Guardar el token en el objeto currentUser
        this.currentUser = { ...user, access_token,address, id, name };
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

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = undefined;
  }
}
