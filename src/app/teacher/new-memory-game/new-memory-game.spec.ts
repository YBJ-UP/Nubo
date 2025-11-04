import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemoryGame } from './new-memory-game';

describe('NewMemoryGame', () => {
  let component: NewMemoryGame;
  let fixture: ComponentFixture<NewMemoryGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMemoryGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMemoryGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
