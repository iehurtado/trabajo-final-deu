import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosInteresDetail } from './puntos-interes-detail';

describe('PuntosInteresDetail', () => {
  let component: PuntosInteresDetail;
  let fixture: ComponentFixture<PuntosInteresDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntosInteresDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PuntosInteresDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
