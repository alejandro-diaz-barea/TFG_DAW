import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
  public contact: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    texto: ['', [Validators.required, Validators.minLength(10)]],
    fecha: ['', [this.validarFecha, Validators.required]]
  });
  public enviadoConExito: boolean = false;

  constructor(private fb: FormBuilder) {}

  // Método para enviar el formulario
  public enviarFormulario(): void {
    if (this.contact.valid) {
      console.log("Formulario válido, enviando...");
      this.enviadoConExito = true;
      setTimeout(() => {
        this.resetearFormulario();
      }, 2000);
    } else {
      console.log("Formulario inválido");
    }
  }

  // Método para validar un campo específico
  public validarCampo(campo: string): void {
    const control = this.contact.get(campo);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  // Método privado para resetear el formulario después de enviarlo con éxito
  private resetearFormulario(): void {
    this.contact.reset();
    this.enviadoConExito = false;
  }

  // Método privado para validar la fecha seleccionada
  private validarFecha(control: AbstractControl): ValidationErrors | null {
    const fechaSeleccionada = control.value;
    const fechaMinima = new Date('2024-01-01');
    const fecha = new Date(fechaSeleccionada);

    if (fecha < fechaMinima) {
      return { 'fechaInvalida': true };
    }

    return null;
  }
}
