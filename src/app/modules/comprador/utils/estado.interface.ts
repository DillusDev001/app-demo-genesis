export interface Estado {
    inicio: string,
    pagado: string,
    enviado: string,
    entregado: string
}

export function defaultEstado(): Estado {
    return {
        inicio: '',
        pagado: '',
        enviado: '',
        entregado: ''
    }
}