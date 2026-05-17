import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    console.log('Login data:', {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }
}