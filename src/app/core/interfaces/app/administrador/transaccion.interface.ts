export interface Transaccion {
    idTransaccion: number;
    idPedido: number;
    tipo: "venta" | "comision" | "pago";
    metodo: "qr" | "tarjeta" | "transferencia";
    monto: number;
    fecha: string;
}

export function defaultTransaccion(): Transaccion {
    return {
        idTransaccion: 0,
        idPedido: 0,
        tipo: "venta",
        metodo: "qr",
        monto: 0,
        fecha: ""
    };
}