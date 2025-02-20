import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { InicioComponent } from '../inicio/inicio.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-privacidad',
  imports: [HeaderComponent, FooterComponent,InicioComponent],
  templateUrl: './privacidad.component.html',
  styleUrl: './privacidad.component.css'
})
export class PrivacidadComponent {

}
