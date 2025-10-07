import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Carrito, DetalleCarrito, Usuario, defaultCarrito, defaultUsuario } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Producto, Vendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add CommonModule for *ngFor, *ngIf and RouterModule for routerLink
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // Mock data based on the provided image
  carrito: Carrito = defaultCarrito();

  router = inject(Router);
  firebaseGenesisService = inject(FirebaseGenesisService);
  notificationService = inject(NotificationService);

  usuario!: Usuario;

  taxes: number = 0;

  private readonly TAX_RATE = 0.13; // 13% IVA

  constructor() { }

  async ngOnInit() {
    const localDataLogged = getLocalDataLogged();
    this.usuario = localDataLogged && localDataLogged.usuario ? localDataLogged.usuario : defaultUsuario();

    if(this.usuario.idUsuario === ''){
      this.router.navigateByUrl('/auth')
      this.notificationService.notify('error', 'Debes estar logueado para ver tu carrito');
      return;
    }

    // get Carrito
    await this.getCarrito();

    this.calculateTotals();
  }

  async getCarrito() {
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(where('idUsuario', '==', this.usuario.idUsuario));

    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.carrito, queryConstraint);
    console.log(result)
    if (result.success && result.data) {
      this.carrito = result.data as Carrito;
      if (!this.carrito.detalle) {
        this.carrito.detalle = [];
      }
    } else {
      if (this.usuario.idUsuario !== '') {
        // CreateCarrito para idUsuario
        const cart: Carrito = {
          idUsuario: this.usuario.idUsuario,
          detalle: [],
          subtotal: 0,
          envio: 0,
          descuento: 0,
          total: 0
        }
        const create = await this.firebaseGenesisService.createDoc(environment.collection.carrito, cart);
        if (create.success) {
          this.carrito = create.data as Carrito;
        } else {
          this.notificationService.notify('error', create.message!);
        }
      } else {
        this.router.navigateByUrl('/auth')
      }
    }
  }

  calculateTotals(): void {
    /*this.subtotal = this.detalleCarrito.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.taxes = this.subtotal * this.TAX_RATE;
    this.total = this.subtotal + this.shippingCost + this.taxes;*/
  }

  incrementQuantity(index: number): void {
    /*const item = this.detalleCarrito.find(i => i.id === itemId);
    if (item) {
      item.quantity++;
      this.calculateTotals();
    }*/
  }

  decrementQuantity(index: number): void {
    /*const item = this.detalleCarrito.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.calculateTotals();
    }*/
  }

  removeItem(index: number): void {
    /*this.detalleCarrito = this.detalleCarrito.filter(i => i.id !== itemId);
    this.calculateTotals();*/
  }
}
