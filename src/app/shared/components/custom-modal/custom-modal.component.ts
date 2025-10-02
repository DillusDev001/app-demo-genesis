import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomLoadingComponent } from '../custom-loading/custom-loading.component';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CustomIconComponent } from '../custom-icon/custom-icon.component';
import { ModalConfig } from '../../../core/interfaces/ui/modal-config.interface';
import { custumButtonBlue, custumButtonGray, custumButtonRed, custumButtonYellow } from '../../../core/utils/colors.utils';
import { ModalService } from '../../../core/services/ui/modal.service';

@Component({
  selector: 'app-custom-modal',
  imports: [CommonModule, ReactiveFormsModule, CustomLoadingComponent, CustomButtonComponent, CustomIconComponent],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements OnInit {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  isOpen: boolean = false;
  type: 'alert' | 'warning' | 'info' | '' = '';
  title: string = '';
  content: string = '';
  button: string = 'Aceptar';
  value: string | number = ''; // puede servir para recibir index o cod de algun elemento

  //@Output() response = new EventEmitter<any>();

  isLoading: boolean = false;

  onCloseEmitter: any = { bool: false, data: null }; // para enviar respuesta al cerrar
  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor(private modalService: ModalService) { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit() {
    this.modalService.openModal$.subscribe((config: ModalConfig) => {
      this.isOpen = true;
      this.type = config.type || '';
      this.title = config.title || '';
      this.content = config.content || '';
      this.button = config.button || 'Aceptar';
      this.value = config.value || '';
    });
  }

  /** ------------------------------------------ OnDestroy ------------------------------------------ **/

  /** ------------------------------------------- Methods ------------------------------------------- **/
  onCloseModal() {
    this.isOpen = false;
    this.modalService.sendResponse({ bool: false, data: null });
  }

  getModalIconColor(): string {
    switch (this.type) {
      /*case 'accept':
      case 'notification':
        return 'border-green-500 text-green-500';*/

      case 'alert':
        return 'border-yellow-400 text-yellow-400';

      case 'warning':
        return 'border-red-500 text-red-500';

      case 'info':
        return 'border-blue-500 text-blue-500';

      default:
        return 'border-gray-500 text-gray-500';
    }
  }

  getModalIcon(): string {
    switch (this.type) {
      /*case 'accept':
      case 'notification':
        return 'fa-solid fa-check fa-2x';*/

      case 'alert':
        return 'fa-solid fa-triangle-exclamation fa-2x';

      case 'warning':
        return 'fa-solid fa-exclamation fa-2x';

      case 'info':
        return 'fa-solid fa-info fa-2x';

      default:
        return 'fa-solid fa-circle-question fa-2x';
    }
  }

  getModalHeaderColor(): string {
    switch (this.type) {
      /*case 'accept':
      case 'notification':
        return 'text-green-500';*/

      case 'alert':
        return 'bg-yellow-400/15 text-yellow-600';

      case 'warning':
        return 'bg-red-500/15 text-red-500';

      case 'info':
        return 'bg-blue-500/15 text-blue-500';

      default:
        return 'bg-gray-500/15 text-gray-500';
    }
  }

  getModalCloseColor(): string {
    switch (this.type) {
      /*case 'accept':
      case 'notification':
        return 'text-green-500';*/

      case 'alert':
        return 'bg-yellow-400';

      case 'warning':
        return 'bg-red-500';

      case 'info':
        return 'bg-blue-500';

      default:
        return 'bg-gray-500';
    }
  }

  getModalButtonColor(): string {
    switch (this.type) {
      /*case 'accept':
      case 'notification':
        return 'text-green-500';*/

      case 'alert':
        return custumButtonYellow;

      case 'warning':
        return custumButtonRed;

      case 'info':
        return custumButtonBlue;

      default:
        return custumButtonGray;
    }
  }

  /** ---------------------------------------- Methods onClick -------------------------------------- **/
  onClickModal(sw: boolean) {
    this.isOpen = false;
    this.modalService.sendResponse({ bool: sw, data: this.value });
  }

}