import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../../Components/filter/filter.component';
import { Product } from '../../Model/product';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [FilterComponent, CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  products: Product[] = [];

  constructor(private productsService : ProductsService) {}
  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error("Error fetching products:", err);
      }
    })
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }
}
