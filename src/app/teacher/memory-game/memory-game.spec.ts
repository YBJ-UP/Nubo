import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryGame } from './memory-game';

describe('MemoryGame', () => {
  let component: MemoryGame;
  let fixture: ComponentFixture<MemoryGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
