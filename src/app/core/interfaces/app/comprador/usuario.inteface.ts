import { Producto } from "../../vendedor/utils/vendedor.interface";
import { Pago } from "./pago.interface";

export interface Usuario {
    idUsuario: number;
    email: string;
    password: string;
    nombre: string;
    whatsapp: string;

    direcciones?: Direccion[];
}

export function defaultUsuario(): Usuario {
    return {
        idUsuario: 0,
        email: "",
        password: "",
        nombre: "",
        whatsapp: ""
    };
}

export interface Direccion {
    idDireccion: number;
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
        idDireccion: 0,
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
    idUsuario: number;
    detalle: DetalleCarrito[];
    total: number;
}

export function defaultCarrito(): Carrito {
    return {
        idUsuario: 0,
        detalle: [],
        total: 0
    };
}

export interface DetalleCarrito {
    idProducto: number;
    sec: number,
    idVendedor: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    imagen: string;

    producto?: Producto;
}

export function defaultDetalleCarrito(): DetalleCarrito {
    return {
        idProducto: 0,
        sec: 0,
        idVendedor: 0,
        cantidad: 0,
        precioUnitario: 0,
        subtotal: 0,
        imagen: ""
    };
}

// ______________________ ______________________ //
export interface Pedido {
    idPedido: number;
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
        idPedido: 0,
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
    idPedido: number;
    idProducto: number;
    sec: number,
    idVendedor: number;
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
        idPedido: 0,
        idProducto: 0,
        sec: 0,
        idVendedor: 0,
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