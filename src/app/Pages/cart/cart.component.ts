import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Model/cart';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { User } from '../../Model/user';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  constructor(private cartService : CartService,
              private authService : AuthService,
              private userService : UserService
  ) {}

  cartItems : Cart[] = [];
  userData : User | null = null;
  increaseCart : boolean = false;
  decreaseCart : boolean = false;
  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.userData = this.userService.getUser();
    }
    this.cartService.getCartItems().subscribe((data : Cart[]) => {
        this.cartItems = data;
      })
  }

  decreaseQty(item: Cart) {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;

      this.cartService.updateCartItem(item.id, {
        ...item,
        quantity: newQty
      }, "decrease").subscribe({
        next: () => item.quantity = newQty,
        error: err => console.error(err)
      });

    } else {
      this.removeItem(item);
    }
  }

  increaseQty(item: Cart) {
    const newQty = item.quantity + 1;

    this.cartService.updateCartItem(item.id, {
      ...item,
      quantity: newQty
    }, "increase").subscribe({
      next: () => item.quantity = newQty,
      error: err => console.error(err)
    });
  }

  removeItem(item: Cart) {
    console.log('Removing item:', item);

    this.cartService.deleteCartItem(item.id, item.quantity)
      .subscribe({
        next: () => {
          console.log('Deleted:', item.id);
          this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
        }
      });
  }

  calculateTotal() {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);
  }
}
