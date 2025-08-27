import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export type PeriodoAnalise = 'DIA' | 'SEMANA' | 'MES';

export interface AnaliseLucroResposta {
  totalLucro: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private http = inject(HttpClient);

  getLucro(periodo: PeriodoAnalise): Observable<AnaliseLucroResposta> {
    const url = `${environment.apiUrl}/analises/lucro`;
    const params = { periodo } as const;
    return this.http.get<AnaliseLucroResposta>(url, { params });
  }
}
