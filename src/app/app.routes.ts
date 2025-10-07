
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { AddressesComponent } from './components/account/addresses/addresses.component';
import { OrdersComponent } from './components/account/orders/orders.component';
import { PaymentMethodsComponent } from './components/account/payment-methods/payment-methods.component';
import { CartComponent } from './components/shop/cart/cart.component';
import { CategoryProductsComponent } from './components/category/category-products/category-products.component';
import { CategoryComponent } from './components/category/category.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { DashboardComponent } from './components/tienda/dashboard/dashboard.component';
import { ProductosComponent } from './components/tienda/productos/productos.component';
import { PedidosComponent } from './components/tienda/pedidos/pedidos.component';
import { PromocionesComponent } from './components/tienda/promociones/promociones.component';
import { ProductoFormComponent } from './components/tienda/producto-form/producto-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Index' },
    { path: 'auth', component: AuthComponent, title: 'Autenticación' },
    { path: 'cart', component: CartComponent, title: 'Carrito de Compras' },
    {
        path: 'categoria',
        children: [
            { path: '', component: CategoryComponent, title: 'Categorías' },
            { path: ':nombre-categoria', component: CategoryProductsComponent, title: 'Productos por Categoria' }
        ]
    },
    {
        path: 'tienda',
        component: TiendaComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, title: 'DashBoard' },
            {
                path: 'productos',
                children: [
                    { path: '', component: ProductosComponent, title: 'Productos' },
                    { path: 'nuevo', component: ProductoFormComponent, title: 'Nuevo' },
                    { path: 'editar/:id', component: ProductoFormComponent, title: 'Editar' }
                ]
            },
            { path: 'pedidos', component: PedidosComponent, title: 'Pedidos' },
            { path: 'promociones', component: PromocionesComponent, title: 'Promociones' },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: 'ofertas', component: HomeComponent, title: 'Ofertas' },
    { path: 'ayuda', component: HomeComponent, title: 'Ayuda' },
    {
        path: 'mi-cuenta',
        component: AccountComponent,
        title: 'Mi Cuenta',
        children: [
            { path: 'profile', component: ProfileComponent, title: 'Profile' },
            { path: 'addresses', component: AddressesComponent, title: 'Addresses' },
            { path: 'orders', component: OrdersComponent, title: 'Orders' },
            { path: 'payment-methods', component: PaymentMethodsComponent, title: 'Payment Methods' },
            { path: '', redirectTo: 'profile', pathMatch: 'full' }
        ]
    },
];
