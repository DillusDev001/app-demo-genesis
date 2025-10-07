export interface Categoria {
    idCategoria: string;
    nombre: string;          // Ej: "Electrónica"
    descripcion: string;     // Descripción general de la categoría
    imagen: string;          // Banner o ícono representativo
    subCategorias: string[]; // Ej: ["Laptops", "Auriculares", "Cámaras"]
}

export function defaultCategoria(): Categoria {
    return {
        idCategoria: "",
        nombre: "",
        descripcion: "",
        imagen: "",
        subCategorias: []
    };
}