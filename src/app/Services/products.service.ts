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
        //   {
        // "id": 6,
        // "title": "Casual Sneakers",
        // "price": 69,
        // "categoryId": 3,
        // "image": "assets/products/sneakers.jpg",
        // "stock": 35,
        // "rating": 4.4,
        // "description": "Trendy sneakers for casual wear"
        // },
        // {
        // "id": 7,
        // "title": "Blender",
        // "price": 55,
        // "categoryId": 4,
        // "image": "assets/products/blender.jpg",
        // "stock": 20,
        // "rating": 4.2,
        // "description": "High-speed kitchen blender for smoothies and shakes"
        // },
        // {
        // "id": 8,
        // "title": "Coffee Maker",
        // "price": 120,
        // "categoryId": 4,
        // "image": "assets/products/coffee-maker.jpg",
        // "stock": 10,
        // "rating": 4.5,
        // "description": "Automatic coffee maker with programmable timer"
        // },
        // {
        // "id": 9,
        // "title": "Yoga Mat",
        // "price": 25,
        // "categoryId": 5,
        // "image": "assets/products/yoga-mat.jpg",
        // "stock": 45,
        // "rating": 4.7,
        // "description": "Eco-friendly yoga mat for home workouts"
        // },
        // {
        // "id": 10,
        // "title": "Dumbbell Set",
        // "price": 150,
        // "categoryId": 5,
        // "image": "assets/products/dumbbells.jpg",
        // "stock": 12,
        // "rating": 4.6,
        // "description": "Adjustable dumbbell set for strength training"
        // }
}
