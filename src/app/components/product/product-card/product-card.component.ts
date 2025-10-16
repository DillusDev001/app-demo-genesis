import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { defaultVendedor, Producto, Resenia, Vendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { ModalService } from '../../../core/services/ui/modal.service';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { getCart, setCart } from '../../../core/utils/cart.utils';
import { Carrito, DetalleCarrito } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() producto!: Producto;
  @Output() addToCart = new EventEmitter<Producto>();

  constructor(
    private modalService: ModalService,
    private firebaseGenesisService: FirebaseGenesisService,
    private headerService: HeaderService // Inyectar HeaderService
  ) { }

  async ngOnInit() {
    if (!this.producto?.idProducto) {
      return;
    }

    // Get Vendedor
    const vendedorResult = await this.firebaseGenesisService.findDocByField(environment.collection.vendedor, 'idVendedor', this.producto.idVendedor);
    
    if (vendedorResult.success && vendedorResult.data) {
      this.producto.vendedor = vendedorResult.data as Vendedor;
    } else {
      this.producto.vendedor = defaultVendedor();
    }

    // Get Resenias
    const queryConstraints: QueryConstraint[] = [where('idProducto', '==', this.producto.idProducto)];
    const reseniaResult = await this.firebaseGenesisService.busquedaQuery(environment.collection.resenia, queryConstraints);

    if (reseniaResult.success && reseniaResult.data) {
      const dataResenias = reseniaResult.data as Resenia[];
      const suma = dataResenias.reduce((sum, resenia) => sum + resenia.puntuacion, 0);
      const puntuacion = dataResenias.length > 0 ? suma / dataResenias.length : 0;
      this.producto.puntuacion = parseFloat(puntuacion.toFixed(2));
      this.producto.resenias = dataResenias.length > 0 ? dataResenias.length : 0;
    } else {
      this.producto.puntuacion = 0;
      this.producto.resenias = 0;
    }
  }

  agregarAlCarrito() {
    const cart: Carrito = getCart();

    const itemIndex = cart.detalle.findIndex(item => item.idProducto === this.producto.idProducto);

    if (itemIndex > -1) {
      // El producto ya está en el carrito, se incrementa la cantidad
      cart.detalle[itemIndex].cantidad++;
      cart.detalle[itemIndex].subtotal = cart.detalle[itemIndex].cantidad * cart.detalle[itemIndex].precioUnitario;
    } else {
      // El producto no está en el carrito, se agrega
      const nuevoDetalle: DetalleCarrito = {
        idProducto: this.producto.idProducto,
        sec: 0, // Puedes ajustar esto si es necesario
        idVendedor: this.producto.idVendedor,
        cantidad: 1,
        precioUnitario: this.producto.precio,
        subtotal: this.producto.precio,
        imagen: this.producto.imagenDestacada,
        producto: this.producto
      };
      cart.detalle.push(nuevoDetalle);
    }

    // Recalcular totales del carrito
    cart.subtotal = cart.detalle.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal; // Asumiendo que no hay envío ni descuento por ahora

    setCart(cart);

    // Actualizar el contador del carrito en el header
    this.headerService.triggerAction('refreshCart');
  }

  openProductDetail() {
    this.modalService.open(ProductDetailComponent, {
      producto: this.producto
    });
  }
}
