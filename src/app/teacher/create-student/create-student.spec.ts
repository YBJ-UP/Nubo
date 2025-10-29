import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudent } from './create-student';

describe('CreateStudent', () => {
  let component: CreateStudent;
  let fixture: ComponentFixture<CreateStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
