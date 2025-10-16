export interface Paquete {
    idPaquete: string;
    nombre: string; // Básico, Premium, Gold
    descripcion: string;
    lugar: "banner" | "destacado" | "sidebar" | "home" | "categoria"; // agregar ideas
    precioBase: number; // precio mínimo (ej: 10 Bs por día)
    duracionesDisponibles: DuracionOpcion[];
    beneficios: string[];
    imagen: string;
    //tipoCobro: "por_dia" | "por_click" | "por_conversion"; // Ver factivilidad
}

export interface DuracionOpcion {
    dias: number;
    precio: number; // precio total por esos días
}

export function defaultPaquetePromocion(): Paquete {
    return {
        idPaquete: "",
        nombre: "",
        descripcion: "",
        lugar: "banner",
        precioBase: 0,
        duracionesDisponibles: [],
        beneficios: [],
        imagen: ""
    };
}