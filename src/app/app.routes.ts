import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { ShopComponent } from './Pages/shop/shop.component';
import { CartComponent } from './Pages/cart/cart.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'shop', component: ShopComponent},
    {path: 'cart', component: CartComponent}
];
