import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Model/cart';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  constructor(private cartService : CartService) {}

  cartItems : Cart[] = [];

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((data : Cart[]) => {
      this.cartItems = data;
    })
  }

  decreaseQty(item : any) {}
  increaseQty(item : any) {}
  removeItem(item : any) {}
  calculateTotal() {return 100;}
}
