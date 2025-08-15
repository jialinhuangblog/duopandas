import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  private correctPassword = environment.adminPassword;

  constructor() {
    // Check if user was previously authenticated (optional - could add localStorage persistence)
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Attempt to authenticate with password
  authenticate(password: string): boolean {
    const isValid = password.trim() === this.correctPassword;
    this.isAuthenticatedSubject.next(isValid);
    return isValid;
  }

  // Log out (lock the app)
  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }

  // Get observable for components to subscribe to auth state changes
  getAuthState(): Observable<boolean> {
    return this.isAuthenticated$;
  }
}