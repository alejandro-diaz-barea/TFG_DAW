import { Component, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end-easeSell';

  private authService = inject(AuthService)

  get user(): boolean{
    return this.authService.isUserLoggedIn;
  }

  get userInfo(): String |undefined{
    return this.authService.currentUserInfo?.name;
  }

  onUse(){
    console.log(this.user)
    // console.log(this.infoUser)

  }

}
