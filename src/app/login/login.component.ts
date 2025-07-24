import { Component } from '@angular/core';
import { AuthService, User } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  email = '';
  message = '';
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        this.router.navigate(['/chat']);
      }
    }
  }

  submit() {
    const user: User = { username: this.username, email: this.email };
    console.log('Enviando datos:', user);

    if (this.isLogin) {
      this.authService.login(user).subscribe({
        next: (res) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('username', res.username);
          }
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
          this.isLogin = true;
        },
        error: () => {
          this.message = 'Usuario ya registrado';
        },
      });
    }
  }
}
