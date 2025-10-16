
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Carrito, Direccion, Usuario, defaultCarrito, defaultUsuario } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { getCart, setCart, deleteCart } from '../../../core/utils/cart.utils';
import { HeaderService } from '../../../core/services/header.service';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';
import { ModalService } from '../../../core/services/ui/modal.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, AddressSelectorComponent], 
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  carrito: Carrito = defaultCarrito();
  router = inject(Router);
  firebaseGenesisService = inject(FirebaseGenesisService);
  notificationService = inject(NotificationService);
  headerService = inject(HeaderService);
  modalService = inject(ModalService);

  usuario: Usuario = defaultUsuario();
  taxes: number = 0;

  TAX_RATE = 0.13; // 13% IVA

  constructor() { }

  async ngOnInit() {
    const localData = getLocalDataLogged();

    if (localData && localData.usuario) {
      this.usuario = localData.usuario;
      await this.syncAndLoadCart();
    } else {
      this.carrito = getCart();
    }

    if (!this.carrito.detalle) {
      this.carrito.detalle = [];
    }
    this.calculateTotals();
    this.headerService.triggerAction('refreshCart');
  }

  async syncAndLoadCart() {
    const localCart = getCart();
    const fbResult = await this.firebaseGenesisService.findDocByField(environment.collection.carrito, 'idUsuario', this.usuario.idUsuario);
    let firebaseCart!: Carrito;

    if (fbResult.success && fbResult.data) {
      firebaseCart = fbResult.data as Carrito;
      if (!firebaseCart.detalle) firebaseCart.detalle = [];
    }

    if (firebaseCart && localCart.detalle.length > 0) {
      localCart.detalle.forEach(localItem => {
        const existingItemIndex = firebaseCart!.detalle.findIndex(fbItem => fbItem.idProducto === localItem.idProducto);
        if (existingItemIndex > -1) {
          firebaseCart!.detalle[existingItemIndex].cantidad += localItem.cantidad;
          firebaseCart!.detalle[existingItemIndex].subtotal = firebaseCart!.detalle[existingItemIndex].cantidad * firebaseCart!.detalle[existingItemIndex].precioUnitario;
        } else {
          firebaseCart!.detalle.push(localItem);
        }
      });
      this.carrito = firebaseCart as Carrito;
      await this.saveCartChanges(true);
    } else if (firebaseCart) {
      this.carrito = firebaseCart;
      setCart(this.carrito);
    } else if (!firebaseCart && localCart.detalle.length > 0) {
      localCart.idUsuario = this.usuario.idUsuario;
      this.carrito = localCart;
      await this.createFirebaseCart(this.carrito);
    } else {
      const newCart = defaultCarrito();
      newCart.idUsuario = this.usuario.idUsuario;
      this.carrito = newCart;
      await this.createFirebaseCart(this.carrito);
    }
  }

  async createFirebaseCart(cart: Carrito) {
    const create = await this.firebaseGenesisService.createDoc(environment.collection.carrito, cart);
    if (create.success) {
      setCart(cart);
    } else {
      this.notificationService.notify('error', create.message!);
    }
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

  incrementQuantity(index: number): void {
    const item = this.carrito.detalle[index];
    item.cantidad++;
    item.subtotal = item.cantidad * item.precioUnitario;
    this.saveCartChanges();
  }

  decrementQuantity(index: number): void {
    const item = this.carrito.detalle[index];
    if (item.cantidad > 1) {
      item.cantidad--;
      item.subtotal = item.cantidad * item.precioUnitario;
      this.saveCartChanges();
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number): void {
    this.carrito.detalle.splice(index, 1);
    this.saveCartChanges();
  }

  private async saveCartChanges(forceFirebaseSave: boolean = false) {
    this.calculateTotals();
    setCart(this.carrito);
    this.headerService.triggerAction('refreshCart');

    if ((this.usuario && this.usuario.idUsuario) || forceFirebaseSave) {
      try {
        await this.firebaseGenesisService.updateDoc(environment.collection.carrito, this.carrito, this.usuario.idUsuario);
        if (forceFirebaseSave) deleteCart();
      } catch (error) {
        console.error("Error updating cart in Firestore: ", error);
        this.notificationService.notify('error', 'No se pudo sincronizar el carrito con la nube.');
      }
    }
  }

  async proceedToCheckout(): Promise<void> {
    if (!this.usuario.idUsuario) {
      this.notificationService.notify('warning', 'Por favor, inicia sesión para continuar');
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      const response = await this.modalService.open(AddressSelectorComponent);
      
      if (response && response.bool) { // Corregido
        this.router.navigate(['/shop/order-details']);
        this.modalService.close();
      } else {
        this.modalService.close();
        console.log('Selección de dirección cancelada o cerrada.');
      }
    } catch (error) {
      this.modalService.close();
      console.error('Error al abrir el modal de selección de dirección', error);
      this.notificationService.notify('error', 'Hubo un problema al intentar seleccionar la dirección.');
    }
  }
}
