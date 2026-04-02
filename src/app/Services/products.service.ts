import { Injectable } from '@angular/core';
import { Product } from '../Model/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products : Product[] = [];
  api = "http://localhost:3000/products";

  constructor(private http : HttpClient) {}

  getProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }
}
