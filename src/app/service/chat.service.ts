import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private userUrl = 'http://localhost:8080/users';
  private messageUrl = 'http://localhost:8080/messages';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userUrl);
  }

  getMessages(sender: string, receiver: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.messageUrl}/${sender}/${receiver}`);
  }

sendMessage(receiver: string, content: string): Observable<any> {
const sender = localStorage.getItem('username') || '';
return this.http.post(this.messageUrl, {
sender,
receiver,
content
});
}
  
}
