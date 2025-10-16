import { Component, OnInit } from "@angular/core";
import { QueryConstraint, where, orderBy } from "@angular/fire/firestore";
import { environment } from "../../../../environments/environment";
import { Direccion } from "../../../core/interfaces/app/comprador/usuario.inteface";
import { FirebaseGenesisService } from "../../../core/services/firebase.genesis.service";
import { ModalService } from "../../../core/services/ui/modal.service";
import { NotificationService } from "../../../core/services/ui/notification.service";
import { setSelectedAddress } from "../../../core/utils/address-storage.utils";
import { getLocalDataLogged } from "../../../core/utils/storage.utils";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-address-selector',
  imports: [CommonModule],
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css']
})
export class AddressSelectorComponent implements OnInit {

  addresses: Direccion[] = [];
  isLoading: boolean = true;
  selectedAddress: Direccion | null = null;
  
  constructor(
    private modalService: ModalService,
    private firebaseService: FirebaseGenesisService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAddresses();
  }

  async getAddresses(): Promise<void> {
    this.isLoading = true;
    const localData = getLocalDataLogged();

    if (localData && localData.usuario?.idUsuario) {
      const queryConstraints: QueryConstraint[] = [
        where('idUsuario', '==', localData.usuario.idUsuario),
        orderBy('calle', 'asc') // Corregido
      ];

      const result = await this.firebaseService.busquedaQuery(environment.collection.direccion, queryConstraints);

      if (result.success) {
        this.addresses = result.data as Direccion[];
        if (this.addresses.length > 0) {
          this.selectedAddress = this.addresses[0];
        }
      } else {
        this.notificationService.notify('error', `Error al cargar direcciones: ${result.message}`);
      }
    } else {
      this.notificationService.notify('error', 'No se pudo identificar al usuario para cargar las direcciones.');
      this.closeModal();
    }
    this.isLoading = false;
  }

  selectAddress(address: Direccion): void {
    this.selectedAddress = address;
  }

  confirmSelection(): void {
    if (this.selectedAddress) {
      setSelectedAddress(this.selectedAddress);
      this.modalService.sendResponse({ bool: true, data: this.selectedAddress }); // Corregido
    }
  }

  closeModal(): void {
    this.modalService.sendResponse({ bool: false, data: null }); // Corregido
  }
}
