import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vendedor, defaultVendedor, Producto, AtributoProducto, defaultProducto } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { Categoria } from '../../../core/interfaces/app/administrador/categoria.interface';
import { CommonModule } from '@angular/common';
import { orderBy, QueryConstraint } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-producto-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
  standalone: true,
})
export class ProductoFormComponent implements OnInit {

  vendedor: Vendedor = defaultVendedor();
  dataProductos: Producto[] = [];

  private firebaseGenesisService = inject(FirebaseGenesisService);
  private notificationService = inject(NotificationService);

  productoForm: FormGroup;

  images: string[] = [];
  atributos: AtributoProducto[] = [];

  categorias: Categoria[] = [];
  subCategorias: string[] = [];

  queryConstraints: QueryConstraint[] = [];

  imagenDestacadaFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      subCategoria: [''],
      tipo: ['producto', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagenDestacada: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    // El usuario se encarga de poblar this.vendedor
    this.getCategorias();
  }

  async getCategorias() {
    this.queryConstraints = [];
    this.queryConstraints.push(orderBy('nombre', 'asc'));

    const result = await this.firebaseGenesisService.busquedaQuery(environment.collection.categoria, this.queryConstraints);
    if (result.success && result.data) {
      this.categorias = result.data as Categoria[];
    }
  }

  onCategoryChange(event: any) {
    const categoriaNombre = event.target.value;
    const categoriaSeleccionada = this.categorias.find(c => c.nombre === categoriaNombre);
    this.subCategorias = categoriaSeleccionada?.subCategorias || [];
    this.productoForm.get('subCategoria')?.setValue('');
  }

  onImagenDestacadaSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenDestacadaFile = file;
      console.log(file)
    }
  }


  async guardarProducto() {
    if (this.productoForm.invalid) {
      this.notificationService.notify('error', "Por favor, complete todos los campos requeridos.");
      return;
    }

    if (!this.vendedor || !this.vendedor.idVendedor) {
      this.notificationService.notify('error', "No se pudieron verificar los datos del vendedor. Por favor, recargue la página.");
      return;
    }

    const id = this.firebaseGenesisService.generateUUID(environment.collection.producto);

    const newProducto: Producto = {
      ...defaultProducto(),
      ...this.productoForm.value,
      idProducto: id,
      idVendedor: this.vendedor.idVendedor,
      vendedor: this.vendedor,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    const result = await this.firebaseGenesisService.createDocWithID(environment.collection.producto, id, newProducto);

    if (result.success) {
      this.notificationService.notify('success', "¡Producto guardado con éxito!");
      this.productoForm.reset({
        tipo: 'producto',
        activo: true,
        precio: 0,
        stock: 0
      });
      this.subCategorias = [];
    } else {
      this.notificationService.notify('error', "Error al guardar el producto: " + result.message);
    }
  }
}
