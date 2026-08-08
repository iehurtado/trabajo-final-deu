import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialog } from './login-dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('Login', () => {
  let component: LoginDialog;
  let fixture: ComponentFixture<LoginDialog>;
  let hostElement: any;
  let emailInput: HTMLInputElement;
  let passwdInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDialog],
      providers: [NgbActiveModal, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();

    hostElement = fixture.nativeElement;
    emailInput = hostElement.querySelector('input#loginEmail')!;
    passwdInput = hostElement.querySelector('input#loginPassword')!
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an email field', () => {
    expect(emailInput.type).toBe('email');
  });

  it('email field should be labeled "Correo Electrónico"', () => {
    const label: HTMLLabelElement = hostElement.querySelector('label[for=loginEmail]');
    expect(label.textContent).toBe('Correo Electrónico');
  });

  it('should have a password field', () => {
    expect(passwdInput.type).toBe('password');
  });

  it('password field should be labeled "Contraseña"', () => {
    const label: HTMLLabelElement = hostElement.querySelector('label[for=loginPassword]');
    expect(label.textContent).toBe('Contraseña');
  });
});
