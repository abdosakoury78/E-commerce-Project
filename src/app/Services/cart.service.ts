import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../Model/product';
import { Cart } from '../Model/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private api = "http://localhost:3000/cart";

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private httpclient: HttpClient) {}

  addToCart(product: Product, quantity: number): Observable<any> {
    const cartItem = { product, quantity };
    const previous = this.cartCountSubject.value;

    this.cartCountSubject.next(previous + 1);

    return this.httpclient.post(this.api, cartItem).pipe(
      catchError(err => {
        this.cartCountSubject.next(previous);
        return throwError(() => err);
      })
    );
  }

  getCartItems(): Observable<any> {
    return this.httpclient.get(this.api);
  }


  getCartCount(): Observable<number> {
    return this.cartCount$;
  }


  resetCartCount() {
    this.cartCountSubject.next(0);
  }


  updateCartItem(id: number, data: Cart, type: string) {
    const previous = this.cartCountSubject.value;

    const newValue =
      type === 'increase' ? previous + 1 : previous - 1;

    this.cartCountSubject.next(newValue);

    return this.httpclient.patch(`http://localhost:3000/cart/${id}`, data).pipe(
      catchError(err => {
        this.cartCountSubject.next(previous);
        return throwError(() => err);
      })
    );
  }

  deleteCartItem(id: number, quantity : number) {
    let currentCount = this.cartCountSubject.value;
    this.cartCountSubject.next(currentCount - quantity);
    return this.httpclient.delete(`http://localhost:3000/cart/${id}`);
  }

  loadCartCount() {
    this.getCartItems().subscribe(items => {
      const count = items.reduce((sum : number, item : Cart) => sum + item.quantity, 0);
      this.cartCountSubject.next(count);
    });
  }
}




