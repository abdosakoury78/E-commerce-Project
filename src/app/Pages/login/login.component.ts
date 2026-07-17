import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../Services/auth.service';
import { AlertComponent } from "../../Components/alert/alert.component";
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Model/cart';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  cartItems : Cart[] = [];

  // alert properties
  isOpen = false;
  title = '';
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';

  constructor(private formBuilder: FormBuilder, private authService : AuthService, private router : Router, private cartService : CartService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]]
    })
  }
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((data : Cart[]) => {
      this.cartItems = data;
    })
  }

  get disabled() {
    return this.loginForm.invalid;
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(email).subscribe({
      next: (res) => {

        if (res.length === 0) {
          this.title = 'Error';
          this.message = 'User not found';
          this.type = 'error';
          this.isOpen = true;
          return;
        }
        if (res[0].password === password) {
          const user = { ...res[0]};
          delete user.password;
          sessionStorage.setItem('user', JSON.stringify(user));

          this.title = 'Success';
          this.message = 'Login successful!';
          this.type = 'success';
          this.isOpen = true;
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        } else {
          this.title = 'Error';
          this.message = 'Incorrect password';
          this.type = 'error';
          this.isOpen = true;
        }
      },

      error: () => {
        this.title = 'Error';
        this.message = 'Something went wrong';
        this.type = 'error';
        this.isOpen = true;
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