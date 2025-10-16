import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nube } from './nube';

describe('Nube', () => {
  let component: Nube;
  let fixture: ComponentFixture<Nube>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nube]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nube);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
