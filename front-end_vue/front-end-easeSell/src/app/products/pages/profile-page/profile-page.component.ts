import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../auth/interfaces/user.interfaces';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


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



  getUserLogoPath(): string {
    const baseUrl = 'http://127.0.0.1:8000/';
    return this.user?.logo_path ? `${baseUrl}${this.user.logo_path}` : '../../../../assets/profile-user.png';
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    // Obtener el token de autenticación del almacenamiento local
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No se encontró ningún token de acceso en el almacenamiento local.');
      return;
    }

    // Configurar los encabezados de la solicitud con el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

    // Enviar la imagen al backend
    this.http.post<any>('http://127.0.0.1:8000/api/v1/users/upload-photo', formData, { headers }).subscribe(
      async (response) => {
        if (response && response.user) {
          console.log('Imagen subida exitosamente:', response);

          // Actualizar la información del usuario después de una subida exitosa
          const updatedUser: User = response.user;
          this.authService.setCurrentUser(updatedUser);

        } else {
          console.error('Respuesta inválida del servidor:', response);
        }
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }
}
