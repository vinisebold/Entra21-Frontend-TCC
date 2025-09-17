import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is already authenticated, allow access.
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not, fetch the user and then decide.
  return authService.fetchCurrentUser().pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        // If there's no user, redirect to the landing page.
        return router.createUrlTree(['/']);
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/']));
    })
  );
};
