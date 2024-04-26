import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedIn: boolean = false;
  private currentUser?: User;

  constructor() { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn
  }

  get currentUserInfo(): User | undefined {
    return this.currentUser;
  }

  login(email: string, password: string): Observable<boolean> {
    if (email === 'a@a.a' && password === 'p') {
      this.isLoggedIn = true;
      this.currentUser = { id: 1, user: 'example_user', email: email,name:"pedro" };
      return of(true);
    } else {
      return of(false);
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = undefined;
  }
}
