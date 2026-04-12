import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../../Components/filter/filter.component';
import { Product } from '../../Model/product';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../Components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { SortingFactory } from '../../Model/sorting';
import { sortingType } from '../../Model/sortingType';

@Component({
  selector: 'app-shop',
  imports: [FilterComponent, CommonModule, PaginationComponent, CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  // sortedProducts: Product[] = [];
  pageNumber : number = 1;
  sortedSelected: sortingType = sortingType.Default;

  constructor(private productsService : ProductsService) {}
  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // this.sortedProducts = data;
      },
      error: (err) => {
        console.error("Error fetching products:", err);
      }
    })
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }

  onPageChange(page: number) {
    this.pageNumber = page;
  }

  selectSorting() {
    this.products = SortingFactory.createSorting(this.sortedSelected).selectSorting(this.products);
  }
}
