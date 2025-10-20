import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsHome } from './cards-home';

describe('CardsHome', () => {
  let component: CardsHome;
  let fixture: ComponentFixture<CardsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
