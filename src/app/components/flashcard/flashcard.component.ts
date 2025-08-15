import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { WordPair } from '../../services/dictionary.service';

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule, MatCardModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss'
})
export class FlashcardComponent {
  @Input() wordPair!: WordPair;
  isFlipped = false;

  flip() {
    this.isFlipped = !this.isFlipped;
  }
}
