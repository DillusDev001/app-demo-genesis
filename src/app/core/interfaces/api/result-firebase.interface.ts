// Mustra el resultado de la respuesta de la API (en este caso Firebase)
export interface ResultFirebase<T> {
    success: boolean;
    message?: string;
    error?: any;
    number?: number;
    data?: T;
}


export function defaultResultFirebase<T>(): ResultFirebase<T> {
    return {
        success: false,
    };
}