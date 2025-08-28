import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export type PeriodoAnalise = 'DIA' | 'SEMANA' | 'MES';
export type PeriodoGrafico = 'SEMANA' | 'MES' | 'ANO';

export interface AnaliseLucroResposta {
  totalLucro: number;
}

export interface GraficoLucroPonto {
  periodo: string;
  lucro: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private http = inject(HttpClient);

  // Lucro total (cards)
  getLucro(periodo: PeriodoAnalise): Observable<AnaliseLucroResposta> {
    const url = `${environment.apiUrl}/analises/lucro-total`;
    const params = { periodo } as const;
    return this.http.get<AnaliseLucroResposta>(url, { params });
  }

  // Dados para gráfico (linha do tempo)
  getLucroGrafico(periodo: PeriodoGrafico): Observable<GraficoLucroPonto[]> {
    const url = `${environment.apiUrl}/analises/lucro-grafico`;
    const params = { periodo } as const;
    return this.http.get<GraficoLucroPonto[]>(url, { params });
  }
}
