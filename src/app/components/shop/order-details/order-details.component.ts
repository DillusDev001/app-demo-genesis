import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Carrito, Direccion, Usuario, defaultCarrito, defaultUsuario } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { getCart } from '../../../core/utils/cart.utils';
import { getSelectedAddress } from '../../../core/utils/address-storage.utils';
import { HeaderService } from '../../../core/services/header.service';
import { QrPaymentComponent } from '../qr-payment/qr-payment.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, QrPaymentComponent], // Importar QrPaymentComponent
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  carrito: Carrito = defaultCarrito();
  direccion: Direccion | null = null;
  router = inject(Router);
  headerService = inject(HeaderService);

  usuario: Usuario = defaultUsuario();
  taxes: number = 0;
  showQrPayment = false;

  TAX_RATE = 0.13; // 13% IVA

  constructor() { }

  ngOnInit() {
    this.carrito = getCart();
    this.direccion = getSelectedAddress();

    if (!this.carrito.detalle || this.carrito.detalle.length === 0) {
      this.router.navigate(['/shop/cart']);
      return;
    }

    if (!this.direccion) {
        this.router.navigate(['/shop/cart']);
        return;
    }

    this.calculateTotals();
    this.headerService.triggerAction('refreshCart');
  }

  calculateTotals(): void {
    if (this.carrito && this.carrito.detalle) {
      this.carrito.subtotal = this.carrito.detalle.reduce((acc, item) => acc + item.subtotal, 0);
      this.taxes = this.carrito.subtotal * this.TAX_RATE;
      this.carrito.total = this.carrito.subtotal + (this.carrito.envio || 0) + this.taxes - (this.carrito.descuento || 0);
    } else {
      this.carrito.subtotal = 0;
      this.carrito.total = 0;
      this.taxes = 0;
    }
  }

  confirmOrder() {
    this.showQrPayment = true;
  }

  handlePaymentConfirmation() {
    this.showQrPayment = false;
    // Aquí va la lógica para crear el pedido y el pago
    console.log('Pago confirmado. Creando pedido...');
    // this.router.navigate(['/account/orders']);
  }
}
