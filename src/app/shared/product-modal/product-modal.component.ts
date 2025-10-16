
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defaultProducto, Producto } from '../../core/interfaces/app/vendedor/vendedor.interface';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductModalComponent {
  @Input() product: Producto = defaultProducto();
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }
}
