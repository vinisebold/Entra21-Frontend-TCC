import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { tap, catchError, of, Observable } from 'rxjs';

export interface User {
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null | undefined>(undefined);
  isAuthenticated = computed(() => !!this.currentUser());

  // fetch current user
  fetchCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/user/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/../logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        console.log('Logout successful');
      })
    );
  }
}
