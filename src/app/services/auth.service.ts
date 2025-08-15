import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'duopandas_auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  private correctPassword = environment.adminPassword;

  constructor() {
    // Check if user was previously authenticated from localStorage
    this.loadAuthState();
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Attempt to authenticate with password
  authenticate(password: string): boolean {
    const isValid = password.trim() === this.correctPassword;
    this.setAuthState(isValid);
    return isValid;
  }

  // Log out (lock the app)
  logout(): void {
    this.setAuthState(false);
  }

  // Get observable for components to subscribe to auth state changes
  getAuthState(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  // Load authentication state from localStorage
  private loadAuthState(): void {
    try {
      const storedAuth = localStorage.getItem(this.AUTH_KEY);
      if (storedAuth === 'true') {
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      // localStorage not available (SSR) or other error - default to false
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Set authentication state and persist to localStorage
  private setAuthState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
    try {
      if (isAuthenticated) {
        localStorage.setItem(this.AUTH_KEY, 'true');
      } else {
        localStorage.removeItem(this.AUTH_KEY);
      }
    } catch (error) {
      // localStorage not available - continue without persistence
      console.warn('localStorage not available for auth persistence');
    }
  }
}