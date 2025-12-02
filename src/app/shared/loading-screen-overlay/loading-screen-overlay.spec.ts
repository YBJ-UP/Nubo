import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingScreenOverlay } from './loading-screen-overlay';

describe('LoadingScreenOverlay', () => {
  let component: LoadingScreenOverlay;
  let fixture: ComponentFixture<LoadingScreenOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingScreenOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingScreenOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
