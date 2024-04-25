import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  login(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    console.log(email,password)

    this.authService.login(email, password).subscribe(
      loggedIn => {
        if (loggedIn) {
          console.log('Inicio de sesión exitoso');
        } else {
          console.log('Credenciales inválidas');
        }
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
