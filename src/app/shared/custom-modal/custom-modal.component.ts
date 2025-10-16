import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalConfig } from '../../core/interfaces/ui/modal-config.interface';
import { EmitterResponse } from '../../core/interfaces/emitter-response.interface';
import { ModalService } from '../../core/services/ui/modal.service';
import { custumButtonBlue, custumButtonGray, custumButtonRed, custumButtonYellow } from '../../core/utils/colors.utils';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  private componentRef!: ComponentRef<any>;
  private modalSubscription!: Subscription;
  private closeSubscription!: Subscription;

  isOpen: boolean = false;

  // Config for simple modals
  type: 'alert' | 'warning' | 'info' | '' = '';
  title: string = '';
  content: string = '';
  buttonText: string = 'Aceptar';
  value: any = null;

  // Flag to determine which type of modal to show
  isDynamicComponent: boolean = false;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.modalSubscription = this.modalService.openModal$.subscribe((config: ModalConfig) => {
      this.resetState();
      this.isOpen = true;

      if (config.component) {
        this.isDynamicComponent = true;
        setTimeout(() => this.createDynamicComponent(config.component, config.data), 0);
      } else {
        this.isDynamicComponent = false;
        this.type = config.type || '';
        this.title = config.title || 'Confirmation';
        this.content = config.content || '';
        this.buttonText = config.button || 'Aceptar';
        this.value = config.value || null;
      }
    });

    this.closeSubscription = this.modalService.close$.subscribe(() => {
      this.onResponse(false);
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    this.destroyDynamicComponent();
  }

  private createDynamicComponent(component: any, data: any): void {
    this.destroyDynamicComponent();
    if (this.dynamicComponentContainer) {
        this.componentRef = this.dynamicComponentContainer.createComponent(component);
        if (data) {
            Object.assign(this.componentRef.instance, data);
        }
    }
  }

  private destroyDynamicComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (this.dynamicComponentContainer) {
      this.dynamicComponentContainer.clear();
    }
  }

  private resetState(): void {
    this.destroyDynamicComponent();
    this.isDynamicComponent = false;
    this.title = '';
    this.content = '';
    this.type = '';
    this.buttonText = 'Aceptar';
    this.value = null;
  }

  onResponse(success: boolean): void {
    this.isOpen = false;
    this.modalService.sendResponse({ bool: success, data: this.value });
    this.resetState();
  }

  // Methods for simple modal styling (restored)
  getModalIcon(): string {
    switch (this.type) {
      case 'alert': return 'fa-solid fa-triangle-exclamation fa-2x';
      case 'warning': return 'fa-solid fa-exclamation fa-2x';
      case 'info': return 'fa-solid fa-info fa-2x';
      default: return 'fa-solid fa-circle-question fa-2x';
    }
  }

  getModalHeaderColor(): string {
    switch (this.type) {
      case 'alert': return 'bg-yellow-400/15 text-yellow-600';
      case 'warning': return 'bg-red-500/15 text-red-500';
      case 'info': return 'bg-blue-500/15 text-blue-500';
      default: return 'bg-gray-500/15 text-gray-500';
    }
  }

  getModalButtonColor(): string {
    switch (this.type) {
      case 'alert': return custumButtonYellow;
      case 'warning': return custumButtonRed;
      case 'info': return custumButtonBlue;
      default: return custumButtonGray;
    }
  }
}
