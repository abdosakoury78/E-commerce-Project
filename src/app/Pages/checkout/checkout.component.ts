import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  product: any;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItem[] = [];

  paymentMethod: 'card' | 'cod' = 'card';

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
    console.log('Order:', {
      form: this.form,
      payment: this.paymentMethod,
      items: this.cartItems,
      total: this.total
    });
  }
}