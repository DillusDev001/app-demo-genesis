
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, defaultProducto } from '../../../core/interfaces/app/vendedor/vendedor.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {

  @Input() producto: Producto = defaultProducto();
  
  selectedImage: string = '';
  quantity: number = 1;

  constructor() { }

  ngOnInit(): void {
    if (this.producto) {
      this.selectedImage = this.producto.imagenDestacada;
      if (!this.producto.imagenes) {
        this.producto.imagenes = [];
      }
      // Add the featured image to the list if it's not already there
      if (this.producto.imagenDestacada && !this.producto.imagenes.includes(this.producto.imagenDestacada)) {
        this.producto.imagenes.unshift(this.producto.imagenDestacada);
      }
    }
  }

  selectImage(imagen: string){
    this.selectedImage = imagen;
  }

  updateQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && this.producto.stock && newQuantity <= this.producto.stock) {
      this.quantity = newQuantity;
    }
  }

  agregarAlCarrito(): void {
    // TODO: Implementar la lógica para agregar al carrito con la cantidad seleccionada
    console.log(`Agregando ${this.quantity} del producto al carrito:`, this.producto);
  }
}
