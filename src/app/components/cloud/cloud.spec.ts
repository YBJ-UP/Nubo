import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cloud } from './cloud';

describe('Cloud', () => {
  let component: Cloud;
  let fixture: ComponentFixture<Cloud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cloud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cloud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
