import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { ModalService } from '../../../../core/services/ui/modal.service';
import { Direccion } from '../../../../core/interfaces/app/comprador/usuario.inteface';
import * as ngeohash from 'ngeohash';
import { NotificationService } from '../../../../core/services/ui/notification.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  addressForm: FormGroup;
  modalService = inject(ModalService);
  notificationService = inject(NotificationService);
  data?: Direccion;

  mapOptions: google.maps.MapOptions;
  markerPosition?: google.maps.LatLngLiteral;

  // Visual hint for the user's current location
  myLocationMarkerPosition?: google.maps.LatLngLiteral;
  myLocationMarkerIcon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 7,
    fillColor: '#4285F4', // Google Blue
    fillOpacity: 1,
    strokeWeight: 0,
  };

  // Circle for geolocation accuracy
  circleCenter?: google.maps.LatLngLiteral;
  circleRadius?: number;
  circleOptions: google.maps.CircleOptions = {
    strokeColor: '#3B82F6',
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: '#3B82F6',
    fillOpacity: 0.2
  };

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      idDireccion: [null],
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      departamento: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      pais: ['Bolivia', Validators.required],
      lat: [null, Validators.required],
      lng: [null, Validators.required],
      geohash: [null]
    });

    this.mapOptions = {
      center: { lat: -16.5216256, lng: -68.1705472 }, // Default center
      zoom: 15,
      streetViewControl: false,
      mapTypeControl: false,
    };
  }

  ngOnInit(): void {
    if (this.data && this.data.lat && this.data.lng) {
      // EDIT MODE: Set marker and center to the existing address
      const geohash = ngeohash.encode(this.data.lat, this.data.lng);
      this.addressForm.patchValue({...this.data, geohash });
      
      const initialPosition = { lat: this.data.lat, lng: this.data.lng };
      this.markerPosition = initialPosition;
      this.mapOptions.center = initialPosition;
    } else {
      // ADD MODE: Passively try to find user's location to show as a hint
      // this.centerMapOnUserLocation();
      this.panToUserLocation();
      this.addressForm.patchValue({ lat: null, lng: null, geohash: null });
    }
  }

  // Passively centers the map and shows a blue dot hint
  panToUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.mapOptions.center = userLocation;
          this.myLocationMarkerPosition = userLocation;
        },
        () => {
          console.log("Could not get user location for initial centering.");
        }
      );
    }
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const newPosition = event.latLng.toJSON();
      this.updateLocation(newPosition.lat, newPosition.lng);
    }
  }

  // Actively sets the red marker and form values from the GPS button
  centerMapOnUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.updateLocation(userLocation.lat, userLocation.lng, position.coords.accuracy);
          this.mapOptions = { // Create a new object to trigger change detection
            ...this.mapOptions,
            center: userLocation,
            zoom: 15
          };
          //this.notificationService.notify('success', '¡Ubicación encontrada y seleccionada!');
        },
        (error) => {
          this.notificationService.notify('error', 'No se pudo obtener la ubicación. Asegúrate de dar permiso.');
        }
      );
    } else {
      this.notificationService.notify('warning', 'La geolocalización no es soportada por este navegador.');
    }
  }

  // This function sets the definitive location (the red marker)
  updateLocation(lat: number, lng: number, accuracy?: number): void {
    const geohash = ngeohash.encode(lat, lng);
    const newPosition = { lat, lng };

    this.markerPosition = newPosition; // This sets the main red marker
    this.mapOptions.center = newPosition;
    this.addressForm.patchValue({ lat, lng, geohash });

    if (accuracy) {
      this.circleCenter = newPosition;
      this.circleRadius = accuracy;
    } else {
      this.circleRadius = undefined; // Hide circle on manual click
    }
  }

  saveAddress(): void {
    this.addressForm.markAllAsTouched();
    if (this.addressForm.valid) {
      this.modalService.sendResponse({ bool: true, data: this.addressForm.value });
    }
  }

  closeModal(): void {
    this.modalService.sendResponse({ bool: false, data: null });
  }
}
