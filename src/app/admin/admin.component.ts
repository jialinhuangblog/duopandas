import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DictionaryService, WordPair } from '../services/dictionary.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
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
export class AdminComponent {
  word = '';
  translation = '';
  language: 'eng' | 'japanese' = 'eng';

  constructor(private dictionaryService: DictionaryService) {}

  async onSubmit() {
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
        
        alert('✨ Word added to Firestore successfully! ✨');
      } catch (error) {
        console.error('Failed to add word:', error);
        alert('❌ Failed to add word. Please try again.');
      }
    }
  }

  clear() {
    this.word = '';
    this.translation = '';
  }
}
