import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { OrderService } from '../../Services/order.service';
import { ProductsService } from '../../Services/products.service';
import { UserService } from '../../Services/user.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  products: any[] = [];
  loading = true;
  error = false;
  user: any = null;

  constructor(
    private orderService: OrderService,
    private productsService: ProductsService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.userService.getUser();

    if (!this.user) {
      this.loading = false;
      return;
    }

    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;

        this.orderService.getOrdersByUserId(this.user.id).subscribe({
          next: (orders) => {
            this.orders = orders.reverse();
            this.loading = false;
          },
          error: () => {
            this.error = true;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  getProduct(productId: number) {
    return this.products.find(p => p.id === productId);
  }

  getOrderTotal(order: any): number {
    let total = 0;

    for (let item of order.items) {
      const product = this.getProduct(item.productId);
      if (product) {
        total = total + (product.price * item.quantity);
      }
    }

    return total;
  }

  getPaymentLabel(order: any): string {
    if (order.paymentMethod === 'cod') {
      return 'Cash on Delivery';
    }
    return 'Card';
  }
}