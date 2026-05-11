import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosInteresList } from './puntos-interes-list';

describe('PuntosInteresList', () => {
  let component: PuntosInteresList;
  let fixture: ComponentFixture<PuntosInteresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntosInteresList],
    }).compileComponents();

    fixture = TestBed.createComponent(PuntosInteresList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
