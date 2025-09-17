import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verifica se a requisição é para a nossa API backend
  if (req.url.startsWith(environment.apiUrl)) {
    // Clona a requisição e adiciona a opção withCredentials
    const authReq = req.clone({
      withCredentials: true,
    });
    return next(authReq);
  }

  // Para outras requisições, não faz nada
  return next(req);
};