
import { Component, inject, OnInit } from '@angular/core';
import { defaultProducto, defaultVendedor, Producto, Vendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { CommonModule, formatDate } from '@angular/common';
import { defaultDireccion, DetallePedido, Direccion } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { Router } from '@angular/router';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { WhatsAppService } from '../../../core/services/whatsapp.service';
import { environment } from '../../../../environments/environment';
import { orderBy, QueryConstraint, where } from '@angular/fire/firestore';
import { ProductModalComponent } from '../../../shared/product-modal/product-modal.component';
import { DateFormatMostrar } from '../../../core/utils/date.format';
import { DireccionModalComponent } from '../../../shared/direccion-modal/direccion-modal.component';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, ProductModalComponent, DireccionModalComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true
})
export class PedidosComponent implements OnInit {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private firebaseGenesisService = inject(FirebaseGenesisService);
  private whatsAppService = inject(WhatsAppService);

  collectionDetallePedido: string = environment.collection.detallepedido;
  detallePedido: DetallePedido[] = [];

  vendedor: Vendedor = defaultVendedor();
  selectedProduct: Producto = defaultProducto();
  isModalProductoOpen = false;
  
  selectedDireccion: Direccion = defaultDireccion();
  isModalDireccionOpen = false;

  constructor() { }

  ngOnInit(): void {
    const dataLogged = getLocalDataLogged();
    this.vendedor = dataLogged.vendedor ? dataLogged.vendedor : defaultVendedor();

    this.getPedidos();
  }

  async getPedidos() {
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(where('idVendedor', '==', this.vendedor.idVendedor));
    queryConstraint.push(orderBy('idPedido', 'asc'));

    const result = await this.firebaseGenesisService.busquedaQueryID(this.collectionDetallePedido, queryConstraint);
    console.log(result)
    if (result.success && result.data) {
      this.detallePedido = result.data as DetallePedido[];
    } else {
      //this.notificationService.notify('error', 'No se ha obtenido datos: ' + result.message);
    }
  }

  getLatestItemStatus(item: DetallePedido): string {
    if (item.estado.entregado) {
      return 'entregado';
    }
    if (item.estado.enviado) {
      return 'enviado';
    }
    return 'pendiente';
  }

  async onClickConfirmarEnvio(detalle: DetallePedido) {
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(where('idPedido', '==', detalle.idPedido));

    detalle.estado.enviado = formatDate(new Date(), DateFormatMostrar, 'es');

    if (await this.updateDetalleEstado(detalle)) {
      const mensajePedidoEnviado: string[] = [
        `📦 ¡Tu pedido ha sido enviado! ✨`,
        `El pedido 🆔 #${detalle.idPedido} ya está en camino 🚚`,
        `El productor ha preparado y enviado tu pedido directamente 🧑‍🌾`,
        `Pronto lo recibirás en la dirección que proporcionaste 🏡`,
        `Gracias por tu compra 🙌`
      ];

      const mensajeFinal = mensajePedidoEnviado.join(`\n`);

      this.whatsAppService.setWhatsApp({ number: detalle.usuario.whatsapp, message: mensajeFinal, media: detalle.imagen }).subscribe(result => {
        if (result.boolean) {
          this.notificationService.notify('success', 'Pedido enviado');
        } else {
          this.notificationService.notify('error', 'Error al enviar el pedido');
        }
      });
    } else {
      this.notificationService.notify('error', 'Error al actualizar el estado del pedido');
    }
  }

  async updateDetalleEstado(detalle: DetallePedido): Promise<Boolean> {
    const result = await this.firebaseGenesisService.updateDoc(this.collectionDetallePedido, detalle, detalle.id || '');
    console.log(result);

    if (result.success) {
      return true;
    } else {
      return false
    }
    //return (await this.firebaseGenesisService.updateDoc(this.collectionDetallePedido, detalle, detalle.id || '')).success;
  }

  async onClickConfirmarEntrega(detalle: DetallePedido) {
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(where('idPedido', '==', detalle.idPedido));

    detalle.estado.entregado = formatDate(new Date(), DateFormatMostrar, 'es');

    if (await this.updateDetalleEstado(detalle)) {
      const mensajePedidoEntregado: string[] = [
        `✅ ¡Tu pedido ya fue entregado! 🏡`,
        `🆔 Pedido #${detalle.idPedido}`,
        `🙌 Muchas gracias por tu confianza y preferencia.`,
        `🛍️ Te invitamos a seguir comprando en nuestra plataforma y apoyar a más productores locales.`,
        `✨ ¡Esperamos verte pronto en tu próxima compra!`
      ];
      
      const mensajeFinal = mensajePedidoEntregado.join(`\n`);

      this.whatsAppService.setWhatsApp({ number: detalle.usuario.whatsapp, message: mensajeFinal, media: detalle.imagen }).subscribe(result => {
        if (result.boolean) {
          this.notificationService.notify('success', 'Pedido enviado');
        } else {
          this.notificationService.notify('error', 'Error al enviar el pedido');
        }
      });
    } else {
      this.notificationService.notify('error', 'Error al actualizar el estado del pedido');
    }
  }

  openModalProducto(product: Producto) {
    this.selectedProduct = product;
    this.isModalProductoOpen = true;
  }

  closeModalProducto() {
    this.isModalProductoOpen = false;
    this.selectedProduct = defaultProducto();
  }

  openModalDireccion(direccion: Direccion) {
    console.log(direccion)
    this.selectedDireccion = direccion;
    this.isModalDireccionOpen = true;
  }

  closeModalDireccion() {
    this.isModalDireccionOpen = false;
    this.selectedDireccion = defaultDireccion();
  }
}
