import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadPalabras } from './actividad-palabras';

describe('ActividadPalabras', () => {
  let component: ActividadPalabras;
  let fixture: ComponentFixture<ActividadPalabras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadPalabras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadPalabras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
