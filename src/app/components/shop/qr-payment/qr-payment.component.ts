import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-payment.component.html',
  styleUrls: ['./qr-payment.component.css']
})
export class QrPaymentComponent implements OnInit, OnDestroy {

  @Input() qrCodeUrl: string = ''; // URL de la imagen del QR
  @Input() amount: number = 0;
  @Output() paymentConfirmed = new EventEmitter<void>();

  minutes: number = 0;
  seconds: number = 10;
  private timer: any;

  constructor() { }

  ngOnInit(): void {
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
    this.paymentConfirmed.emit();
  }
}
