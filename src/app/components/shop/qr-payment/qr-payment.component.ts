import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { EmitterResponse } from '../../../core/interfaces/emitter-response.interface';
import { SkeletonQrPaymentComponent } from '../../../shared/skeleton-qr-payment/skeleton-qr-payment.component';
import { Pago } from '../../../core/interfaces/app/comprador/pago.interface';

@Component({
  selector: 'app-qr-payment',
  standalone: true,
  imports: [CommonModule, SkeletonQrPaymentComponent],
  templateUrl: './qr-payment.component.html',
  styleUrls: ['./qr-payment.component.css']
})
export class QrPaymentComponent implements OnInit, OnDestroy {

  @Input() qrCodeUrl: string = ''; // URL de la imagen del QR
  @Input() amount: number = 0;
  @Output() paymentConfirmed = new EventEmitter<EmitterResponse>();

  minutes: number = 0;
  seconds: number = 0;
  private timer: any;

  isLoading: boolean = false;

  collectionPago: string = environment.collection.pago;

  //private router = inject(Router);
  private firebaseGenesisService = inject(FirebaseGenesisService);
  private notificationService = inject(NotificationService);

  constructor() { }

  async ngOnInit() {
    this.minutes = 5;
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        // El tiempo ha expirado
        clearInterval(this.timer);
      }
    }, 1000);
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  confirmPayment(): void {
    this.isLoading = true;
    this.notificationService.notify('info', 'Verificando el pago....');

    this.seconds = 3;

    setTimeout(() => {
      this.notificationService.notify('success', 'Pago Confirmado.');
      this.createPago();
    }, this.seconds * 1000);
  }

  cancelPayment(): void {
    this.paymentConfirmed.emit({ bool: false, data: null });
  }

  async createPago() {
    const idPago = this.firebaseGenesisService.generateUUID(this.collectionPago);

    const pago: Pago = {
      idPago,
      metodo: 'qr',
      referencia: '',
      monto: this.amount,
      estado: 'completado'
    }

    const resultPago = await this.firebaseGenesisService.createDocWithID(this.collectionPago, idPago, pago);

    if (resultPago.success) {
      this.paymentConfirmed.emit({ bool: true, data: pago });
      this.isLoading = false;
    } else {
      this.notificationService.notify('error', 'no se a podido crear el pago: ' + resultPago.message);
      this.isLoading = false;
    }

  }
}