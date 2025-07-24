import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly userUrl = `${this.baseUrl}/users`;
  private readonly messageUrl = `${this.baseUrl}/messages`;

  constructor(private http: HttpClient) {}

  private get currentUser(): string {
    return localStorage.getItem('username') || '';
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userUrl);
  }

  getMessages(sender: string, receiver: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.messageUrl}/${sender}/${receiver}`);
  }

  sendMessage(receiver: string, content: string): Observable<any> {
    return this.http.post(`${this.messageUrl}`, {
      sender: this.currentUser,
      receiver,
      content,
    });
  }

  // Enviar archivo + mensaje (formulario multipart)
  sendFileMessage(formData: FormData): Observable<any> {
    return this.http.post(`${this.messageUrl}/send-with-file`, formData);
  }

  // Opción alternativa para subir solo archivo (si se necesita)
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.messageUrl}/upload`, formData);
  }
  updateUserStatus(username: string, online: boolean): Observable<any> {
  return this.http.put(`http://localhost:8080/users/${username}/status`, null, {
    params: { online: online.toString() },
  });
}

}
