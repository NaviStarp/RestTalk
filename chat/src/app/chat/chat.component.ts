import { Component } from '@angular/core';
import { ConversacionChatComponent } from '../conversacion-chat/conversacion-chat.component';
import { UsuariosChatComponent } from '../usuarios-chat/usuarios-chat.component';

@Component({
  selector: 'app-chat',
  imports: [ConversacionChatComponent, UsuariosChatComponent],
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  contacts = [
    // Define tus contactos aquí
  ];
  messages = [
    // Define tus mensajes aquí
  ];
  newMessage: string = '';


  isSelected(contact: any): boolean {
    // Implementa la lógica para verificar si el contacto está seleccionado
    return false;
  }

  selectContact(contact: any): void {
    // Implementa la lógica para seleccionar un contacto
  }

  sendMessage(): void {
    // Implementa la lógica para enviar un mensaje
  }
}