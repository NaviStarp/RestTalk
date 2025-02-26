import { Component } from '@angular/core';

@Component({
  selector: 'app-usuarios-chat', // Asegúrate de que el selector sea correcto
  templateUrl: './usuarios-chat.component.html',
  styleUrls: ['./usuarios-chat.component.css']
})
export class UsuariosChatComponent {
  // Lógica del componente

  clickCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      console.log("check");
    } else {
      console.log("uncheck");
    }
  }
}