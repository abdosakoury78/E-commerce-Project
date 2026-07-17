import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../Services/cart.service';
import { AlertComponent } from '../../Components/alert/alert.component';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { User } from '../../Model/user';

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

  cartItems: CartItem[] = [];
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
              private userService : UserService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],

      city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],

      cardNumber: [''],
      expiry: [''],
      cvv: ['']
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
      if (this.userData) {
        // this.userData.order.push({
        //   name: this.form.value.name,
        //   email: this.form.value.email,
        //   address: this.form.value.address,
        //   city: this.form.value.city,
        //   zip: this.form.value.zip,
        //   country: this.form.value.country,
        //   paymentMethod: this.paymentMethod,
        //   cardNumber: this.paymentMethod === 'card' ? this.form.value.cardNumber : undefined,
        //   expiry: this.paymentMethod === 'card' ? this.form.value.expiry : undefined,
        // });
        // this.userData.cart.forEach((cartItem) => {
        //   this.cartService.deleteCartItem(cartItem.id, cartItem.quantity).subscribe();
        // })
        // this.userData.cart = [];
        // this.isOpen = true;
        // this.type = 'success';
        // this.title = "Success";
        // this.message = "Your order has been placed successfully!";
      }
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
}