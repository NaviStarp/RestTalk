import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface EstiloFondo {
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CambiarColorService {
  private fondoSource = new BehaviorSubject<EstiloFondo>({
    color: '#f0f0f0'  // Color inicial (modo claro)
  });

  fondo$ = this.fondoSource.asObservable();

  cambiarColor(color: string) {
    this.fondoSource.next({ color });
  }
}
