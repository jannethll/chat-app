import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, user).pipe(
      tap((res: User) => {
        localStorage.setItem('username', res.username);  // ✅ Guardar al hacer login
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }
}
