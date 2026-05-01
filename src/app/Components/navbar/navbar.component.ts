import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  count = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartCount().subscribe(count => {
      this.count = count;
    });
  }
}