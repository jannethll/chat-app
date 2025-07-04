import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp?: Date;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = 'http://localhost:8080/messages';

  constructor(private http: HttpClient) {}

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  getMessages(sender: string, receiver: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${sender}/${receiver}`);
  }
}
