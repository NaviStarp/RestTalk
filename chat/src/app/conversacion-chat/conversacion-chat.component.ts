import { Component, OnInit } from '@angular/core';
import { CambiarColorService } from '../services/cambiar-color.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversacion-chat',
  templateUrl: './conversacion-chat.component.html',
  styleUrls: ['./conversacion-chat.component.css'],
  imports: [CommonModule]
})
export class ConversacionChatComponent implements OnInit {
  imagenFondo = 'C:\Users\DAM\Documents\DessarolloDeInterfaces\RestTalk\chat\src\assets\images\fondi.jpg';

  constructor(private cambiarColorService: CambiarColorService) { }

  ngOnInit() {
    this.cambiarColorService.fondo$.subscribe(estilo => {
      this.imagenFondo = estilo.imagen;
    });
  }

  // Cambiar solo la imagen de fondo
  cambiarImagen(imagen: string) {
    this.cambiarColorService.cambiarImagen(imagen);
  }
}
