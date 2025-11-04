import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudent } from './new-student';

describe('NewStudent', () => {
  let component: NewStudent;
  let fixture: ComponentFixture<NewStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
