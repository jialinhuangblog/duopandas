import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DictionaryService, WordPair } from '../services/dictionary.service';
import { InspirationsService } from '../services/inspirations.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  word = '';
  translation = '';
  language: 'eng' | 'japanese' = 'eng';

  // Inspiration fields
  content = '';
  source = '';

  // Form type selection
  formType: 'dictionary' | 'inspiration' = 'dictionary';

  isFlicking = false;
  isLocked = true;
  password = '';
  private authSubscription?: Subscription;

  constructor(
    private dictionaryService: DictionaryService,
    private inspirationsService: InspirationsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.getAuthState().subscribe(
      isAuthenticated => {
        this.isLocked = !isAuthenticated;
      }
    );

    // Set initial state
    this.isLocked = !this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    // Clean up subscription
    this.authSubscription?.unsubscribe();
  }

  async onSubmit() {
    if (this.formType === 'dictionary') {
      await this.submitDictionary();
    } else {
      await this.submitInspiration();
    }
  }

  async submitDictionary() {
    if (this.word.trim() && this.translation.trim()) {
      const newPair: WordPair = {
        word: this.word.trim(),
        translation: this.translation.trim(),
        category: this.language
      };

      try {
        await this.dictionaryService.addWordPair(newPair);

        // Clear form on success
        this.word = '';
        this.translation = '';

        // Flick animation twice
        this.flickForm();
      } catch (error) {
        console.error('Failed to add word:', error);
        alert('❌ Failed to add word. Please try again.');
      }
    }
  }

  async submitInspiration() {
    if (this.content.trim() && this.source.trim()) {
      try {
        await this.inspirationsService.addInspiration({
          content: this.content.trim(),
          source: this.source.trim()
        });

        // Clear form on success
        this.content = '';
        this.source = '';

        // Flick animation twice
        this.flickForm();
      } catch (error) {
        console.error('Failed to add inspiration:', error);
        alert('❌ Failed to add inspiration. Please try again.');
      }
    }
  }

  clear() {
    if (this.formType === 'dictionary') {
      this.word = '';
      this.translation = '';
    } else {
      this.content = '';
      this.source = '';
    }
  }

  // Batch import inspirations
  async importInspirations() {
    try {
      await this.inspirationsService.batchImportInspirations();
      this.flickForm();
      alert('✅ Successfully imported inspirations!');
    } catch (error) {
      console.error('Failed to import inspirations:', error);
      alert('❌ Failed to import inspirations. Please try again.');
    }
  }

  // Password validation using AuthService
  async checkPassword() {
    const result = await this.authService.authenticate(this.password)
    if (result) {
      // Authentication successful - AuthService will update state
      this.password = '';
    } else {
      // Authentication failed - could add error feedback here
      this.password = '';
    }
  }

  // Lock the app (logout)
  lockApp() {
    this.authService.logout();
  }

  // Flick the form twice for success feedback
  private flickForm() {
    this.isFlicking = true;

    // Reset after animation completes (600ms total for 2 flicks)
    setTimeout(() => {
      this.isFlicking = false;
    }, 600);
  }
}
