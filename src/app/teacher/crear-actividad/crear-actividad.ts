import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface Palabra {
  id: number;
  texto: string;
}

interface Fonema {
  id: number;
  texto: string;
}

interface ActividadCompleta {
  id: number;
  titulo: string;
  imagenPrincipal: string;
  palabras: Palabra[];
  fonemas: Fonema[];
  fechaCreacion: Date;
}

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit {
  @ViewChild('imagenPrincipalInput') imagenPrincipalInput!: ElementRef<HTMLInputElement>;

  titulo: string = '';
  imagenPrincipalUrl: string = 'perfil.jpg';
  palabras: Palabra[] = [];
  fonemas: Fonema[] = [];
  mostrarInstrucciones: boolean = false;
  
  constructor(
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Componente CrearActividad cargado correctamente');
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    // Inicializar con 3 palabras vacías
    for (let i = 0; i < 3; i++) {
      this.agregarPalabra();
    }
    
    // Inicializar con 4 fonemas vacíos
    for (let i = 0; i < 4; i++) {
      this.agregarFonema();
    }
  }

  toggleInstrucciones(): void {
    this.mostrarInstrucciones = !this.mostrarInstrucciones;
  }

  // MÉTODOS PARA IMAGEN PRINCIPAL
  triggerImagenPrincipal(): void {
    if (this.imagenPrincipalInput) {
      this.imagenPrincipalInput.nativeElement.click();
    }
  }

  onImagenPrincipalSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPrincipalUrl = e.target?.result as string;
        console.log('Imagen principal cargada');
      };
      reader.readAsDataURL(file);
    }
  }

  // MÉTODOS PARA PALABRAS (SÍLABAS)
  agregarPalabra(): void {
    const nuevaPalabra: Palabra = {
      id: Date.now() + Math.random(),
      texto: ''
    };
    this.palabras.push(nuevaPalabra);
    console.log('Palabra agregada. Total:', this.palabras.length);
  }

  eliminarPalabra(id: number): void {
    if (this.palabras.length > 1) {
      this.palabras = this.palabras.filter(p => p.id !== id);
      console.log('Palabra eliminada. Total:', this.palabras.length);
    } else {
      alert('Debe haber al menos una sílaba.');
    }
  }

  // MÉTODOS PARA FONEMAS
  agregarFonema(): void {
    const nuevoFonema: Fonema = {
      id: Date.now() + Math.random(),
      texto: ''
    };
    this.fonemas.push(nuevoFonema);
    console.log('Fonema agregado. Total:', this.fonemas.length);
  }

  eliminarFonema(id: number): void {
    if (this.fonemas.length > 1) {
      this.fonemas = this.fonemas.filter(f => f.id !== id);
      console.log('Fonema eliminado. Total:', this.fonemas.length);
    } else {
      alert('Debe haber al menos un fonema.');
    }
  }

  // MÉTODO PARA AGREGAR NUEVA PALABRA COMPLETA (limpia todo)
  agregarNuevaPalabra(): void {
    if (confirm('¿Deseas agregar una nueva palabra? Esto creará nuevos campos vacíos.')) {
      // Agregar una nueva sílaba
      this.agregarPalabra();
      // Agregar un nuevo fonema
      this.agregarFonema();
      
      console.log('Nueva palabra iniciada');
    }
  }

  // GUARDAR ACTIVIDAD
  guardarActividad(): void {
    // Validaciones
    if (!this.titulo.trim()) {
      alert('Por favor, ingresa un título para la actividad');
      return;
    }

    const palabrasCompletas = this.palabras.filter(p => p.texto.trim());
    if (palabrasCompletas.length === 0) {
      alert('Por favor, agrega al menos una sílaba');
      return;
    }

    const fonemasCompletos = this.fonemas.filter(f => f.texto.trim());
    if (fonemasCompletos.length === 0) {
      alert('Por favor, agrega al menos un fonema');
      return;
    }

    if (this.imagenPrincipalUrl === 'perfil.jpg') {
      if (!confirm('No has subido una imagen. ¿Deseas continuar sin imagen?')) {
        return;
      }
    }

    // Crear objeto de actividad
    const actividad: ActividadCompleta = {
      id: Date.now(),
      titulo: this.titulo,
      imagenPrincipal: this.imagenPrincipalUrl,
      palabras: palabrasCompletas,
      fonemas: fonemasCompletos,
      fechaCreacion: new Date()
    };

    // Guardar en localStorage
    try {
      const actividadesGuardadas = localStorage.getItem('actividades_cognitivas');
      const actividades = actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
      
      actividades.push(actividad);
      localStorage.setItem('actividades_cognitivas', JSON.stringify(actividades));

      console.log('Actividad guardada exitosamente:', actividad);
      
      alert('✅ Actividad guardada exitosamente');
      this.regresar();
    } catch (error) {
      console.error('Error al guardar la actividad:', error);
      alert('❌ Error al guardar la actividad. Por favor, intenta de nuevo.');
    }
  }

  // NAVEGACIÓN
  regresar(): void {
    if (this.titulo.trim() || this.imagenPrincipalUrl !== 'perfil.jpg') {
      if (confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.')) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }

  // MÉTODO AUXILIAR PARA DEBUGGING
  mostrarEstado(): void {
    console.log('=== Estado actual ===');
    console.log('Título:', this.titulo);
    console.log('Palabras:', this.palabras);
    console.log('Fonemas:', this.fonemas);
    console.log('Imagen:', this.imagenPrincipalUrl);
  }
}