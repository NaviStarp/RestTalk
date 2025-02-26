// registro.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    passwordRepeat: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });
  
  isLoading = false;
  errorMessage = '';
  
  registro(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const credentials = this.loginForm.value;
    const username = credentials.username.toLowerCase();
    const password = credentials.password;
    const passwordRepeat = credentials.passwordRepeat;
    const email = credentials.email;
    
    if (password !== passwordRepeat) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.isLoading = false;
      return;
    }
    
    this.http.post<any>(
      'http://127.0.0.1:8000/api/v1/register/',
      { username, password, email }
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.user_id) {
          localStorage.setItem('userId', response.user_id.toString());
        }
        if (response.username) {
          localStorage.setItem('username', response.username);
        }
        this.router.navigate(['/prueba']);
      }),
      catchError(error => {
        if (error.error) {
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