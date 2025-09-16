import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { DictionaryService, WordPair } from '../services/dictionary.service';
import { InspirationsService, Inspiration } from '../services/inspirations.service';
import { AuthService } from '../services/auth.service';
import { FlashcardComponent } from '../components/flashcard/flashcard.component';
import { InspirationCardComponent } from '../components/inspiration-card/inspiration-card.component';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MatTabsModule, FlashcardComponent, InspirationCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: []
})
export class HomeComponent implements OnInit {
  engWords$!: Observable<WordPair[]>;
  japaneseWords$!: Observable<WordPair[]>;
  allWords$!: Observable<WordPair[]>;
  inspirations$!: Observable<Inspiration[]>;

  private hiddenCardsSubject = new BehaviorSubject<Set<string>>(new Set<string>());

  constructor(
    private dictionaryService: DictionaryService,
    private inspirationsService: InspirationsService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Create observables that react to hidden cards changes
    this.engWords$ = combineLatest([
      this.dictionaryService.getEngWords(),
      this.hiddenCardsSubject
    ]).pipe(
      map(([words, hiddenCards]) => words.filter(word => !hiddenCards.has(word.word)))
    );

    this.japaneseWords$ = combineLatest([
      this.dictionaryService.getJapaneseWords(),
      this.hiddenCardsSubject
    ]).pipe(
      map(([words, hiddenCards]) => words.filter(word => !hiddenCards.has(word.word)))
    );

    this.allWords$ = combineLatest([
      this.engWords$,
      this.japaneseWords$
    ]).pipe(
      map(([engWords, japaneseWords]) => [...engWords, ...japaneseWords])
    );

    // Get inspirations
    this.inspirations$ = this.inspirationsService.getInspirations();
  }

  // Handle card hidden event
  onCardHidden(wordPair: WordPair) {
    const currentHidden = this.hiddenCardsSubject.value;
    const newHidden = new Set(currentHidden);
    newHidden.add(wordPair.word);
    this.hiddenCardsSubject.next(newHidden);
  }


  // Handle inspiration deletion
  async onInspirationDeleted(inspiration: Inspiration) {
    try {
      await this.inspirationsService.deleteInspiration(inspiration);
    } catch (error) {
      console.error('Failed to delete inspiration:', error);
      alert('❌ Failed to delete inspiration. Please try again.');
    }
  }

  // Track by function for better animation performance
  trackByWord(index: number, word: WordPair): string {
    return word.word;
  }

  // Track by function for inspirations
  trackByInspiration(index: number, inspiration: Inspiration): string {
    return inspiration.id;
  }
}
