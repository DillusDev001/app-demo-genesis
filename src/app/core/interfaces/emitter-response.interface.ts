// sirve para emitir respuesta del componente hijo en Angular
export interface EmitterResponse {
    bool: boolean;
    data: any;
}

export function emitterDefault(): EmitterResponse{
    return {
    bool: false,
    data: null
}
}