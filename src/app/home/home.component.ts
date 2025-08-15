import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { DictionaryService, WordPair } from '../services/dictionary.service';
import { FlashcardComponent } from '../components/flashcard/flashcard.component';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatTabsModule, FlashcardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
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
