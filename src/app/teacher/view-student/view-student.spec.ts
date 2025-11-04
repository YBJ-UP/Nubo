import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudent } from './view-student';

describe('ViewStudent', () => {
  let component: ViewStudent;
  let fixture: ComponentFixture<ViewStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
