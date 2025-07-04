import { Component } from '@angular/core';
import { AuthService, User } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  email = '';
  message = '';
  isLogin = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.router.navigate(['/chat']);
    }
  }

  submit() {
    const user: User = { username: this.username, email: this.email };
    console.log('Enviando datos:', user);

    if (this.isLogin) {
      this.authService.login(user).subscribe({
        next: (res) => {
          localStorage.setItem('username', res.username);  // ✅ Guardamos el usuario
          this.message = '¡Bienvenido ' + res.username + '!';
          this.router.navigate(['/chat']);
        },
        error: () => {
          this.message = 'Usuario no encontrado';
        },
      });
    } else {
      this.authService.register(user).subscribe({
        next: (res) => {
          this.message = 'Usuario registrado: ' + res.username;
          this.isLogin = true;  // ✅ Cambiar a modo login después de registrar
        },
        error: () => {
          this.message = 'Usuario ya registrado';
        },
      });
    }
  }
}
