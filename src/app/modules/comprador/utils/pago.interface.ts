export interface Pago {
    idPago: number,
    metodo: "qr" | "tarjeta" | "transferencia" | "depósito";
    referencia: string;
    monto: number,
    estado: "pendiente" | "completado";
}

export function defaultPago(): Pago {
    return {
        idPago: 0,
        metodo: "qr",
        referencia: "",
        monto: 0,
        estado: "pendiente"
    };
}