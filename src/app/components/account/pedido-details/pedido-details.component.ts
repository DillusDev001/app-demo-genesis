import { Component, inject, OnInit } from '@angular/core';
import { Pedido, defaultPedido, DetallePedido, defaultDetallePedido } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { orderBy, QueryConstraint, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-pedido-details',
  imports: [CommonModule],
  templateUrl: './pedido-details.component.html',
  styleUrls: ['./pedido-details.component.css']
})
export class PedidoDetailsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private firebaseGenesisService = inject(FirebaseGenesisService);

  pedido: Pedido = defaultPedido();
  detallePedido: DetallePedido[] = [];

  collectionPedido: string = environment.collection.pedido;
  collectionDetallePedido: string = environment.collection.detallepedido;

  isLoading: boolean = false;

  constructor() { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.getPedido(id);
      await this.getDetallePedido(id);
    }
  }

  async getPedido(id: string) {
    const result = await this.firebaseGenesisService.findDocByField(this.collectionPedido, 'idPedido', id);

    if (result.success && result.data) {
      this.pedido = result.data as Pedido;
    } else {
      this.notificationService.notify('error', 'no se a podido obtener el pedido: ' + result.message);
    }
  }

  async getDetallePedido(id: string) {
    const queryConstraint: QueryConstraint[] = [];
    queryConstraint.push(where('idPedido', '==', this.pedido.idPedido));
    queryConstraint.push(orderBy('sec', 'asc'));

    const result = await this.firebaseGenesisService.busquedaQuery(this.collectionDetallePedido, queryConstraint);

    if (result.success && result.data) {
      this.detallePedido = result.data as DetallePedido[];
    } else {
      this.notificationService.notify('error', 'no se a podido obtener el detalle del pedido: ' + result.message);
    }
  }

  /**
   * Devuelve el estado más reciente de un artículo del pedido.
   * @param item El detalle del pedido.
   * @returns 'entregado', 'enviado' o 'pendiente'.
   */
  getLatestItemStatus(item: DetallePedido): string {
    if (item.estado.entregado) {
      return 'entregado';
    }
    if (item.estado.enviado) {
      return 'enviado';
    }
    return 'pendiente'; // Estado por defecto
  }
}
