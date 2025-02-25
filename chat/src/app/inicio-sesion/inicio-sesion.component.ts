import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-inicio-sesion',
  imports: [HeaderComponent],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
   username: string = '';
   password: string = '';

 // constructor(private authService: AuthService) {}
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://192.168.3.180:8000/api/login/', {
      username: 'usuario',
      password: 'contraseña'
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
