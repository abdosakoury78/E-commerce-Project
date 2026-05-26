import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../Services/cart.service';
import { AlertComponent } from '../../Components/alert/alert.component';

interface CartItem {
  product: any;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItem[] = [];

  paymentMethod: 'card' | 'cod' = 'card';

  // Alert things
  isOpen = false;
  title = '';
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';

  constructor(private cartService : CartService) {}
  form = {
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  ngOnInit() {
    // later: load from cart service / json-server
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
    if(false) {

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