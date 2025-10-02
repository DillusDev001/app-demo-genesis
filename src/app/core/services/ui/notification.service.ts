import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomNotification } from '../../interfaces/ui/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new Subject<CustomNotification>(); // Observable para mensajes
  notification$ = this.notificationSubject.asObservable(); // Permite que otros componentes se suscriban

  // Método para emitir mensajes
  notify(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    this.notificationSubject.next({ type, message }); // Envía el mensaje a los suscriptores
  }

}