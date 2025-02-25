import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  isLoading = false;
  errorMessage = '';

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const credentials = this.loginForm.value;
    const username = credentials.username.toLowerCase(); // Convertir a minúsculas como lo hace el backend
    const password = credentials.password;
    
    console.log('Enviando credenciales:', { username, password }); // Depuración
    
    this.http.post<any>(
      'http://127.0.0.1:8000/api/v1/login/', 
      { username, password }
    ).pipe(
      tap(response => {
        console.log('Respuesta exitosa:', response); // Depuración
        
        // Guardar token y datos del usuario en localStorage si están presentes
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.user_id) {
          localStorage.setItem('userId', response.user_id.toString());
        }
        if (response.username) {
          localStorage.setItem('username', response.username);
        }
        
        // Navegar a la ruta protegida
        this.router.navigate(['/prueba']);
      }),
      catchError(error => {
        console.error('Error detallado:', error);
        
        // Analizar el cuerpo de la respuesta para obtener más detalles
        if (error.error) {
          console.error('Detalles del error del servidor:', error.error);
          
          // Si el backend devuelve información específica sobre el error, la mostramos
          if (error.error.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = 'Error de autenticación. Verifique sus credenciales.';
          }
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Verifique su conexión.';
        } else {
          this.errorMessage = `Error ${error.status}: ${error.statusText || 'Error desconocido'}`;
        }
        
        return throwError(() => error);
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}