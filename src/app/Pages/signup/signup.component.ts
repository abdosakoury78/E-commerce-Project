import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../Components/alert/alert.component';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Model/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm : FormGroup;
  user : User | null = null;

  // alert properties
  isOpen = false;
  title = '';
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';

  constructor(private formBuilder: FormBuilder,
              private authService : AuthService
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]],
      confirmPassword: ['', Validators.required]
    })
  }

  get disabled() {
    return this.signupForm.invalid;
  }

  get emailValid() {
    const emailControl = this.signupForm.get('email');
    return emailControl?.valid;
  }

  get password6Chars() {
    const passwordControl = this.signupForm.get('password')?.value;
    return passwordControl?.length >= 6;
  }

  get passwordIncludesNumber() {
    const passwordControl = this.signupForm.get('password')?.value;
    return passwordControl && /\d/.test(passwordControl);
  }

  get passwordIncludesLetter() {
    const passwordControl = this.signupForm.get('password')?.value;
    return passwordControl && /[A-Za-z]/.test(passwordControl);
  }

  onSubmit() {

    if (this.signupForm.invalid) {
      this.isOpen = true;
      this.title = 'Error';
      this.message = 'Please fill in all fields correctly';
      this.type = 'error';
      return;
    }

    const { username, email, password, confirmPassword } =
      this.signupForm.value;

    if (password !== confirmPassword) {
      this.isOpen = true;
      this.title = 'Error';
      this.message = 'Passwords do not match';
      this.type = 'error';
      return;
    }

    this.authService.login(email).subscribe({
      next: (users) => {

        // Email already exists
        if (users.length > 0) {
          this.isOpen = true;
          this.title = 'Error';
          this.message = 'User with this email already exists';
          this.type = 'error';
          return;
        }

        // Register new user
        this.authService.register({
          id: 0,
          name: username,
          email,
          password,
          address: '',
          phone: '',
          carts: [],
          orders: []
        }).subscribe({

          next: () => {
            this.isOpen = true;
            this.title = 'Success';
            this.message = 'Registration successful';
            this.type = 'success';

            this.signupForm.reset();
          },

          error: (err) => {
            this.isOpen = true;
            this.title = 'Error';
            this.message =
              'Registration failed: ' +
              (err.error?.message || err.statusText);

            this.type = 'error';
          }

        });

      }
    });
  }

  closeAlert() {
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.type = 'success';
  }
}