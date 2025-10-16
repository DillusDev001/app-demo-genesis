import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../src/environments/environment';
import { QueryConstraint } from '@angular/fire/firestore'; // Importar QueryConstraint
import { Paquete } from '../../../core/interfaces/app/administrador/paquete.interface';
import { Promocion } from '../../../core/interfaces/app/vendedor/promocion.interface';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { defaultVendedor } from '../../../core/interfaces/app/vendedor/vendedor.interface';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PromocionesComponent implements OnInit {
  paquetes: Paquete[] = [];
  promocionesActivas: Promocion[] = []; // Propiedad para promociones activas
  isLoading: boolean = false;

  private firebaseGenesisService = inject(FirebaseGenesisService);

  ngOnInit(): void {
    this.loadPaquetes();
    this.loadFictitiousPromociones(); // Cargar datos ficticios
  }

  async loadPaquetes(): Promise<void> {
    this.isLoading = true;
    try {
      const queryConstraints: QueryConstraint[] = [];
      const result = await this.firebaseGenesisService.busquedaQuery<Paquete[]>(environment.collection.paquete, queryConstraints);
      if (result.success && result.data) {
        this.paquetes = result.data;
      } else {
        console.error('Error fetching promotion packages:', result.message);
        this.paquetes = [];
      }
    } catch (error) {
      console.error('Error loading promotion packages:', error);
      this.paquetes = [];
    }
    this.isLoading = false;
  }

  // Función para generar datos ficticios de promociones
  loadFictitiousPromociones(): void {
    const estados: Promocion['estado'][] = ['activa', 'expirada', 'pendiente'];
    for (let i = 1; i <= 10; i++) {
      const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
      const fechaInicio = new Date();
      const fechaFin = new Date(fechaInicio.getTime() + (Math.random() * 30 + 7) * 24 * 60 * 60 * 1000); // 7 a 37 días después

      this.promocionesActivas.push({
        idPromocion: `promo-${i}`,
        idPaquete: `paquete-id-${i}`,
        idVendedor: `vendedor-id-${i}`,
        idProducto: `producto-id-${i}`,
        idPago: `pago-id-${i}`,
        diasContratados: Math.floor(Math.random() * 30) + 7,
        precioTotal: Math.floor(Math.random() * 500) + 50,
        fechaInicio: fechaInicio.toISOString(), // Usar ISO string para consistencia con DatePipe
        fechaFin: fechaFin.toISOString(), // Usar ISO string para consistencia con DatePipe
        estado: estadoAleatorio,
        renovable: Math.random() > 0.5,
        producto: {
          idProducto: `prod-${i}`,
          nombre: `Producto de Oferta ${i}`,
          descripcion: `Descripción del producto ${i}`,
          imagenes: [],
          precio: Math.floor(Math.random() * 100) + 10,
          stock: Math.floor(Math.random() * 50) + 1,
          idVendedor: `vend-${i}`,
          categoria: '',
          tipo: 'producto',
          imagenDestacada: '',
          atributos: [],
          activo: false,
          vendedor: defaultVendedor()
        },
        metricas: {
          visualizaciones: Math.floor(Math.random() * 10000) + 100,
          clics: Math.floor(Math.random() * 1000) + 10,
          conversiones: Math.floor(Math.random() * 100) + 1
        }
      });
    }
  }

  getButtonClasses(paquete: Paquete) {
    switch (paquete.nombre) {
      case 'Paquete Básico':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Paquete Intermedio':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'Paquete Avanzado':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700'; // Color por defecto
    }
  }

  getStatusClasses(estado: Promocion['estado']) {
    switch (estado) {
      case 'activa':
        return 'bg-green-200 text-green-800';
      case 'expirada':
        return 'bg-red-200 text-red-800';
      case 'pendiente':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
}
