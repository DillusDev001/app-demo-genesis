
import { defaultProducto, Producto, Vendedor } from "../vendedor/vendedor.interface";
import { Pago } from "./pago.interface";

export interface Usuario {
    idUsuario: string;
    email: string;
    password: string;
    nombre: string;
    whatsapp: string;

    direcciones?: Direccion[];
}

export function defaultUsuario(): Usuario {
    return {
        idUsuario: "",
        email: "",
        password: "",
        nombre: "",
        whatsapp: ""
    };
}

export interface Direccion {
    idUsuario: string;
    idDireccion: string;
    calle: string;
    ciudad: string;
    departamento: string;
    codigoPostal: string;
    pais: string;
    lat: number,
    lng: number
}

export function defaultDireccion(): Direccion {
    return {
        idUsuario: "",
        idDireccion: "",
        calle: "",
        ciudad: "",
        departamento: "",
        codigoPostal: "",
        pais: "",
        lat: 0,
        lng: 0
    };
}

// ______________________ ______________________ //
export interface Carrito {
    idCarrito: string;
    idUsuario: string;
    detalle: DetalleCarrito[];
    subtotal: number;
    envio: number;
    descuento: number;
    total: number;
}

export function defaultCarrito(): Carrito {
    return {
        idCarrito: "",
        idUsuario: "",
        detalle: [] as DetalleCarrito[],
        subtotal: 0,
        envio: 0,
        descuento: 0,
        total: 0
    };
}

export interface DetalleCarrito {
    idProducto: string;
    sec: number,
    idVendedor: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    imagen: string;

    producto: Producto;
}

export function defaultDetalleCarrito(): DetalleCarrito {
    return {
        idProducto: "",
        sec: 0,
        idVendedor: "",
        cantidad: 0,
        precioUnitario: 0,
        subtotal: 0,
        imagen: "",

        producto: defaultProducto()
    };
}

// ______________________ ______________________ //
export interface Pedido {
    idPedido: string;
    idUsuario: string;
    fecha: string;
    estado: "pendiente" | "pagado" | "enviado" | "entregado"; // | "cancelado"
    subtotal: number,
    envio: number,
    descuento: number,
    total: number;
    codDescuento: string,
    idDireccion: string,
    idPago: string,

    direccion?: Direccion | null;
    pago?: Pago | null;
    detalle?: DetallePedido[] | null;
}

export function defaultPedido(): Pedido {
    return {
        idPedido: "",
        idUsuario: "",
        fecha: "",
        estado: "pendiente",
        subtotal: 0,
        envio: 0,
        descuento: 0,
        total: 0,
        codDescuento: "",
        idDireccion: "",
        idPago: ""
    };
}

export interface DetallePedido {
    id?: string;
    
    idPedido: string;
    idProducto: string;
    sec: number,
    idVendedor: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    imagen: string;
    estado: {
        pendiente: string,
        enviado: string,
        entregado: string
    };
    fecha: string;

    producto: Producto;
    usuario: Usuario;

    direccion: Direccion;
}

export function defaultDetallePedido(): DetallePedido {
    return {
        idPedido: "",
        idProducto: "",
        sec: 0,
        idVendedor: "",
        cantidad: 0,
        precioUnitario: 0,
        subtotal: 0,
        imagen: "",
        estado: {
            pendiente: "",
            enviado: "",
            entregado: ""
        },
        fecha: "",

        producto: defaultProducto(),
        usuario: defaultUsuario(),
        direccion: defaultDireccion()
    };
}

// ______________________ ______________________ //

// ______________________ ______________________ //

// ______________________ ______________________ //

// ______________________ ______________________ //

//"pendiente" | "pagado" | "enviado" | "entregado"