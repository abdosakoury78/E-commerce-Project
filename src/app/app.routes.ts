import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { ShopComponent } from './Pages/shop/shop.component';
import { CartComponent } from './Pages/cart/cart.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { CheckoutComponent } from './Pages/checkout/checkout.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { FormInformatinoComponent } from './Components/form-informatino/form-informatino.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { ProductComponent } from './Pages/product/product.component';
import { authGuard } from './Guards/auth.guard';
import { loggedGuard } from './Guards/logged.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'shop', component: ShopComponent},
    {path: 'shop/:id', component: ProductComponent},
    {path: 'cart', component: CartComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'profile', component: ProfileComponent, canActivate:[authGuard], children: [
        {path: '', component: FormInformatinoComponent, pathMatch: 'full'},
        {path: 'orders', component: OrdersComponent}
    ]}
];
