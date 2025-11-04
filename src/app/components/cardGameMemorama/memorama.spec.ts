import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Memorama } from './memorama';

describe('Memorama', () => {
  let component: Memorama;
  let fixture: ComponentFixture<Memorama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Memorama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Memorama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
