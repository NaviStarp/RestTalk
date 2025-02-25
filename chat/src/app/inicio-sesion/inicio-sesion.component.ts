import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio-sesion',
  imports: [HeaderComponent, HttpClientModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})

export class InicioSesionComponent {

  username: string = '';
  password: string = '';

  // constructor(private authService: AuthService) {}
  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.http.post('http://127.0.0.1:8000/api/login/', {
      username: this.username,
      password: this.password
    }).subscribe(
      response => {
        console.log(response);
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/privacidad']);
      },
      (error: any) => {
        console.error('Error en login', error);
        alert('Error en inicio de sesión');
      }
    );
  }
  // onLogin(): void {
  //   this.authService.login(this.username, this.password).subscribe(
  //     (response) => {
  //       console.log('Login exitoso', response);
  //       alert('Inicio de sesión exitoso');
  //     },
  //     (error) => {
  //       console.error('Error en login', error);
  //       alert('Error en inicio de sesión');
  //     }
  //   );
  // }
}
