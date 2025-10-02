export interface Vendedor {
    idVendedor: number;
    nombre: string;
    logo: string;
    descripcion: string;
    email: string;
    whatsapp: string;
    comision: number; // %
    qrPagos: string; // pago de productos vendidos
    banco: string;
    nroCuenta: string;
    beneficiario: string;

    productos?: Producto[];
}

export function defaultVendedor(): Vendedor {
    return {
        idVendedor: 0,
        nombre: "",
        logo: "",
        descripcion: "",
        email: "",
        whatsapp: "",
        comision: 0,
        qrPagos: "",
        banco: "",
        nroCuenta: "",
        beneficiario: ""
    };
}

// ______________________ ______________________ //
export interface Producto {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    idVendedor: number;
    categoria: string;
    stock: number;
    imagenDestacada: string; // principal para mostrar en cards
    atributos: AtributoProducto[];

    imagenes?: string[];   // array de URLs
}

export interface AtributoProducto {
    nombre: "color" | "talla" | "tamaño" | "";
    valor: string;
}

export function defaultProducto(): Producto {
    return {
        idProducto: 0,
        nombre: "",
        descripcion: "",
        precio: 0,
        idVendedor: 0,
        categoria: "",
        stock: 0,
        imagenDestacada: "",
        atributos: []
    }
}

// ______________________ ______________________ //
export interface Resenia {
    idResenia: number;
    idUsuario: number;
    idProducto: number;
    idVendedor: number;
    puntuacion: number;   // 1 a 5
    comentario: string;
    fecha: string;
}

export function defaultResenia(): Resenia {
    return {
        idResenia: 0,
        idUsuario: 0,
        idProducto: 0,
        idVendedor: 0,
        puntuacion: 0,
        comentario: "",
        fecha: ""
    };
}


// ______________________ ______________________ //

// ______________________ ______________________ //

// ______________________ ______________________ //