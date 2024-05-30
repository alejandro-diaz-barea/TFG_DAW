import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public loginForm: FormGroup = this.fb.group({
    email: [''],
    password: ['']
  });
  public loginError: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {}

  login(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!email.trim() || !password.trim()) {
      this.loginError = 'Por favor, complete todos los campos.';
      return;
    }

    this.loginError = '';

    this.authService.login(email, password)
      .then(loggedIn => {
        if (loggedIn) {
          console.log('Inicio de sesión exitoso');
          this.router.navigate(['/explore']);
        } else {
          this.loginError = 'Usuario o contraseña incorrectos';
        }
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        this.loginError = 'Error durante el inicio de sesión';
      });
  }


  isFieldEmpty(fieldName: string): boolean {
    const fieldValue = this.loginForm.get(fieldName)?.value;
    return !fieldValue.trim();
  }


}

