import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
export class MessagePageComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatId: string | null = null;
  chatName: string = '';
  chatPhotoUrl: string = '';
  messages: any[] = [];
  newMessage: string = '';
  pusherChannel: Pusher.Channel | null = null;
  messageForm!: FormGroup;

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

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
      this.chatName = params['otherName'];
      this.chatPhotoUrl = params['url_photo'];
      console.log('Chat ID:', this.chatId);
      console.log('Chat Name:', this.chatName);
      console.log('Chat Photo URL:', this.chatPhotoUrl);


      this.fetchMessages();


      this.initializePusher();
    });
    console.log('ngOnInit() executed');
  }

  // Limpieza de Pusher al destruir el componente
  ngOnDestroy(): void {
    if (this.pusherChannel) {
      this.pusherChannel.unbind_all();
      this.pusherChannel.unsubscribe();
    }
  }

  // Método para desplazarse al final del contenedor de mensajes después de cada cambio
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }


  get token(){
    return this.authService.currentUserInfo?.access_token
  }

  // Método para obtener los mensajes del chat desde el servidor
  fetchMessages(): void {
    if (this.chatId) {
      const token = this.token
      if (token) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        this.http.get<any[]>(`http://127.0.0.1:8000/api/v1/messages?chat_id=${this.chatId}`, { headers })
          .subscribe(
            (response) => {
              console.log('Response from server:', response);
              this.messages = response;
              this.scrollToBottom();
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
      const token = this.token
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
              this.fetchMessages(); // Actualizar mensajes después de enviar
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

  // Inicialización de Pusher para escuchar eventos de mensajes
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
          this.scrollToBottom();
          console.log('Updated messages:', this.messages);
        });
      }
    }
  }

  // Método privado para desplazarse al final del contenedor de mensajes
  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
