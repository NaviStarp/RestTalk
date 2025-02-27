import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CambiarColorService } from '../services/cambiar-color.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-usuarios-chat',
  templateUrl: './usuarios-chat.component.html',
  styleUrls: ['./usuarios-chat.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UsuariosChatComponent implements OnInit, AfterViewInit {
  isDarkMode = false;
  userForm: FormGroup;
  selectedUser: string | null = null;

  // Definimos los usuarios como un array para mayor flexibilidad
  usuarios: string[] = [];

  constructor(
    private cambiarColorService: CambiarColorService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      usuarios: ['']
    });
  }

  ngOnInit() {
    // Nos suscribimos al servicio para cambios futuros si es necesario
    this.cambiarColorService.fondo$.subscribe(estilo => {
      this.isDarkMode = estilo.color === '#333';
    });

    // Llamamos a la función para cargar los usuarios en el select
    this.loadUsernames();
  }

  ngAfterViewInit() {
    this.populateSelect();
  }

  loadUsernames() {
    this.authService.get_usernames().subscribe(usernames => {
      if (Array.isArray(usernames)) {
        this.usuarios = usernames;
        this.populateSelect();
      } else {
        console.error('Error: usernames is not an array');
      }
    });
  }

  populateSelect() {
    const selectElement = document.getElementById('chats_select');
    if (selectElement) {
      selectElement.innerHTML = ''; // Limpiamos el select antes de llenarlo
      this.usuarios.forEach(username => {
        const option = document.createElement('option');
        option.value = username;
        option.text = username;
        selectElement.appendChild(option);
      });
    }
  }

  clickCheckbox(event: any) {
    this.isDarkMode = event.target.checked;
    const newColor = this.isDarkMode ? '#333' : '#f0f0f0';

    // Actualizamos el color en el servicio
    this.cambiarColorService.cambiarColor(newColor);
  }

  onSubmit() {
    if (this.userForm.valid && this.userForm.get('usuarios')?.value) {
      console.log('Usuario seleccionado:', this.selectedUser);
      // Aquí puedes añadir la lógica adicional que necesites al enviar el formulario
    } else {
      this.selectedUser = 'Por favor seleccione un usuario';
    }
  }

  // Métodos para manejar los eventos de foco del select para la animación
  onSelectFocus() {
    const selectContainer = document.querySelector('.custom-select-container');
    if (selectContainer) {
      selectContainer.classList.add('active');
    }
  }

  onSelectBlur() {
    const selectContainer = document.querySelector('.custom-select-container');
    if (selectContainer) {
      selectContainer.classList.remove('active');
    }
  }
}