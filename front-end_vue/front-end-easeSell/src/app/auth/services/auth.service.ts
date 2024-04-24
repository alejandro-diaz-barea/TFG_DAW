import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interfaces';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  // private baseUrl = environment.baseUrl

  private user?: User;




  constructor(private http: HttpClient) {

   }


  get currentUser(): User | undefined {
    if(!this.user) return undefined;
    return structuredClone(this.user);
  }

  // login( email:string, password:string): Observable<User>{

  // }

}
