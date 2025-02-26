import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

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

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent implements OnInit {
  messages: Message[] = []; // Definir el tipo explícitamente
  chats: Chat[] = []; // Definir el tipo explícitamente

  constructor(private auth: AuthService) {}

  get token() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  get userId() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null;
  }

  get username() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null;
  }

  ngOnInit(): void {
    this.auth.get_messages().subscribe(
      (response: Message[]) => this.messages = response, // Ahora TypeScript reconoce el tipo correctamente
      error => console.error('Error al obtener mensajes:', error)
    );

    this.auth.get_chats().subscribe(
      (response: Chat[]) => this.chats = response, // Asegurarse de que se asigne un array de `Chat`
      error => console.error('Error al obtener chats:', error)
    );
  }
}
