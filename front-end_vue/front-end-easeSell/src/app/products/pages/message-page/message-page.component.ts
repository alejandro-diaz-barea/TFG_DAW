import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Pusher from 'pusher-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.css']
})
export class MessagePageComponent implements OnInit, OnDestroy {
  chatId: string | null = null;
  messages: any[] = [];
  newMessage: string = '';
  pusherChannel: Pusher.Channel | null = null;
  messageForm!: FormGroup;
  chatName: string = ''; // Definir la propiedad chatName

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  get currentUserID() {
    return this.authService.currentUserInfo?.id;
  }

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.chatId = params['chatId'];
      this.chatName = params['otherName']; // Asignar el valor de chatName desde los parámetros de la URL
      console.log('Chat ID:', this.chatId);
      console.log('Chat Name:', this.chatName);
      this.fetchMessages();
      this.initializePusher();
    });
    console.log('ngOnInit() executed');
  }

  ngOnDestroy(): void {
    if (this.pusherChannel) {
      this.pusherChannel.unbind_all();
      this.pusherChannel.unsubscribe();
    }
  }

  fetchMessages(): void {
    if (this.chatId) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        this.http.get<any[]>(`http://127.0.0.1:8000/api/v1/messages?chat_id=${this.chatId}`, { headers })
          .subscribe(
            (response) => {
              console.log('Response from server:', response);
              this.messages = response;
            },
            (error) => {
              console.error('Error al obtener los mensajes:', error);
            }
          );
      } else {
        console.error('Token de autenticación no encontrado.');
      }
    }
  }

  sendMessage(): void {
    console.log('Sending message:', this.messageForm.value.content);
    if (this.chatId && this.messageForm.valid) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const body = {
          IDChat: this.chatId,
          content: this.messageForm.value.content
        };

        this.http.post(`http://127.0.0.1:8000/api/v1/messages`, body, { headers })
          .subscribe(
            (response) => {
              console.log('Message sent successfully:', response);
              this.messageForm.reset();
            },
            (error) => {
              console.error('Error al enviar el mensaje:', error);
            }
          );
      } else {
        console.error('Token de autenticación no encontrado.');
      }
    }
  }

  initializePusher(): void {
    if (this.chatId) {
      const pusher = new Pusher.default('136f1ba31fe89725b0ff', {
        cluster: 'eu'
      });

      this.pusherChannel = pusher.subscribe(`chat.${this.chatId}`);
      if (this.pusherChannel) {
        this.pusherChannel.bind('message-sent', (data: any) => {
          console.log('Received message-sent event:', data);
          this.messages.push(data);
          console.log('Updated messages:', this.messages);
        });
      }
    }
  }
}
