import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginType } from './login-type';

describe('LoginType', () => {
  let component: LoginType;
  let fixture: ComponentFixture<LoginType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
