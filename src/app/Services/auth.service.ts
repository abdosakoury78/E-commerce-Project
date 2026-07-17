import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/users';
  constructor(private http : HttpClient) { }

  register(userData : User) {
    return this.http.post(this.apiUrl, userData);
  }

  login(email: string) {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
  }

  isLoggedIn() : boolean {
    return !!sessionStorage.getItem('user');
  }

  logout() {
    sessionStorage.removeItem('user');
    // NavbarComponent will call cartService.resetCartCount() after this
  }
}
