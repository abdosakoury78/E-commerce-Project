import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../Model/product';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products : Product[] = [];

  constructor(private productsServie : ProductsService) {}
  ngOnInit(): void {
    this.productsServie.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  trackById(index: number, product: Product) {
    return product.id;
  }
}
