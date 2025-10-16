
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Direccion, defaultDireccion } from '../../core/interfaces/app/comprador/usuario.inteface';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-direccion-modal',
  templateUrl: './direccion-modal.component.html',
  styleUrls: ['./direccion-modal.component.css'],
  standalone: true,
  imports: [CommonModule, GoogleMapsModule] // Añadido GoogleMapsModule
})
export class DireccionModalComponent implements OnInit {
  @Input() direccion: Direccion = defaultDireccion();
  @Output() closeModal = new EventEmitter<void>();

  mapOptions: google.maps.MapOptions = {};
  markerPosition?: google.maps.LatLngLiteral;

  ngOnInit(): void {
    if (this.direccion && this.direccion.lat && this.direccion.lng) {
      const position = { lat: this.direccion.lat, lng: this.direccion.lng };
      this.mapOptions = {
        center: position,
        zoom: 16,
        streetViewControl: false,
        mapTypeControl: false,
      };
      this.markerPosition = position;
    } else {
      // Opciones por defecto si no hay dirección (ej. centrado en una ciudad)
      this.mapOptions = {
        center: { lat: -16.5, lng: -68.15 },
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
      };
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
