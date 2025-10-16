import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Carrito, DetallePedido, Direccion, Pedido, Usuario, defaultCarrito, defaultUsuario } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { getCart, setCart } from '../../../core/utils/cart.utils';
import { getSelectedAddress } from '../../../core/utils/address-storage.utils';
import { HeaderService } from '../../../core/services/header.service';
import { QrPaymentComponent } from '../qr-payment/qr-payment.component';
import { EmitterResponse } from '../../../core/interfaces/emitter-response.interface';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { DataLocalStorage } from '../../../core/interfaces/local/data-local-storage';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { WhatsAppService } from '../../../core/services/whatsapp.service';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';
import { DateFormatMostrar } from '../../../core/utils/date.format';
import { Pago } from '../../../core/interfaces/app/comprador/pago.interface';
import { ApiBody } from '../../../core/interfaces/api/api-body.interface';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, QrPaymentComponent], // Importar QrPaymentComponent
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  private notificationService = inject(NotificationService);

  carrito: Carrito = defaultCarrito();
  direccion: Direccion | null = null;

  usuario: Usuario = defaultUsuario();
  taxes: number = 0;
  showQrPayment = false;

  TAX_RATE = 0.13; // 13% IVA

  isLoading: boolean = false;
  comprador!: Usuario;

  collectionPedido: string = environment.collection.pedido;
  collectionDetallePedido: string = environment.collection.detallepedido;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private firebaseGenesisService = inject(FirebaseGenesisService);
  private whatsAppService = inject(WhatsAppService);
  private headerService = inject(HeaderService);

  idPedido: string = "";

  constructor() { }

  async ngOnInit() {
    const data: DataLocalStorage = getLocalDataLogged();
    this.comprador = data.usuario ? data.usuario : defaultUsuario();

    this.idPedido = this.firebaseGenesisService.generateUUID(this.collectionPedido);

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

  handlePaymentConfirmation(event: EmitterResponse) {
    if (event.bool) {
      this.showQrPayment = false;
      this.isLoading = true;

      const mensajePagoConfirmado: string[] = [
        `💰 ¡Pago confirmado! ✅`,
        `Hemos recibido correctamente el pago correspondiente al pedido 🆔 #${this.idPedido}.`,
        `Muchas gracias por tu confianza 🙌`,
        `Pronto recibirás actualizaciones sobre el envío 🚚✨`
      ];

      const mensajeFinal = mensajePagoConfirmado.join('\n');

      this.whatsAppService.setWhatsApp({ number: this.comprador.whatsapp, message: mensajeFinal }).subscribe(result => {
        console.log(result)
        this.createPedido(event.data);
      });
    } else {
      this.notificationService.notify('warning', 'Pago Cancelado')
      this.showQrPayment = false;
    }
  }
  async createPedido(pago: Pago) {
    const fecha:string = formatDate(new Date(), DateFormatMostrar, 'es');

    let nroVendedor: ApiBody[] = [];

    let detalle: DetallePedido[] = [];

    // Generar Detalle Pedido desde carrito
    this.carrito.detalle.forEach((element, i) => {
      const data: DetallePedido = {
        idPedido: this.idPedido,
        idProducto: element.idProducto,
        sec: i,
        idVendedor: element.idVendedor,
        cantidad: element.cantidad,
        precioUnitario: element.precioUnitario,
        subtotal: element.subtotal,
        imagen: element.imagen,
        estado: {
          pendiente: formatDate(new Date(), DateFormatMostrar, 'es'),
          enviado: '',
          entregado: ''
        },
        fecha,
        producto: element.producto,
        usuario: this.comprador,
        direccion: this.direccion!
      }

      if (!nroVendedor.some(item => item.number === element.producto.vendedor.whatsapp)) {
        const mensajesAlternativos: string[][] = [
          [
            `¡Hola ${element.producto.vendedor.beneficiario}! 😄🙌`,
            `🎉 ¡Tienes un nuevo pedido listo para gestionar! 🛒📦✨`,
            `🆔 Número de pedido: #${this.idPedido}`,
            `Primero prepara el producto y luego realiza el envío 🚚💨.`,
            `Asegúrate de que llegue al cliente 🏡✅.`,
            `¡Gracias por tu esfuerzo y compromiso! 🌱💪🔥`
          ],
          [
            `¡Hola ${element.producto.vendedor.beneficiario}! 👋😎`,
            `📢 Se ha generado un nuevo pedido 📦✨`,
            `🆔 Número de pedido: #${this.idPedido}`,
            `Por favor, prepara el producto y procede con el envío 🚚📍.`,
            `No olvides confirmar la entrega al cliente 🏡🙌.`,
            `¡Tu trabajo marca la diferencia! 💪✨`
          ]
        ];

        const mensajeSeleccionado = mensajesAlternativos[Math.floor(Math.random() * mensajesAlternativos.length)];
        const mensajeFinalAleatorio = mensajeSeleccionado.join('\n');

        nroVendedor.push({
          number: element.producto.vendedor.whatsapp,
          message: mensajeFinalAleatorio
        });
      }

      detalle.push(data);
    });

    // Generar Pedido
    const pedido: Pedido = {
      idPedido: this.idPedido,
      idUsuario: this.comprador.idUsuario,
      fecha,
      estado: 'pagado',
      subtotal: this.carrito.subtotal,
      envio: this.carrito.envio,
      descuento: this.carrito.descuento,
      total: this.carrito.total,
      codDescuento: '',
      idDireccion: this.direccion?.idDireccion || '',
      idPago: pago.idPago,

      direccion: this.direccion,
      pago: pago,
      detalle
    }

    // Guardar Pedido en DB
    const boolPedido = await this.agregarPedido(pedido);
    const boolDetalle = await this.agregarDetallePedido(detalle);

    if (boolPedido && boolDetalle) {
      this.notificationService.notify('success', 'Pedido Confirmado.');

      // Enviar mensaje a los Vendedores con reporte a 59178124224
      this.whatsAppService.setWhatsAppBatch(nroVendedor, '59178124224').subscribe(result => {
        this.vaciarCarrito();
      });

    } else {
      this.notificationService.notify('error', 'Algo pasó al crear el pedido.');
    }
  }

  async agregarPedido(pedido: Pedido): Promise<boolean> {
    const result = await this.firebaseGenesisService.createDocWithID(this.collectionPedido, pedido.idPedido, pedido);

    return result.success;
  }

  async agregarDetallePedido(detalle: DetallePedido[]): Promise<boolean> {
    const result = await this.firebaseGenesisService.multipleCreate(this.collectionDetallePedido, detalle);

    return result.success;
  }

  async vaciarCarrito() {
    // Elimnar Cart Firebase DB
    const result = await this.firebaseGenesisService.deleteDoc(environment.collection.carrito, this.carrito.idCarrito);
    console.log(result)
    if (result.success) {
      // Vaciar Cart localStorage
      const _cart: Carrito = {
        ...defaultCarrito(),
        idCarrito: this.firebaseGenesisService.generateUUID(environment.collection.carrito)
      }
      setCart(_cart);

      this.headerService.triggerAction('refreshCart');

      this.router.navigate(['/mi-cuenta/orders']);
    } else {
      console.log(result)
    }
  }
}
