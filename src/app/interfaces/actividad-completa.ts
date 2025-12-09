export interface Palabra {
    id: string;
    texto: string;
}

export interface Fonema {
    id: string;
    texto: string;
}

export interface PalabraCompleta {
    id: string;
    palabra: string;
    imagenUrl: string;
    syllables: Palabra[];
    fonemas: Fonema[];
}

export interface ActividadCompleta {
    sincronizado: boolean;
    id: string;
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
