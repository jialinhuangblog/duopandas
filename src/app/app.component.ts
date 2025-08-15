import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { DictionaryService, WordPair } from './services/dictionary.service';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatToolbarModule, MatTabsModule, FlashcardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Flashcard Learning App';
  engWords$!: Observable<WordPair[]>;
  japaneseWords$!: Observable<WordPair[]>;
  allWords$!: Observable<WordPair[]>;

  constructor(private dictionaryService: DictionaryService) {}

  ngOnInit() {
    this.engWords$ = this.dictionaryService.getEngWords();
    this.japaneseWords$ = this.dictionaryService.getJapaneseWords();
    
    this.allWords$ = combineLatest([
      this.engWords$,
      this.japaneseWords$
    ]).pipe(
      map(([engWords, japaneseWords]) => [...engWords, ...japaneseWords])
    );
  }
}
