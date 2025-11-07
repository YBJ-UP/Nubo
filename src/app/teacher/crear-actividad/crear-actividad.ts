import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActividadCognitiva, PalabraActividad } from '../../interfaces/ActividadCognitiva';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit {
  titulo: string = '';
  palabras: PalabraActividad[] = [];
  imagenPrincipalUrl: string = 'perfil.jpg';
  
  constructor(
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Componente CrearActividad cargado');
    // Inicializar con 3 palabras vacías
    this.agregarPalabra();
    this.agregarPalabra();
    this.agregarPalabra();
  }

  agregarPalabra(): void {
    const nuevaPalabra: PalabraActividad = {
      id: Date.now() + Math.random(),
      texto: '',
      imagenUrl: undefined
    };
    this.palabras.push(nuevaPalabra);
  }

  eliminarPalabra(id: number): void {
    if (this.palabras.length > 1) {
      this.palabras = this.palabras.filter(p => p.id !== id);
    }
  }

  onImagenSeleccionada(event: Event, palabraId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const palabra = this.palabras.find(p => p.id === palabraId);
        if (palabra) {
          palabra.imagenUrl = e.target?.result as string;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  trigggerFileInput(palabraId: number): void {
    const inputElement = document.getElementById(`file-input-${palabraId}`) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  }

  guardarActividad(): void {
    if (!this.titulo.trim()) {
      alert('Por favor, ingresa un título para la actividad');
      return;
    }

    const palabrasCompletas = this.palabras.filter(p => p.texto.trim());
    
    if (palabrasCompletas.length === 0) {
      alert('Por favor, agrega al menos una palabra');
      return;
    }

    const actividad: ActividadCognitiva = {
      id: Date.now(),
      titulo: this.titulo,
      palabras: palabrasCompletas,
      imagenPrincipal: this.imagenPrincipalUrl
    };

    // Guardar actividad en localStorage
    console.log('Guardando actividad:', actividad);
    
    try {
      const actividadesGuardadas = localStorage.getItem('actividades_cognitivas');
      const actividades = actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
      actividades.push(actividad);
      localStorage.setItem('actividades_cognitivas', JSON.stringify(actividades));

      alert('Actividad guardada exitosamente');
      this.regresar();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la actividad');
    }
  }

  regresar(): void {
    this.location.back();
  }
}