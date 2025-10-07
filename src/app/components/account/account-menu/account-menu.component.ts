import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css'
})
export class AccountMenuComponent {
  menuItems = [
    { label: 'Perfil', route: './profile', icon: 'fa-solid fa-user fa-lg' },
    { label: 'Mis Pedidos', route: './orders', icon: 'fa-solid fa-bag-shopping fa-lg' },
    { label: 'Direcciones', route: './addresses', icon: 'fa-solid fa-location-dot fa-lg' },
    { label: 'Métodos de Pago', route: './payment-methods', icon: 'fa-solid fa-credit-card fa-lg' }
  ];

}
