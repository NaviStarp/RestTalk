import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, HttpClientModule,FormsModule],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent implements OnInit {
  messages: Message[] = []; // Definir el tipo explícitamente
  chats: Chat[] = []; // Definir el tipo explícitamente
  message = '';
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
  

    this.auth.get_chats().subscribe(
      (response: Chat[]) => this.chats = response, // Asegurarse de que se asigne un array de `Chat`
      error => console.error('Error al obtener chats:', error)
    );
    this.getUsernames();
  }
 
  getUsernames() {
    this.auth.get_usernames().subscribe(
      (response: string[]) => console.log('Usernames obtenidos:', response), // Asegurarse de que se reciba un array de `string`
      error => console.error('Error al obtener usernames:', error)
    );
  }
}
