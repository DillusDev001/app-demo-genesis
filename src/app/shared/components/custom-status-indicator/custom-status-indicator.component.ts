import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-status-indicator',
  imports: [CommonModule],
  templateUrl: './custom-status-indicator.component.html',
  styleUrls: ['./custom-status-indicator.component.css']
})
export class CustomStatusIndicatorComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() status: number = 0;
  @Input() type: 'pago' | 'estado' = 'estado';

  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() { }

  /** ------------------------------------------- Methods ------------------------------------------- **/
  getStatusColor(): string {
    if (this.type === 'pago') {
      switch (this.status) {
        case 2: return 'bg-red-500';
        case 1: return 'bg-blue-500';
        case 0: return 'bg-green-500';
        case -1: return 'bg-violet-500';
      }
    }
    else if (this.type === 'estado') {
      switch (this.status) {
        case 1: return 'bg-green-500';
        case 0: return 'bg-red-500';
      }
    }
    return ''; // Default
  }

  /** ---------------------------------------- Methods onClick -------------------------------------- **/

}
