import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, firstValueFrom } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './services/auth.service';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Flashcard Learning App';
  isAuthenticated = false;
  showHeader = true;
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.getAuthState().subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    
    // Set initial auth state
    this.isAuthenticated = this.authService.isAuthenticated();

    // Subscribe to router events to hide header on admin page
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = !event.url.includes('/admin');
      });

    // Set initial header visibility
    this.showHeader = !this.router.url.includes('/admin');
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  // Auth toggle method
  async toggleAuth() {
    const isAuth = await firstValueFrom(this.authService.isAuthenticated$.pipe(take(1)));
    
    if (isAuth) {
      this.authService.logout();
    } else {
      const dialogRef = this.dialog.open(PasswordDialogComponent, {
        width: '400px',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe(password => {
        if (password) {
          this.authService.authenticate(password);
        }
      });
    }
  }
}
