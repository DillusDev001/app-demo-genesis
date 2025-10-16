import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vendedor, defaultVendedor, Producto, AtributoProducto, defaultProducto } from '../../../core/interfaces/app/vendedor/vendedor.interface';
import { FirebaseGenesisService } from '../../../core/services/firebase.genesis.service';
import { NotificationService } from '../../../core/services/ui/notification.service';
import { Categoria } from '../../../core/interfaces/app/administrador/categoria.interface';
import { CommonModule } from '@angular/common';
import { orderBy, QueryConstraint } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';
import { DataLocalStorage } from '../../../core/interfaces/local/data-local-storage';
import { getLocalDataLogged } from '../../../core/utils/storage.utils';
import { FileArrayObj } from '../../../core/interfaces/file-array-obj.interface';
import { addCerosIzquierda } from '../../../core/utils/utils.utils';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
  standalone: true,
})
export class ProductoFormComponent implements OnInit {

  isLoading: boolean = false;
  isEditMode: boolean = false;

  idProductoEdit: string = '';

  vendedor: Vendedor = defaultVendedor();
  dataProductos: Producto[] = [];

  private firebaseGenesisService = inject(FirebaseGenesisService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productoForm: FormGroup;

  images: string[] = [];

  categorias: Categoria[] = [];
  subCategorias: string[] = [];

  queryConstraints: QueryConstraint[] = [];

  imagenDestacadaFile: File | null = null;
  imagenDestacadaPreview: string | ArrayBuffer | null = null;

  galeriaFiles: File[] = [];
  galeriaPreviews: (string | ArrayBuffer)[] = [];

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      subCategoria: [''],
      tipo: ['producto', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagenDestacada: ['',],
      activo: [true],
      atributos: this.fb.array([])
    });
  }

  async ngOnInit() {
    const data: DataLocalStorage = getLocalDataLogged();

    this.vendedor = data.vendedor ? data.vendedor : defaultVendedor();

    this.isLoading = true;

    await this.getCategorias();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.getProducto(id);
    } else {
      this.isLoading = false;
    }
  }

  async getProducto(idProducto: string) {
    const result = await this.firebaseGenesisService.findDocByField(environment.collection.producto, 'idProducto', idProducto);

    if (result.success && result.data) {
      const producto = result.data as Producto;

      // Limpiar atributos existentes
      this.atributos.clear();

      // guardar idProducto para editar
      this.idProductoEdit = producto.idProducto;

      // Llenar el FormArray de atributos
      if (producto.atributos && producto.atributos.length > 0) {
        producto.atributos.forEach(attr => {
          this.atributos.push(this.fb.group({
            nombre: [attr.nombre, Validators.required],
            valor: [attr.valor, Validators.required]
          }));
        });
      }

      // Llenar el resto del formulario
      this.productoForm.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        subCategoria: producto.subCategoria,
        tipo: producto.tipo,
        stock: producto.stock,
        activo: producto.activo
      });

      // Cargar previsualizaciones de imágenes
      if (producto.imagenDestacada) {
        this.imagenDestacadaPreview = producto.imagenDestacada;
      }
      if (producto.imagenes) {
        this.galeriaPreviews = [...producto.imagenes];
      }

      // Cargar subcategorías
      const categoriaSeleccionada = this.categorias.find(c => c.nombre === producto.categoria);
      this.subCategorias = categoriaSeleccionada?.subCategorias || [];
    } else {
      this.notificationService.notify('error', result.message!);
    }
    this.isLoading = false;
  }

  get atributos(): FormArray {
    return this.productoForm.get('atributos') as FormArray;
  }

  nuevoAtributo(): FormGroup {
    return this.fb.group({
      nombre: '',
      valor: ''
    })
  }

  agregarAtributo() {
    this.atributos.push(this.nuevoAtributo());
  }

  eliminarAtributo(i: number) {
    this.atributos.removeAt(i);
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
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenDestacadaPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onGaleriaImageSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.galeriaFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.galeriaPreviews.push(reader.result as string | ArrayBuffer);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  eliminarImagenGaleria(index: number): void {
    this.galeriaFiles.splice(index, 1);
    this.galeriaPreviews.splice(index, 1);
  }

  async guardarProducto() {
    this.isLoading = true;

    if (this.isEditMode) {
      this.actualizarProducto();
    } else {
      this.crearProducto();
    }
  }

  async crearProducto() {
    if (this.productoForm.invalid) {
      this.isLoading = false;
      this.notificationService.notify("error", "Por favor, complete todos los campos requeridos.");
      return;
    }

    if (!this.imagenDestacadaFile) {
      this.isLoading = false;
      this.notificationService.notify("error", "Por favor agregue una imagen destacada.");
      return;
    }

    this.isLoading = true;

    const idProducto = this.firebaseGenesisService.generateUUID(environment.collection.producto);

    const newProducto: Producto = {
      ...defaultProducto(),
      ...this.productoForm.value,
      /*nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      subCategoria: '',
      tipo: 'producto',
      stock: 0,
      imagenDestacada: '',
      atributos: [],
      activo: false,*/

      idProducto,
      idVendedor: this.vendedor.idVendedor,
      vendedor: this.vendedor,

      imagenes: [],

      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    const newResult = (await this.firebaseGenesisService.createDocWithID(environment.collection.producto, idProducto, newProducto));
    if (newResult.success) {
      // Agregar imagen destacada y obtener url /vendedores/idVendedor/productos/idProducto/imagendestacada.ext
      const imgFile: FileArrayObj = {
        file: this.imagenDestacadaFile,
        path: `/vendedores/${this.vendedor.idVendedor}/productos/${idProducto}/imagendestacada.${this.imagenDestacadaFile.name.split('.').pop()}`
      }

      const imagenResult = await this.firebaseGenesisService.upLoadFile(imgFile);
      if (imagenResult.success && imagenResult.message) {
        newProducto.imagenDestacada = imagenResult.message;

        // Agregar lista de imagens si hay y obtener urls vendedores/idVendedor/productos/idProducto/galeria/
        if (this.galeriaFiles.length > 0) {
          const galeryArray: FileArrayObj[] = [];

          this.galeriaFiles.forEach((element, i) => {
            galeryArray.push({
              file: element,
              path: `/vendedores/${this.vendedor.idVendedor}/productos/${idProducto}/galeria/${addCerosIzquierda(i, 3)}-${idProducto}.${element.name.split('.').pop()}`
            })
          });

          const galeriaResult = await this.firebaseGenesisService.upLoadFilesArray(galeryArray);

          if (galeriaResult.success && galeriaResult.data) {
            newProducto.imagenes = galeriaResult.data as string[];
            const update = await this.firebaseGenesisService.updateDoc(environment.collection.producto, newProducto, idProducto);

            if (update.success) {
              this.notificationService.notify("success", "Se agregó correctamente.");
              this.router.navigateByUrl('/tienda/productos');
            } else {
              this.notificationService.notify("error", "Error al guardar el producto con galeria: " + update.message);
              this.isLoading = false;
            }
          }
        } else {
          const update = await this.firebaseGenesisService.updateDoc(environment.collection.producto, newProducto, idProducto);

          if (update.success) {
            this.notificationService.notify("success", "Se agregó correctamente.");
            this.router.navigateByUrl('/tienda/productos');
          } else {
            this.notificationService.notify("error", "Error al guardar el producto con imagen destacada: " + update.message);
            this.isLoading = false;
          }
        }
      } else {
        this.notificationService.notify("error", "Error al guardar la imagen destacada: " + imagenResult.message);
        this.isLoading = false;
      }
    } else {
      this.notificationService.notify("error", "Error al crear el producto: " + newResult.message);
      this.isLoading = false;
    }
  }

  async actualizarProducto() {
    const updateData = {
      nombre: this.productoForm.get('nombre')?.value,
      descripcion: this.productoForm.get('descripcion')?.value,
      precio: this.productoForm.get('precio')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      tipo: this.productoForm.get('tipo')?.value,
      stock: this.productoForm.get('stock')?.value,
      activo: this.productoForm.get('activo')?.value,
      atributos: this.productoForm.get('atributos')?.value,
    };

    const result = await this.firebaseGenesisService.updateDoc(environment.collection.producto, updateData, this.idProductoEdit);

    if (result.success) {
      this.notificationService.notify("success", "Se actualizó correctamente.");
      this.router.navigateByUrl('/tienda/productos');
    } else {
      this.notificationService.notify("error", "Error al actualizar.");
      this.isLoading = false;
    }
  }
}
