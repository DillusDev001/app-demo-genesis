export interface ApiBotResult {

    title: string;
    route: string;
    status: string;
    code: number;
    contenido: {
        message: string;
        number: number;
        text: string;
        media: string | null;
    };
    boolean: boolean;
    rows: number;
    data: any[] | null;

}