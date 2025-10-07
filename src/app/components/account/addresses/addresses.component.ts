import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { Direccion } from '../../../core/interfaces/app/comprador/usuario.inteface';
import { environment } from '../../../../environments/environment';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { ResultFirebase } from '../../../core/interfaces/api/result-firebase.interface';
import { ModalService } from '../../../core/services/ui/modal.service';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { AddressFormComponent } from './address-form/address-form.component';
import { QueryConstraint, orderBy, where } from '@angular/fire/firestore';
import { EmitterResponse } from '../../../core/interfaces/emitter-response.interface';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  firebaseService = inject(FirebaseGenesisService);
  modalService = inject(ModalService);
  notificationService = inject(NotificationService);

  direcciones: Direccion[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses(): void {
    this.isLoading = true;
    const localData = getLocalDataLogged();
    if (localData && localData.usuario) {
      const queryConstraints: QueryConstraint[] = [];
      queryConstraints.push(where('idUsuario', '==', localData.usuario.idUsuario));
      queryConstraints.push(orderBy('calle', 'asc'));

      this.firebaseService.busquedaQuery<Direccion[]>(
        environment.collection.direccion,
        queryConstraints
      ).then((userResult: ResultFirebase<Direccion[]>) => {
        this.isLoading = false;
        if (userResult.success && userResult.data) {
          this.direcciones = userResult.data;
        } else {
          this.direcciones = [];
        }
      }).catch(() => {
        this.isLoading = false;
        this.direcciones = [];
      });
    } else {
      this.isLoading = false;
    }
  }

  async openAddressModal(address?: Direccion): Promise<void> {
    // Use a deep copy to prevent unintended changes in the parent component
    const addressCopy = address ? JSON.parse(JSON.stringify(address)) : undefined;
    // Pass the data using the correct key 'data' which the form component expects
    const response: EmitterResponse = await this.modalService.open(AddressFormComponent, { data: addressCopy });
    if (response && response.bool) {
      this.handleModalResponse(response.data as Direccion, address?.idDireccion);
    }
  }

  handleModalResponse(formData: Direccion, id?: string): void {
    const localData = getLocalDataLogged();
    if (!localData || !localData.usuario) return;

    const dataToSave = {
      ...formData,
      idUsuario: formData.idUsuario || localData.usuario.idUsuario
    };

    const collectionPath = environment.collection.direccion;
    let promise: Promise<any>;

    if (id) {
      // Update existing address
      promise = this.firebaseService.updateDoc(collectionPath, dataToSave, id);
    } else {
      // Create new address
      promise = this.firebaseService.createDoc(collectionPath, dataToSave);

      // Update With ID from Promise
      promise.then((result: ResultFirebase<any>) => {
        if (result.success && result.data) {
          dataToSave.idDireccion = String(result.data);
          promise = this.firebaseService.updateDoc(collectionPath, dataToSave, String(result.data));
        }
      }).catch(error => {
        console.error('Error creating address: ', error);
      });
    }

    promise.then((result: ResultFirebase<any>) => {
      console.log('result: ', result)
      this.notificationService.notify('success', '¡Dirección guardada correctamente!');
      this.getAddresses();
    }).catch(error => {
      this.notificationService.notify('error', 'Hubo un error al guardar la dirección.');
      console.error('Error saving address: ', error);
    });
  }

  deleteAddress(idDireccion: string | undefined): void {
    if (!idDireccion) return;

    // Optional: Add a confirmation modal here for better UX
    this.firebaseService.deleteDoc(environment.collection.direccion, idDireccion)
      .then(() => {
        this.notificationService.notify('success', 'Dirección eliminada correctamente.');
        this.getAddresses(); // Refresh the list
      })
      .catch(error => {
        this.notificationService.notify('error', 'Hubo un error al eliminar la dirección.');
        console.error('Error deleting address: ', error);
      });
  }
}
