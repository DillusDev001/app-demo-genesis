
import { Producto } from "../vendedor/vendedor.interface";
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
    idUsuario: string;
    detalle: DetalleCarrito[];
    subtotal: number;
    envio: number;
    descuento: number;
    total: number;
}

export function defaultCarrito(): Carrito {
    return {
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

    producto?: Producto;
}

export function defaultDetalleCarrito(): DetalleCarrito {
    return {
        idProducto: "",
        sec: 0,
        idVendedor: "",
        cantidad: 0,
        precioUnitario: 0,
        subtotal: 0,
        imagen: ""
    };
}

// ______________________ ______________________ //
export interface Pedido {
    idPedido: string;
    idUsuario: number;
    fecha: string;
    estado: "pendiente" | "pagado" | "enviado" | "entregado"; // | "cancelado"
    subtotal: number,
    descuento: number,
    total: number;
    codDescuento: string,
    idDireccion: number,
    idPago: number,

    direccion?: Direccion;
    pago?: Pago;
    detalle?: DetallePedido[];
}

export function defaultPedido(): Pedido {
    return {
        idPedido: "",
        idUsuario: 0,
        fecha: "",
        estado: "pendiente",
        subtotal: 0,
        descuento: 0,
        total: 0,
        codDescuento: "",
        idDireccion: 0,
        idPago: 0
    };
}

export interface DetallePedido {
    idPedido: string;
    idProducto: string;
    sec: number,
    idVendedor: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    imagen: string;
    estado: {
        pendiente: "",
        enviado: "",
        entregado: ""
    };

    producto?: Producto;
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
        }
    };
}

// ______________________ ______________________ //

// ______________________ ______________________ //

// ______________________ ______________________ //

// ______________________ ______________________ //

//"pendiente" | "pagado" | "enviado" | "entregado"