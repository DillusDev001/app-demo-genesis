import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { CustomIconComponent } from '../custom-icon/custom-icon.component';

@Component({
  selector: 'app-custom-dot-menu',
  imports: [CommonModule, CustomIconComponent],
  templateUrl: './custom-dot-menu.component.html',
  styleUrls: ['./custom-dot-menu.component.css']
})
export class CustomDotMenuComponent implements OnInit, OnDestroy {
  /** ------------------------------------- Variables de Inicio ------------------------------------- **/
  @Input() data: any[] = [];

  @Output() response = new EventEmitter<any>();

  isDropdownOpen: boolean = false;
  dropdownDirection: 'up' | 'down' = 'down';
  dropdownPosition = { top: 'auto', bottom: 'auto' };
  isTouchDevice: boolean = false;

  private closeTimeout: any;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private documentClickListener?: () => void;

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowChange() {
    if (this.isDropdownOpen) {
      this.calculatePosition();
    }
  }
  /** ----------------------------------------- Constructor ----------------------------------------- **/
  constructor() { }

  /** ------------------------------------------- OnInit -------------------------------------------- **/
  ngOnInit(): void {
    this.setupMobileBehavior();
  }

  /** ------------------------------------------ OnDestroy ------------------------------------------ **/
  ngOnDestroy() {
    this.clearTimeout();
    this.removeOutsideClickListener();
  }

  /** ------------------------------------------- Methods ------------------------------------------- **/
  private setupMobileBehavior() {
    // Verificar si es un dispositivo táctil
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // Eliminar listeners de hover para móviles
      this.renderer.listen(this.el.nativeElement, 'touchstart', (event) => {
        event.preventDefault();
        this.handleMobileTap();
      });
    }
  }

  handleMobileTap() {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
      this.setupOutsideClickListener();
    }
  }

  private openDropdown() {
    this.clearTimeout();
    this.isDropdownOpen = true;
    this.calculatePosition();
  }

  private closeDropdown() {
    this.isDropdownOpen = false;
    this.clearTimeout();
    this.removeOutsideClickListener();
  }

  private setupOutsideClickListener() {
    this.documentClickListener = this.renderer.listen('document', 'touchstart', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.closeDropdown();
      }
    });
  }

  private removeOutsideClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = undefined;
    }
  }

  private calculatePosition() {
    const buttonElement = this.el.nativeElement.querySelector('app-custom-icon');
    if (!buttonElement) return;

    const buttonRect = buttonElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const estimatedDropdownHeight = this.data.length * 40 + 20;

    if (spaceBelow >= estimatedDropdownHeight || spaceBelow > buttonRect.top) {
      this.dropdownDirection = 'down';
      this.dropdownPosition = { top: '100%', bottom: 'auto' };
    } else {
      this.dropdownDirection = 'up';
      this.dropdownPosition = { top: 'auto', bottom: '100%' };
    }
  }

  private startCloseTimeout() {
    this.clearTimeout(); // Limpiar timeout existente
    this.closeTimeout = setTimeout(() => {
      this.closeDropdown();
    }, 50); // 300ms = 0.3 segundos
  }

  private clearTimeout() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }



  /** -------------------------------------------- Events ------------------------------------------- **/
  onMouseEnter() {
    this.clearTimeout(); // Cancelar el cierre automático si el mouse entra
    this.isDropdownOpen = true;
    this.calculatePosition();
  }

  onMouseLeave() {
    this.startCloseTimeout(); // Iniciar temporizador al salir
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.calculatePosition();
    } else {
      this.clearTimeout();
    }
  }

  /** ---------------------------------------- Methods onClick -------------------------------------- **/
  onClickItemMenu(index: number) {
    this.response.emit({
      bool: true,
      data: this.data[index]['value'],
    });
    this.closeDropdown();
  }

}