import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  public registerForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],

  });

  constructor(private fb: FormBuilder) {}


  register() {

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;




  }
}
