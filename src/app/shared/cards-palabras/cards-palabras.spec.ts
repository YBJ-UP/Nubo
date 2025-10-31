import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPalabras } from './cards-palabras';

describe('CardsPalabras', () => {
  let component: CardsPalabras;
  let fixture: ComponentFixture<CardsPalabras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPalabras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsPalabras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
