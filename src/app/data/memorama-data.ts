
export interface MemoramaData {
  id: number;
  titulo: string;
  colorFondo: string; 
  imagenUrl: string; 
  rondaId: number;   
}
export const MEMORAMA_DATA_MOCK: MemoramaData[] = [
    { 
      id: 1, 
      titulo: 'Tema: Animales Salvajes', 
      colorFondo: '#BDE0FE', 
      imagenUrl: '/assets/memorama/animales.png', 
      rondaId: 101 
    },
    { 
      id: 2, 
      titulo: 'Tema: Frutas y Verduras', 
      colorFondo: '#F78C8C', 
      imagenUrl: '/assets/memorama/frutas.png', 
      rondaId: 102 
    },
    { 
      id: 3, 
      titulo: 'Tema: Instrumentos Musicales', 
      colorFondo: '#D4BFFF', 
      imagenUrl: '/assets/memorama/instrumentos.png', 
      rondaId: 103 
    },
    { 
      id: 4, 
      titulo: 'Tema: Transporte', 
      colorFondo: '#FEF9C3',
      imagenUrl: '/assets/memorama/transporte.png', 
      rondaId: 104 
    },
    { 
      id: 5, 
      titulo: 'Tema: Figuras Geométricas', 
      colorFondo: '#D9F7C4', 
      imagenUrl: '/assets/memorama/figuras.png', 
      rondaId: 105 
    },
    { 
      id: 6, 
      titulo: 'Tema: Profesiones', 
      colorFondo: '#C3D4FE', 
      imagenUrl: '/assets/memorama/profesiones.png', 
      rondaId: 106 
    },
];