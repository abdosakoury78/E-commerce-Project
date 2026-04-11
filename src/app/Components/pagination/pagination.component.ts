import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../Services/products.service';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  currentPage: number = 1;
  totalPages!: number; // Example total pages, you can set this dynamically
  totalPagesArray: number[] = [];
  @Output() pageNumber = new EventEmitter<number>();

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(products => {
      this.totalPages = Math.ceil(products.length / 6); // Assuming 6 products per page
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    })
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageNumber.emit(this.currentPage);
    }
  }
}
