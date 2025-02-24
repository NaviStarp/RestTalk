import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { UsuariosChatComponent } from './usuarios-chat/usuarios-chat.component'; // Importa el componente
import { ConversacionChatComponent } from './conversacion-chat/conversacion-chat.component'; // Importa el componente

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    UsuariosChatComponent, // Declara el componente
    ConversacionChatComponent // Declara el componente
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }