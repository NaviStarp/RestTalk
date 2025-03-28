import { afterNextRender, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface Chat {
  id: number;
  chat_type: string;
  name: string;
  created_at: string;
  updated_at: string;
  users: number[];
}

interface Message {
  id: number;
  chat: number;
  sender: number;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface NewChat {
  user_id: number;  // Cambiado de user_id a users como array
  chat_type: string;
  name?: string;    // Opcional con ?
  created_at?: string;  // Opcional, ya que probablemente se genera en el backend
  updated_at?: string;  // Opcional, ya que probablemente se genera en el backend
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.3.182:8000/api/v1';
  
  constructor(private http: HttpClient) { }
  
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  get_messages(chat_id: number, callback: (messages: Message[]) => void): void {
    this.http.get<Message[]>(`${this.apiUrl}/messages/get/`, {
      headers: { Authorization: `Token ${this.getToken()}` },
      params: { chat_id: chat_id.toString() }
    }).subscribe({
      next: (response: Message[]) => {
        const filteredMessages = response.filter(message => message.chat === chat_id);
        callback(filteredMessages);
      },
      error: (error) => {
        console.error('Error al obtener mensajes:', error);
        callback([]);
      }
    });
  }
  
  // Método asíncrono que devuelve Promise<Message[]>
  async get_messages_array(chat_id: number): Promise<Message[]> {
    const messages = await firstValueFrom(
      this.http.get<Message[]>(`${this.apiUrl}/messages/get/`, {
        headers: { Authorization: `Token ${this.getToken()}` }
        
      })
    );
    return messages.filter(message => message.chat === chat_id);
  }
  
 
  
  get_chats(): Observable<Chat[]> {
    console.log('Obteniendo chats...');
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/get/`, {
      headers: { Authorization: `Token ${this.getToken()}` }
    }).pipe(
      tap(response => console.log('Chats obtenidos:', response))
    );
  }
  
  send_message(Messaje:Message): Observable<Message> {
    console.log('Enviando mensaje...');
    return this.http.post<Message>(`${this.apiUrl}/messages/send/`, {
      chat: Messaje.chat,
      sender: Messaje.sender,
      text: Messaje.text,
      created_at: Messaje.created_at,
      updated_at: Messaje.updated_at
    }, {
      headers: { Authorization: `Token ${this.getToken()}` }
    }).pipe(
      tap(response => console.log('Mensaje enviado:', response))
    );
  }
  
  get_usernames(): Observable<string[]> {
    console.log('Obteniendo usernames...');
    return this.http.get<{ request_user: string; users: string[] }>(`${this.apiUrl}/users/get/`, {
      headers: { Authorization: `Token ${this.getToken()}` }
    }).pipe(
      tap(response => console.log('Respuesta completa:', response)),
      map(response => response.users)  // Extraemos el array de usuarios
    );
  }
  
  create_chat(chatData: NewChat): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/chats/create/`, chatData, {
      headers: { Authorization: `Token ${this.getToken()}` }
    });
  }
  get_id(username: string): Observable<number> {
    return this.http.get<{id: number}>(`${this.apiUrl}/fhu/get/${username}/`, {
      headers: { Authorization: `Token ${this.getToken()}` }
    }).pipe(
      map(response => response.id)
    );
  }
}