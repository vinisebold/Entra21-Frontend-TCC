import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoProduto } from './grafico-produto';

describe('GraficoProduto', () => {
  let component: GraficoProduto;
  let fixture: ComponentFixture<GraficoProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
