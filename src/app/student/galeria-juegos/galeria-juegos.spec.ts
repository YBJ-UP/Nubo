import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaJuegos } from './galeria-juegos';

describe('GaleriaJuegos', () => {
  let component: GaleriaJuegos;
  let fixture: ComponentFixture<GaleriaJuegos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaJuegos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaJuegos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
