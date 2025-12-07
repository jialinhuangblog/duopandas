import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'duopandas_auth_check';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private firestore = inject(Firestore);

  constructor() {
    // Check if user was previously authenticated from localStorage
    this.loadAuthState();
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Simple hash function (SHA-256)
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Attempt to authenticate with password
  async authenticate(password: string): Promise<boolean> {
    try {
      // Hash the input password
      const hashedPassword = await this.hashPassword(password.trim());
      // Get the stored hash from Firestore
      const configDoc = doc(this.firestore, 'config/auth');
      const docSnap = await getDoc(configDoc);

      if (docSnap.exists()) {
        const storedHash = docSnap.data()['passwordHash'];
        const isValid = hashedPassword === storedHash;
        this.setAuthState(isValid);
        return isValid;
      } else {
        console.error('Auth config not found in Firestore');
        this.setAuthState(false);
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      this.setAuthState(false);
      return false;
    }
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