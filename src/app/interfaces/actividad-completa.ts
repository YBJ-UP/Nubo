export interface Palabra {
    id: number;
    texto: string;
}

export interface Fonema {
    id: number;
    texto: string;
}

export interface PalabraCompleta {
    id: number;
    palabra: string;
    imagenUrl: string;
    syllables: Palabra[];
    fonemas: Fonema[];
}

export interface ActividadCompleta {
    sincronizado: boolean;
    id: string | number;
    titulo: string;
    imagenPortada: string;
    palabrasCompletas: PalabraCompleta[];
    fechaCreacion: Date;
}


export interface ResultadoOperacion {
    exito: boolean;
    mensaje: string;
    url?: string;
    data?: any;
}
