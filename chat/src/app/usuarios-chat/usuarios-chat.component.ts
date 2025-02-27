import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CambiarColorService } from '../services/cambiar-color.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-usuarios-chat',
  templateUrl: './usuarios-chat.component.html',
  styleUrls: ['./usuarios-chat.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UsuariosChatComponent implements OnInit{
  isDarkMode = false;
  userForm: FormGroup;
  selectedUser: string | null = null;

  // Definimos los usuarios como un array para mayor flexibilidad
  usuarios: string[] = [];

  constructor(
    private cambiarColorService: CambiarColorService,
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef  
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
  
    this.userForm.get('usuarios')?.valueChanges.subscribe(value => {
      this.selectedUser = value;
    });
  }

  loadUsernames() {
    this.authService.get_usernames().subscribe({
      next: (response: any) => {
        console.log('Respuesta original:', response);
        
        // Verifica si la respuesta es un objeto y tiene la clave "users" que es un array
        if (response && Array.isArray(response.users)) {
          this.usuarios = response.users;
          console.log('Usuarios extraídos:', this.usuarios);
        } else {
          console.error('Formato de respuesta inesperado:', response);
          this.usuarios = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
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