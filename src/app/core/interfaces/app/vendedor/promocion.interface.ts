export interface PaquetePromocion {
    idPaquete: number;
    nombre: string; // Básico, Premium, Gold
    descripcion: string;
    lugar: "banner" | "destacado" | "sidebar" | "home" | "categoria"; // agregar ideas
    precioBase: number; // precio mínimo (ej: 10 Bs por día)
    duracionesDisponibles: DuracionOpcion[];
    beneficios: string[];
    //tipoCobro: "por_dia" | "por_click" | "por_conversion"; // Ver factivilidad
}

export interface DuracionOpcion {
    dias: number;
    precio: number; // precio total por esos días
}

export function defaultPaquetePromocion(): PaquetePromocion {
    return {
        idPaquete: 0,
        nombre: "",
        descripcion: "",
        lugar: "banner",
        precioBase: 0,
        duracionesDisponibles: [],
        beneficios: []
    };
}

// ______________________ ______________________ //

export interface Promocion {
    idPromocion: number;
    idPaquete: number;
    idVendedor: number;
    idProducto: number;
    idPago: number;
    diasContratados: number;
    precioTotal: number;
    fechaInicio: string;
    fechaFin: string;
    estado: "pendiente" | "activa" | "expirada";
    renovable: boolean;

    ultimaRenovacion?: string;
    metricas?: {
        visualizaciones: number;
        clics: number;
        conversiones: number;
    }
}

export function defaultPromocion(): Promocion {
    return {
        idPromocion: 0,
        idPaquete: 0,
        idVendedor: 0,
        idProducto: 0,
        idPago: 0,
        diasContratados: 0,
        precioTotal: 0,
        fechaInicio: "",
        fechaFin: "",
        estado: "pendiente",
        renovable: false
    };
}