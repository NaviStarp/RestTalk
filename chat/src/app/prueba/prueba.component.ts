import { Component } from '@angular/core';

@Component({
  selector: 'app-prueba',
  imports: [],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent {

  get token() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  get userId() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null;
  }

  get username() {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null;
  }

}
