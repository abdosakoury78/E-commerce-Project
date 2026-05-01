import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { Product } from '../Model/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private api = "http://localhost:3000/cart";

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private httpclient: HttpClient) {}

  addToCart(product: Product, quantity: number) {
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

  getCartCount() {
    return this.cartCount$;
  }
}

function throwError(arg0: () => any): any {
  throw new Error('Function not implemented.');
}
