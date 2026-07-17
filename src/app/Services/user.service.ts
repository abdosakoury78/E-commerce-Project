import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http : HttpClient) { }

  getUser() {
    const userData = sessionStorage.getItem('user');
    if(userData) {
      return JSON.parse(userData);
    }
  }
}
