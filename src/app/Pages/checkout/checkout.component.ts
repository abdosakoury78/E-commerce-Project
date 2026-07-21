import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../Services/cart.service';
import { AlertComponent } from '../../Components/alert/alert.component';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { User } from '../../Model/user';
import { OrderService } from '../../Services/order.service';
import { Order } from '../../Model/order';
import { Router } from '@angular/router';
import { Cart } from '../../Model/cart';

interface CartItem {
  product: any;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cartItems: Cart[] = [];
  form : FormGroup;
  paymentMethod: 'card' | 'cod' = 'card';
  userData : User | null = null;
  // Alert things
  isOpen = false;
  title = '';
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';

  constructor(private cartService : CartService,
              private fb : FormBuilder,
              private authService : AuthService,
              private userService : UserService,
              private orderService : OrderService,
              private router : Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],

      city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],

      cardNumber: ['', [Validators.pattern(/^\d{16}$/), Validators.required]],
      expiry: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), Validators.required]],
      cvv: ['', [Validators.pattern(/^\d{3}$/), Validators.required]]
    });
  }

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.userData = this.userService.getUser();
      this.form.patchValue({
        name: this.userData?.name,
        email: this.userData?.email,
        address: this.userData?.address
      });
    }
    this.cartService.getCartItems().subscribe({
        next : (data) => {
          this.cartItems = data;
        }
      })
  }

  selectPayment(method: 'card' | 'cod') {
    this.paymentMethod = method;
  }

  get total(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  placeOrder() {
    if(this.authService.isLoggedIn()) {
      if(this.paymentMethod === 'card' && (this.form.get('cardNumber')?.invalid || this.form.get('expiry')?.invalid || this.form.get('cvv')?.invalid)) {
        this.isOpen = true;
        this.type = 'error';
        this.title = "Error";
        this.message = "Please fill in all card details correctly";
        return;
      }
      if(this.form.get('address')?.invalid || this.form.get('zip')?.invalid || this.form.get('country')?.invalid || this.form.get('city')?.invalid) {
        this.isOpen = true;
        this.type = 'error';
        this.title = "Error";
        this.message = "Please fill in all the form details";
        return;
      }
      const order : Order = {
        userId: this.userData?.id,
        name: this.form.get('name')?.value,
        email: this.form.get('email')?.value,
        address: this.form.get('address')?.value,
        city: this.form.get('city')?.value,
        zip: this.form.get('zip')?.value,
        country: this.form.get('country')?.value,
        paymentMethod: this.paymentMethod,
        cardNumber: this.form.get('cardNumber')?.value,
        expiry: this.form.get('expiry')?.value,
        cvv: this.form.get('cvv')?.value,
        items: this.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }

      this.orderService.placeOrder(order).subscribe({
        next: (res) => {
          this.isOpen = true;
          this.type = 'success';
          this.title = "Success";
          this.message = "Order placed successfully";
        },
        error: (err) => {
          this.isOpen = true;
          this.type = 'error';
          this.title = "Error";
          this.message = "Failed to place order. Please try again.";
        },
        complete: () => {
          this.form.reset();
          this.clearCart();
        }
      })
    }else {
      this.isOpen = true;
      this.type = 'error';
      this.title = "Error";
      this.message = "You're not Logged In";
    }
  }

  closeAlert() {
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.type = 'success';
  }

  clearCart() {
    this.cartItems.forEach(item => {
      this.cartService.deleteCartItem(item.id, item.quantity)
        .subscribe({
          next: () => {
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
          }
        });
    })
    this.cartService.resetCartCount();
  }
}