import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  users: any[] = [];
  messages: any[] = [];
  selectedUser: any = null;
  currentUser: string = '';
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.currentUser = localStorage.getItem('username') || '';
      this.chatService.getUsers().subscribe((data) => {
        this.users = data.filter((u: any) => u.username !== this.currentUser);
      });
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.chatService.getMessages(this.currentUser, user.username).subscribe((msgs) => {
      console.log('Mensajes recibidos:', msgs);
      this.messages = msgs.filter((m: any) => m.content && m.content.trim());
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  sendMessage() {
    const trimmedMessage = this.newMessage.trim();
    if (!trimmedMessage) return;

    this.chatService.sendMessage(this.selectedUser.username, trimmedMessage).subscribe(() => {
      this.messages.push({ sender: this.currentUser, content: trimmedMessage });
      this.newMessage = '';
      this.scrollToBottom();
    });
  }
}
