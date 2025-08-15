import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Flashcard Learning App';
  isAuthenticated = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.getAuthState().subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    
    // Set initial auth state
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    // Clean up subscription
    this.authSubscription?.unsubscribe();
  }
}
