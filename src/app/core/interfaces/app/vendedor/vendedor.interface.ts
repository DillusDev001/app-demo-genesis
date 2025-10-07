export interface Vendedor {
  idVendedor: string;
  nombre: string; // Nombre de la PYME
  logo: string;
  descripcion: string;
  email: string;
  password: string;
  whatsapp: string;
  comision: number; // %
  qrPagos: string; // pago de productos vendidos
  banco: string;
  nroCuenta: string;
  beneficiario: string;
  rubro: string;

  productos?: Producto[];
}

export function defaultVendedor(): Vendedor {
  return {
      idVendedor: "",
      nombre: "", // Nombre de la PYME
      logo: "",
      descripcion: "",
      email: "",
      password: "",
      whatsapp: "",
      comision: 0,
      qrPagos: "",
      banco: "",
      nroCuenta: "",
      beneficiario: "",
      rubro: ""
  };
}

// ______________________ ______________________ //
export interface Producto {
  idProducto: string;             // Mejor UUID o string
  idVendedor: string;             // Relación con el vendedor

  nombre: string;
  descripcion: string;
  precio: number;

  categoria: string;              // Ej: "Ropa", "Electrodomésticos", "Educación"
  subCategoria?: string;          // Ej: "Poleras", "Refrigeradores", "Cursos online"

  tipo: "producto" | "servicio";  // Diferencia entre tangible o servicio
  stock?: number;                 // Solo aplica a productos físicos

  imagenDestacada: string;        // Imagen principal para cards
  imagenes?: string[];            // Galería de imágenes
  atributos?: AtributoProducto[]; // Campos dinámicos (ej: talla, color, duración)

  activo: boolean;                // Controla si se muestra en la tienda

  puntuacion?:number;
  resenias?: number;

  vendedor?: Vendedor;

  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface AtributoProducto {
  nombre:
  | "color"
  | "talla"
  | "tamaño"
  | "peso"
  | "material"
  | "marca"
  | "modelo"
  | "dimensiones"
  | "capacidad"
  | "sabor"
  | "fragancia"
  | "duracion"
  | "garantia"
  | "otros";   // fallback para casos especiales
  valor: string;
}

export function defaultProducto(): Producto {
  return {
      idProducto: "",
      idVendedor: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      categoria: "",
      tipo: "producto",
      imagenDestacada: "",
      activo: false
  }
}

// ______________________ ______________________ //
export interface Resenia {
  idResenia: string;
  idUsuario: string;
  idProducto: string;
  idVendedor: string;
  puntuacion: number;   // 1 a 5
  comentario: string;
  fecha: string;
}

export function defaultResenia(): Resenia {
  return {
      idResenia: "",
      idUsuario: "",
      idProducto: "",
      idVendedor: "",
      puntuacion: 0,
      comentario: "",
      fecha: ""
  };
}


// ______________________ ______________________ //

// ______________________ ______________________ //

// ______________________ ______________________ //