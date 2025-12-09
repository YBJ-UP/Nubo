import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PalabraCompleta } from '../../interfaces/actividad-completa';

export interface ActivityFormState {
  titulo: string;
  imagenPortada: string;
  palabrasCompletas: PalabraCompleta[];
  mostrarInstrucciones: boolean;
  isSubmitting: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityFormStateService {
  private readonly initialState: ActivityFormState = {
    titulo: '',
    imagenPortada: 'perfil.jpg',
    palabrasCompletas: [],
    mostrarInstrucciones: false,
    isSubmitting: false
  };

  private stateSubject = new BehaviorSubject<ActivityFormState>(this.initialState);
  public state$: Observable<ActivityFormState> = this.stateSubject.asObservable();

  getState(): ActivityFormState {
    return this.stateSubject.getValue();
  }

  updateTitulo(titulo: string): void {
    const currentState = this.getState();
    this.stateSubject.next({ ...currentState, titulo });
  }

  updateImagenPortada(imagenPortada: string): void {
    const currentState = this.getState();
    this.stateSubject.next({ ...currentState, imagenPortada });
  }

  updatePalabrasCompletas(palabrasCompletas: PalabraCompleta[]): void {
    const currentState = this.getState();
    this.stateSubject.next({ ...currentState, palabrasCompletas });
  }

  addPalabraCompleta(palabra: PalabraCompleta): void {
    const currentState = this.getState();
    const palabrasCompletas = [...currentState.palabrasCompletas, palabra];
    this.stateSubject.next({ ...currentState, palabrasCompletas });
  }

  removePalabraCompleta(index: number): void {
    const currentState = this.getState();
    const palabrasCompletas = currentState.palabrasCompletas.filter((_, i) => i !== index);
    this.stateSubject.next({ ...currentState, palabrasCompletas });
  }

  updatePalabraAt(index: number, palabra: PalabraCompleta): void {
    const currentState = this.getState();
    const palabrasCompletas = [...currentState.palabrasCompletas];
    palabrasCompletas[index] = palabra;
    this.stateSubject.next({ ...currentState, palabrasCompletas });
  }

  toggleInstrucciones(): void {
    const currentState = this.getState();
    this.stateSubject.next({
      ...currentState,
      mostrarInstrucciones: !currentState.mostrarInstrucciones
    });
  }

  setSubmitting(isSubmitting: boolean): void {
    const currentState = this.getState();
    this.stateSubject.next({ ...currentState, isSubmitting });
  }

  resetState(): void {
    this.stateSubject.next(this.initialState);
  }
}