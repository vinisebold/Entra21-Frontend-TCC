import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoLucro } from './grafico-lucro';

describe('GraficoLucro', () => {
  let component: GraficoLucro;
  let fixture: ComponentFixture<GraficoLucro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoLucro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoLucro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
