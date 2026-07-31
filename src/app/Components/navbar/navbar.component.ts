import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  count = 0;
  menuOpen = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.count = count;
    });

    this.cartService.getCartCount().subscribe();

    this.cartService.loadCartCount();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    sessionStorage.removeItem('user');
    this.cartService.resetCartCount();
    this.closeMenu();
    this.router.navigate(['/home']);
  }
}