import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserService } from '../../Services/user.service';
import { AuthService } from '../../Services/auth.service';
import { CartService } from '../../Services/cart.service';
import { AlertComponent } from '../../Components/alert/alert.component';

@Component({
  selector: 'app-form-informatino',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent
  ],
  templateUrl: './form-informatino.component.html',
  styleUrl: './form-informatino.component.css'
})
export class FormInformatinoComponent implements OnInit {

  apiUrl = 'http://localhost:3000/users';

  userData: any = null;

  isEditing = false;
  saving = false;
  errorMessage = '';

  profileForm!: FormGroup;

  // Alert
  isOpen = false;
  title = '';
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      address: [
        '',
        Validators.required
      ],
      phone: [
        '',
        Validators.required
      ]
    });

    this.userData = this.userService.getUser();

    if (this.userData) {
      this.profileForm.patchValue({
        name: this.userData.name,
        email: this.userData.email,
        address: this.userData.address,
        phone: this.userData.phone
      });
    }
  }

  startEdit(): void {
    this.isEditing = true;
    this.errorMessage = '';

    this.profileForm.patchValue({
      name: this.userData.name,
      email: this.userData.email,
      address: this.userData.address,
      phone: this.userData.phone
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';

    this.profileForm.patchValue({
      name: this.userData.name,
      email: this.userData.email,
      address: this.userData.address,
      phone: this.userData.phone
    });
  }

  save(): void {

    if (this.profileForm.invalid) {

      this.profileForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.errorMessage = '';
    this.saving = true;

    const updatedData = this.profileForm.value;

    this.http.patch(
      `${this.apiUrl}/${this.userData.id}`,
      updatedData
    ).subscribe({

      next: () => {

        this.userData = {
          ...this.userData,
          ...updatedData
        };

        sessionStorage.setItem(
          'user',
          JSON.stringify(this.userData)
        );

        this.isEditing = false;
        this.saving = false;

        this.showAlert(
          'success',
          'Success',
          'Your profile has been updated.'
        );
      },

      error: () => {

        this.saving = false;

        this.showAlert(
          'error',
          'Error',
          'Could not update your profile. Please try again.'
        );
      }

    });

  }

  logout(): void {
    this.authService.logout();
    this.cartService.resetCartCount();
    this.router.navigate(['/home']);
  }

  showAlert(
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string
  ): void {

    this.type = type;
    this.title = title;
    this.message = message;
    this.isOpen = true;
  }

  closeAlert(): void {
    this.isOpen = false;
  }

  get f() {
    return this.profileForm.controls;
  }

}