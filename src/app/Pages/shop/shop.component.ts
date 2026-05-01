import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../../Components/filter/filter.component';
import { Product } from '../../Model/product';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../Components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { SortingFactory } from '../../Model/sorting';
import { sortingType } from '../../Model/sortingType';
import { CartService } from '../../Services/cart.service';
import { Category } from '../../Model/Category';

@Component({
  selector: 'app-shop',
  imports: [FilterComponent, CommonModule, PaginationComponent, CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  newProducts: Product[] = [];
  pageNumber : number = 1;
  sortedSelected: sortingType = sortingType.Default;
  categories : Category[] = [];
  selectedCategories: string[] = [];
  selectedRating: number[] = [];
  selectedInStock: boolean = false;

  constructor(private productsService : ProductsService,
              private cartService : CartService
  ) {}
  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.newProducts = data;
      },
      error: (err) => {
        console.error("Error fetching products:", err);
      }
    })
    this.productsService.getCategories().subscribe( {
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error("Error fetching categories:", err);
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
    this.newProducts = SortingFactory.createSorting(this.sortedSelected).selectSorting(this.products);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe({
      next: (res) => {
        console.log("Product added to cart:", res);
      },
      error: (err) => {
        console.error("Error adding product to cart:", err);
      }
    })
  }

  filter(input: HTMLInputElement) {
    const id = input.id;

    // CATEGORY
    if (['electronics', 'accessories', 'footwear', 'home', 'sports'].includes(id)) {
      if (input.checked) {
        this.selectedCategories.push(id);
      } else {
        this.selectedCategories = this.selectedCategories.filter(c => c !== id);
      }
    }

    // RATING
    if (id.startsWith('rating')) {
      if (input.checked) {
        this.selectedRating.push(Number(id.replace('rating', '')));
      } else {
        this.selectedRating = this.selectedRating.filter(r => r !== Number(id.replace('rating', '')));
      }
    }

    // STOCK
    if (id === 'inStock') {
      this.selectedInStock = input.checked;
    }

    this.applyFilters();
  }

  applyFilters() {
    this.newProducts = this.products.filter(product => {

      // Category
      const categoryName = this.categories
        .find(c => c.id === product.categoryId)
        ?.name.toLowerCase();
        console.log(categoryName);

      const categoryMatch =
        this.selectedCategories.length === 0 ||
        this.selectedCategories.includes(categoryName || '');

      // Rating
      const ratingMatch =
        this.selectedRating.length === 0 ||
        this.selectedRating.some(r => product.rating >= r);

      // Stock
      const stockMatch =
        !this.selectedInStock || product.stock > 0;

      return categoryMatch && ratingMatch && stockMatch;
    });
  }

  resetFilters() {
    this.selectedCategories = [];
    this.selectedRating = [];
    this.selectedInStock = false;
    this.newProducts = this.products;
  }
}
