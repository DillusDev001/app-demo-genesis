export interface Pago {
    idPago: string,
    metodo: "qr" | "tarjeta" | "transferencia" | "depósito";
    referencia: string;
    monto: number,
    estado: "pendiente" | "completado";
}

export function defaultPago(): Pago {
    return {
        idPago: "",
        metodo: "qr",
        referencia: "",
        monto: 0,
        estado: "pendiente"
    };
}