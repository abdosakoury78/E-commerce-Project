import { Injectable } from '@angular/core';
import { Product } from '../Model/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../Model/Category';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products : Product[] = [];
  api = "http://localhost:3000/products";
  apiUrl = "http://localhost:3000/categories";

  constructor(private http : HttpClient) {}

  getProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
