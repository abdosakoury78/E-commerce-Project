import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Product } from '../../Model/product';
import { Cart } from '../../Model/cart';

import { ProductsService } from '../../Services/products.service';
import { CartService } from '../../Services/cart.service';
import { UserService } from '../../Services/user.service';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Model/user';
import { AlertComponent } from '../../Components/alert/alert.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, AlertComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  cartItems: Cart[] = [];
  userData : User | null = null;
  // Alert things
  isOpen = false;
  title = '';
  message = '';
  type: 'success' | 'error' | 'warning' = 'success';
  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private authService : AuthService,
    private userService : UserService,
    private router : Router
  ) {}

  ngOnInit(): void {

    this.productsService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Products error:', err)
    });

    if(this.authService.isLoggedIn()) {
      this.userData = this.userService.getUser();
    }else {
      this.cartService.getCartItems().subscribe({
        next: (data) => {
          this.cartItems = data;
        }
      })
    }
  }

  trackById(index: number, product: Product) {
    return product.id;
  }

  addToCart(product: Product) {

    const existingItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if(existingItem && existingItem.quantity >= product.stock) {
      this.isOpen = true;
      this.title = 'Error';
      this.message = 'Cannot add more items than available in stock.';
      this.type = 'error';
      return;
    }
      if (existingItem) {
        this.cartService.updateCartItem(existingItem.id, {
          ...existingItem,
          quantity: ++existingItem.quantity
        }, "increase").subscribe({
          next: (res) => {
            console.log("Cart item updated:", res);
          },
          error: (err) => {
            console.error("Error updating cart item:", err);
          }
        });
        return;
      }

      this.cartService.addToCart(product, 1).subscribe({
        next: (res) => {
          console.log("Product added to cart:", res);
          this.cartItems.push({ product, quantity: 1, id: res.id});
        },
        error: (err) => {
          console.error("Error adding product:", err);
        }
      });
  }


  goToProductDetails(productId: number) {
    this.router.navigate(['/shop', productId]);
  }

  closeAlert() {
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.type = 'success';
  }
}