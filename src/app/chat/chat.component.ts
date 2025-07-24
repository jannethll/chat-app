import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
selector: 'app-chat',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './chat.component.html',
styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
@ViewChild('messageContainer') messageContainer!: ElementRef;

users: any[] = [];
messages: any[] = [];
selectedUser: any = null;
currentUser: string = '';
newMessage: string = '';
defaultAvatar: string = '/avatar.jpg'; // Ruta al avatar por defecto
private pollingSubscription?: Subscription;
private userPollingSub?: Subscription;

constructor(private chatService: ChatService,private router:Router,private sanitizer: DomSanitizer) {}
sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
ngOnInit() {
if (typeof window !== 'undefined' && window.localStorage) {
this.currentUser = localStorage.getItem('username') || '';
this.chatService.getUsers().subscribe((data) => {
this.users = data.filter((u: any) => u.username !== this.currentUser);
// Marcar al usuario como online al entrar
this.chatService.updateUserStatus(this.currentUser, true).subscribe();

});

}
}

selectUser(user: any) {
this.selectedUser = user;
this.loadMessages(true); // Primer carga

if (this.pollingSubscription) {
  this.pollingSubscription.unsubscribe();
}

this.pollingSubscription = interval(2000).subscribe(() => {
  this.loadMessages(false); // Actualiza sin hacer scroll
});
}

loadMessages(scroll: boolean = false) {
if (!this.selectedUser) return;

this.chatService.getMessages(this.currentUser, this.selectedUser.username).subscribe((msgs) => {
  const filteredMsgs = msgs.filter((m: any) => m.content?.trim() || m.fileUrl);

  this.messages = filteredMsgs.map((msg: any) => {
    if (msg.fileUrl && !msg.fileUrl.startsWith('http')) {
      msg.fileUrl = 'http://localhost:8080' + msg.fileUrl;
    }
    if (msg.fileUrl) {
      msg.safeFileUrl = this.sanitizeUrl(msg.fileUrl);
    }
    return msg;
  });

  if (scroll) this.scrollToBottom();
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
  this.messages.push({ sender: this.currentUser, content: trimmedMessage,timestamp: new Date().toISOString() });
  this.newMessage = '';
  this.scrollToBottom();
});
}

ngOnDestroy() {
if (this.userPollingSub) {
this.userPollingSub.unsubscribe();
}
}
uploadFile(event: any) {
  event.stopPropagation(); // evita que se propague el evento al formulario
  console.log('evento change detectado', event);
  const file = event.target.files[0];
  console.log('Archivo seleccionado:', file);
  if (!file || !this.selectedUser) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('sender', this.currentUser);
  formData.append('receiver', this.selectedUser.username);
  formData.append('content', this.newMessage || '');

 this.chatService.sendFileMessage(formData).subscribe({
  next: (msg: any) => {
    console.log('Archivo subido exitosamente:', msg);
   if (msg.fileUrl) {
    msg.safeFileUrl = this.sanitizeUrl(msg.fileUrl);
  }
    msg.timestamp = new Date().toISOString(); // Agregar timestamp
    this.messages.push(msg); // ✅ Usa la respuesta completa del backend
    this.newMessage = '';
    this.scrollToBottom();
  },
  error: (err) => {
    console.error('Error al subir archivo:', err);
  }
});

}


logout() {
  this.chatService.updateUserStatus(this.currentUser, false).subscribe(() => {
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  });
}

getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext!)) return 'image';
  if (['mp4', 'webm', 'ogg'].includes(ext!)) return 'video';
  if (['mp3', 'wav', 'ogg'].includes(ext!)) return 'audio';
  if (ext === 'pdf') return 'pdf';
  return 'other';
}

openInNewTab(url: string) {
  window.open(url, '_blank');
}

}