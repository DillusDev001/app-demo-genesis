import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { defaultUsuario, Pedido, Usuario } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';
import { where } from '@angular/fire/firestore';
import { SkeletonOrderItemComponent } from '../../../shared/skeleton-order-item/skeleton-order-item.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, SkeletonOrderItemComponent, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  pedidos: Pedido[] = [];
  isLoading: boolean = false;
  usuario!: Usuario;

  private firebaseGenesisService = inject(FirebaseGenesisService);

  ngOnInit(): void {
    const localData = getLocalDataLogged();
    this.usuario = localData.usuario ? localData.usuario : defaultUsuario();
    this.loadPedidos();
  }

  async loadPedidos(): Promise<void> {
    if (!this.usuario.idUsuario) {
      return;
    }

    this.isLoading = true;
    const constraints = [where('idUsuario', '==', this.usuario.idUsuario)];
    const result = await this.firebaseGenesisService.busquedaQuery<Pedido[]>(environment.collection.pedido, constraints);

    if (result.success && result.data) {
      this.pedidos = result.data;
    } else {
      console.error("Error fetching orders:", result.message);
      this.pedidos = [];
    }
    this.isLoading = false;
  }
}
