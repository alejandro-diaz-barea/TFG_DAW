import { Component, OnInit, effect } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end-easeSell';
  authChecked: boolean = false;
  showMenu: boolean = false; 

  constructor(private authService: AuthService, private router : Router) {}

  ngOnInit(): void {
    this.authService.checkAuthStatus().then(isAuthenticated => {
      this.authChecked = true;
      if (!isAuthenticated) {
        console.log('El usuario no está autenticado.');
      } else {
        console.log('El usuario está autenticado.');
      }
    }).catch(error => {
      console.error('Error al verificar el estado de autenticación:', error);
      this.authChecked = true;
    });
  }

  toggleMenu() {
    // Alternar la visibilidad del menú desplegable
    this.showMenu = !this.showMenu;
  }


  goToLogin():void {
    if(!this.authService.isUserLoggedIn){
      this.router.navigate(['/auth/login']);
    }

  }

  get user(): boolean {
    return this.authService.isUserLoggedIn;
  }

  get userInfo(): string | undefined {
    return this.authService.currentUserInfo?.name;
  }
}
