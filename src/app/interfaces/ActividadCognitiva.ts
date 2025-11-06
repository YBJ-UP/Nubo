export interface PalabraActividad {
  id: number;
  texto: string;
  imagenUrl?: string;
}

export interface ActividadCognitiva {
  id: number;
  titulo: string;
  palabras: PalabraActividad[];
  imagenPrincipal?: string;
}