import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsMemorama } from './cards-memorama';

describe('CardsMemorama', () => {
  let component: CardsMemorama;
  let fixture: ComponentFixture<CardsMemorama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsMemorama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsMemorama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
