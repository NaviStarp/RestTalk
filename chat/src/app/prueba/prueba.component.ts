import { Component } from '@angular/core';

@Component({
  selector: 'app-prueba',
  imports: [],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent {
  get token() {
    return localStorage.getItem('authToken');
  }

  get userId() {
    return localStorage.getItem('userId');
  }

  get username() {
    return localStorage.getItem('username');
  }

}
