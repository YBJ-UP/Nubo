import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaPalabras } from './galeria-palabras';

describe('GaleriaPalabras', () => {
  let component: GaleriaPalabras;
  let fixture: ComponentFixture<GaleriaPalabras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaPalabras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaPalabras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
