
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto, Vendedor, defaultVendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductosComponent {
  vendedor: Vendedor = defaultVendedor();
  dataProductos: Producto[] = [];

  private firebaseGenesisService = inject(FirebaseGenesisService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    const dataLogged = getLocalDataLogged();
    this.vendedor = dataLogged.vendedor ? dataLogged.vendedor : defaultVendedor();

    this.getProductosVendedor();
  }

  async getProductosVendedor() {
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(where('vendedorId', '==', this.vendedor.idVendedor));

    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.producto, queryConstraint);

    if (result.success && result.data) {
      this.dataProductos = result.data as Producto[];
    } else {
      this.notificationService.notify('error', result.message!);
    }
  }

  irAFormularioProducto() {
    this.router.navigate(['/tienda/productos/nuevo']);
  }
}
