import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GraficoProduto } from './grafico-produto';
import { EstoqueService } from '../../services/estoque.service';

describe('GraficoProduto', () => {
  let component: GraficoProduto;
  let fixture: ComponentFixture<GraficoProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoProduto, HttpClientTestingModule],
      providers: [
        {
          provide: EstoqueService,
          useValue: {
            getResumoPorCategoria: () => of([]),
          },
        },
      ],
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
