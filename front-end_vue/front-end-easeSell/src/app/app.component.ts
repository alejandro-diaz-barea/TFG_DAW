import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end-easeSell';


  constructor(private authService: AuthService){}

  onUse(){
    console.log(this.authService.isLoggedIn)

  }

}
