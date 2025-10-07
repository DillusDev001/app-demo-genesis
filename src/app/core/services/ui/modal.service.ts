import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalConfig } from '../../interfaces/ui/modal-config.interface';
import { EmitterResponse } from '../../interfaces/emitter-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSource = new Subject<ModalConfig>();
  private responseSource = new Subject<EmitterResponse>();

  openModal$ = this.openModalSource.asObservable();
  response$ = this.responseSource.asObservable();

  open(component: Type<any>, data?: any): Promise<EmitterResponse> {
    this.openModalSource.next({ component, data });

    return new Promise(resolve => {
      const subscription = this.response$.subscribe(res => {
        subscription.unsubscribe();
        resolve(res);
      });
    });
  }

  sendResponse(res: EmitterResponse) {
    this.responseSource.next(res);
  }
}
