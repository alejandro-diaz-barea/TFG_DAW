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

    // Verifica si los campos están vacíos
    if (!email.trim() || !password.trim()) {
      this.loginError = 'Please fill in all the fields.';
      return;
    }

    this.loginError = '';

    // Llama al servicio de autenticación para iniciar sesión
    this.authService.login(email, password)
    .then(loggedIn => {
      if (loggedIn) {
        // Redirige al usuario a la página de exploración si el inicio de sesión es exitoso
        this.router.navigate(['/explore']);
      } else {
        this.loginError = 'Incorrect username or password';
      }
    })
    .catch(error => {
      if (error.message === 'User is banned') {
        this.loginError = 'User is banned';
      } else {
        this.loginError = 'Incorrect username or password';
      }
    });
  }

  // Comprueba si un campo está vacío
  isFieldEmpty(fieldName: string): boolean {
    const fieldValue = this.loginForm.get(fieldName)?.value;
    return !fieldValue.trim();
  }
}
