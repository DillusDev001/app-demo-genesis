import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { defaultVendedor, Producto, Resenia, Vendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { ModalService } from '../../../core/services/ui/modal.service';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';

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
    private firebaseGenesisService: FirebaseGenesisService
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
    this.addToCart.emit(this.producto);
  }

  openProductDetail() {
    this.modalService.open(ProductDetailComponent, {
      producto: this.producto
    });
  }
}