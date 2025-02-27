import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit {
  isMenuOpen = false;
  isLogged = false;

  constructor() { }
  
  ngOnInit(): void {
    this.isLogged = localStorage.getItem('authToken') ? true : false;
    console.log(this.isLogged);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  cerrarSesion(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.isLogged = false;
  }
  
}