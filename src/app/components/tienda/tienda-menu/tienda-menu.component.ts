
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tienda-menu',
  templateUrl: './tienda-menu.component.html',
  styleUrls: ['./tienda-menu.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class TiendaMenuComponent {
  menuItems = [
    { label: 'Dashboard', route: '/tienda/dashboard', icon: 'fa-solid fa-chart-pie fa-lg' },
    { label: 'Productos', route: '/tienda/productos', icon: 'fa-brands fa-product-hunt fa-lg' },
    { label: 'Pedidos', route: '/tienda/pedidos', icon: 'fa-solid fa-truck fa-lg' },
    { label: 'Promociones', route: '/tienda/promociones', icon: 'fa-solid fa-rectangle-ad fa-lg' }
  ];
}