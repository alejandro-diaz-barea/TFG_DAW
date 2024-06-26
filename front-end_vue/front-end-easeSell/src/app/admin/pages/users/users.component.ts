import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  get token() {
    return this.authService.currentUserInfo?.access_token;
  }

  getAllUsers(): void {
    const token = this.token;
    if (!token) {
      console.error('Token de acceso no encontrado en el localStorage');
      return;
    }

    fetch('http://127.0.0.1:8000/api/v1/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      this.users = data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  get userInfo(): string | undefined {
    return this.authService.currentUserInfo?.name;
  }

  // Cambia el rol del usuario (superadmin o usuario regular)
  changeUserRole(userId: number, isSuper: boolean): void {
    const token = this.token;
    if (!token) {
      console.error('Token de acceso no encontrado en el localStorage');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/v1/users/${userId}/change-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ is_super: isSuper })
    })
    .then(response => {
      console.log('Response:', response);

      if (!response.ok) {
        return response.json().then(err => {
          console.error('Error response:', err);
          throw new Error('Error al cambiar el rol del usuario');
        });
      }
      return response.json();
    })
    .then(() => {
      this.getAllUsers(); // Refresca la lista de usuarios después de cambiar el rol
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Banea a un usuario
  banUser(userId: number): void {
    const token = this.token;
    if (!token) {
      console.error('Token de acceso no encontrado en el localStorage');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/v1/users/${userId}/ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al banear al usuario');
      }
      return response.json();
    })
    .then(() => {
      this.getAllUsers(); // Refresca la lista de usuarios después de banear a uno
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}
