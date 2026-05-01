import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../Model/product';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products : Product[] = [];

  constructor(private productsServie : ProductsService,
              private cartService : CartService) {}
  ngOnInit(): void {
    this.productsServie.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  trackById(index: number, product: Product) {
    return product.id;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe({
      next: (res) => {
        console.log("Product added to cart:", res);
      },
      error: (err) => {
        console.error("Error adding product to cart:", err);
      }
    });
  }
}
