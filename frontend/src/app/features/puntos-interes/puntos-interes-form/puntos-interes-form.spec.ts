import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosInteresForm } from './puntos-interes-form';

describe('PuntosInteresForm', () => {
  let component: PuntosInteresForm;
  let fixture: ComponentFixture<PuntosInteresForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntosInteresForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PuntosInteresForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
