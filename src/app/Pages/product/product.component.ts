import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Model/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Model/cart';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{

  quantity = 1;
  productId : number = 1;
  product : Product = {} as Product;
  cartItems : Cart[] = [];
  constructor(private route : ActivatedRoute,
              private productService : ProductsService,
              private cartService : CartService,
              private router : Router
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.productId = Number(params.get('id'));
        console.log("Product ID from route:", this.productId);
        this.loadProduct(this.productId);
      }
    )

    this.cartService.getCartItems().subscribe({
      next: (data) => {
        this.cartItems = data;
      }
    })
  }

  loadProduct(id : number) {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data.categoryId === undefined ? {} as Product : data;
        console.log("Product data:", this.product);
      }
    })
  }


  increaseQuantity(): void {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product, quantity: number): void {
    if (product && product.id) {
      const existingItem = this.cartItems.find(
        item => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        this.cartService.updateCartItem(existingItem.id, {
          ...existingItem,
          quantity: existingItem.quantity
        }, "increase", quantity).subscribe({
          next: (res) => {
            console.log("Cart item updated:", res);
          },
          error: (err) => {
            console.error("Error updating cart item:", err);
          }
        });
        return;
      }
      this.cartService.addToCart(product, quantity).subscribe({
        next: (res) => {
          console.log("Product added to cart:", res);
          this.cartItems.push({ product, quantity: quantity, id: res.id});
        },
        error: (err) => {
          console.error("Error adding product to cart:", err);
        }
      })
    }
  }

  goBack() {
    this.router.navigate(['/shop']);
  }
}
