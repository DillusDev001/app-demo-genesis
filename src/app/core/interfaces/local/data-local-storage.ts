import { Usuario } from "../app/comprador/usuario.inteface";
import { Vendedor } from "../app/vendedor/vendedor.interface";

export interface DataLocalStorage {
    type: string;
    usuario: Usuario | null;
    vendedor: Vendedor | null;
    loggedDate: String | null;
}

export function defaultDataLocalStorage(): DataLocalStorage {
    return {
        type: '',
        usuario: null,
        vendedor: null,
        loggedDate: null
    };
}