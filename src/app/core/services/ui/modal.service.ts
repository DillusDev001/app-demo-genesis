import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalConfig } from '../../interfaces/ui/modal-config.interface';
import { EmitterResponse } from '../../interfaces/emitter-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSource = new Subject<ModalConfig>();
  private responseSource = new Subject<any>();

  /** Observable para abrir el modal */
  openModal$ = this.openModalSource.asObservable();

  /** Observable para recibir la respuesta */
  response$ = this.responseSource.asObservable();

  /** Llamar al modal desde cualquier parte */
  open(config: ModalConfig): Promise<EmitterResponse> {
    this.openModalSource.next(config);
    return new Promise(resolve => {
      this.response$.subscribe(res => {
        resolve(res);
      });
    });
  }

  /** Enviar la respuesta desde el modal */
  sendResponse(res: any) {
    this.responseSource.next(res);
  }
}