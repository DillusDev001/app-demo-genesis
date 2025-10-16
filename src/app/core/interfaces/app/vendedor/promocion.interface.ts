import { Producto } from "./vendedor.interface";

export interface Promocion {
    idPromocion: string;
    idPaquete: string;
    idVendedor: string;
    idProducto: string;
    idPago: string;
    diasContratados: number;
    precioTotal: number;
    fechaInicio: string;
    fechaFin: string;
    estado: "pendiente" | "activa" | "expirada";
    renovable: boolean;

    producto?: Producto;

    ultimaRenovacion?: string;
    metricas?: {
        visualizaciones: number;
        clics: number;
        conversiones: number;
    }
}

export function defaultPromocion(): Promocion {
    return {
        idPromocion: "",
        idPaquete: "",
        idVendedor: "",
        idProducto: "",
        idPago: "",
        diasContratados: 0,
        precioTotal: 0,
        fechaInicio: "",
        fechaFin: "",
        estado: "pendiente",
        renovable: false
    };
}