import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMemoryGame } from './menu-memory-game';

describe('MenuMemoryGame', () => {
  let component: MenuMemoryGame;
  let fixture: ComponentFixture<MenuMemoryGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuMemoryGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuMemoryGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
