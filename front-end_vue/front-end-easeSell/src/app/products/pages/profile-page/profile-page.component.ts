import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../auth/interfaces/user.interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  isEditing = false;
  editingField = '';
  editingValue = '';

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/explore"]);
  }

  get user(): User | undefined {
    return this.authService.currentUserInfo;
  }

  editDetail(field: string): void {
    if (this.user) {
      this.isEditing = true;
      this.editingField = field;
      this.editingValue = String(this.user[field as keyof User]);
    }
  }

  closeModal(): void {
    this.isEditing = false;
    this.editingField = '';
    this.editingValue = '';
  }

  updateDetail(): void {
    if (this.editingField && this.editingValue) {
      const updatedData: Partial<User> = {};

      // Asegurarse de que el campo editado sea válido y exista en la interfaz User
      if (this.editingField === 'name' || this.editingField === 'address') {
        updatedData[this.editingField] = this.editingValue;
      }

      this.authService.updateUser(updatedData).subscribe(
        (response: any) => { // Cambiado a 'any' para evitar errores de tipo
          console.log(response);
          // Verifica si la propiedad 'user' existe en la respuesta
          if ('user' in response) {
            // Actualiza la información del usuario en el AuthService
            this.authService.setCurrentUser(response['user']);

            // Verifica si el token se ha actualizado en la respuesta y guárdalo en el almacenamiento local
            if ('access_token' in response) {
              localStorage.setItem('accessToken', response['access_token']);
            }
          }
          this.closeModal();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }
}
