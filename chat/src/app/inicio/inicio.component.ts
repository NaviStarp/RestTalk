import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-inicio',
  imports: [FooterComponent, HeaderComponent, CommonModule],
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  constructor() {
    console.log('InicioComponent created');
  }
  ngOnInit() {
    console.log('InicioComponent initialized');
  }
}
