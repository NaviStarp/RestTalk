import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.3.180:8000/api/login/'; // URL del backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const csrfToken = this.getCookie('csrftoken'); // Obtiene el token CSRF de las cookies
    return this.http.post(
      this.apiUrl,
      { username, password },
      { headers: { 'X-CSRFToken': csrfToken } }
    );
  }

  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      if (part) {
        return part.split(';').shift() || '';
      }
    }
    return '';
  }
}
