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
import { Cart } from '../../Model/cart';
import { User } from '../../Model/user';
import { UserService } from '../../Services/user.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  imports: [FilterComponent, CommonModule, PaginationComponent, CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  newProducts: Product[] = [];
  cartItems: Cart[] = [];
  pageNumber : number = 1;
  sortedSelected: sortingType = sortingType.Default;
  categories : Category[] = [];
  selectedCategories: string[] = [];
  selectedRating: number[] = [];
  selectedInStock: boolean = false;
  userData : User | null = null;

  constructor(private productsService : ProductsService,
              private cartService : CartService,
              private userService : UserService,
              private authService : AuthService,
              private router : Router
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
    if(this.authService.isLoggedIn()) {
      this.userData = this.userService.getUser();
    }
    this.cartService.getCartItems().subscribe({
        next: (data) => {
          this.cartItems = data;
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

    const existingItem = this.cartItems.find(
      item => item.product.id === product.id
    );
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

  goToProductDetails(productId: number) {
    this.router.navigate(['/shop', productId]);
  }
}
