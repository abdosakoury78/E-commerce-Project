import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Product } from '../../Model/product';
import { Cart } from '../../Model/cart';

import { ProductsService } from '../../Services/products.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  cartItems: Cart[] = [];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    this.productsService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Products error:', err)
    });

    this.cartService.getCartItems().subscribe({
      next: (data) => this.cartItems = data,
      error: (err) => console.error('Cart error:', err)
    });
  }

  trackById(index: number, product: Product) {
    return product.id;
  }

  addToCart(product: Product) {

    const existingItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (existingItem) {

      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };

      this.cartService.updateCartItem(
        existingItem.id,
        updatedItem,
        "increase"
      ).subscribe({
        next: (res) => {
          existingItem.quantity++; // sync UI only after success
          console.log("Cart updated:", res);
        },
        error: (err) => console.error("Update error:", err)
      });

      return;
    }

    this.cartService.addToCart(product, 1).subscribe({
      next: (res) => {
        this.cartItems.push({
          id: res.id,
          product,
          quantity: 1
        });

        console.log("Product added:", res);
      },
      error: (err) => console.error("Add error:", err)
    });
  }
}