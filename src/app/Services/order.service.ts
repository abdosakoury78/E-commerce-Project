import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../Model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';
  constructor(private http : HttpClient) { }

  placeOrder(order : Order) {
    return this.http.post(this.apiUrl, order);
  }

  getOrdersByUserId(userId: number) {
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`);
  }
}
