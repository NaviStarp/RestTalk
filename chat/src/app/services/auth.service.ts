import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.3.182:8000/api/v1';
  
  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  get_messages(): Observable<Message[]> {
    console.log('Obteniendo mensajes...');
    return this.http.get<Message[]>(`${this.apiUrl}/messages/get`, {
      headers: { Authorization: `Token ${this.getToken()}` }
    }).pipe(
      tap(response => console.log('Mensajes obtenidos:', response))
    );
  }

  get_chats(): Observable<Chat[]> {
    console.log('Obteniendo chats...');
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/get`, {
      headers: { Authorization: `Token ${this.getToken()}` }
    }).pipe(
      tap(response => console.log('Chats obtenidos:', response))
    );
  }
}
