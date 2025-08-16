import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordPair } from '../../services/dictionary.service';

@Component({
  selector: 'app-delete-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCheckboxModule, FormsModule],
  template: `
    <div class="delete-dialog">
      <h2 mat-dialog-title>🗑️ Delete Flashcard</h2>
      
      <mat-dialog-content>
        <p>Are you sure you want to delete this flashcard?</p>
        <div class="word-preview">
          <strong>"{{ data.word }}"</strong>
          <span class="arrow">→</span>
          <em>{{ formatText(data.translation) }}</em>
        </div>
        <p class="warning">This will permanently remove it from Firestore.</p>
        
        <div class="checkbox-section">
          <mat-checkbox 
            [(ngModel)]="dontShowAgain"
            class="dont-show-checkbox">
            Don't show this dialog again
          </mat-checkbox>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-stroked-button 
                (click)="onCancel()"
                class="cancel-btn">
          Cancel
        </button>
        <button mat-raised-button 
                color="warn" 
                (click)="onDelete()"
                class="delete-btn">
          🗑️ Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog {
      font-family: 'JetBrains Mono', monospace;
    }
    
    h2 {
      font-family: 'JetBrains Mono', monospace !important;
      font-weight: 600;
      color: #dc143c;
      margin: 0 0 16px 0;
    }
    
    .word-preview {
      background: rgba(255, 219, 0, 0.1);
      border: 2px solid #ffdb00;
      border-radius: 0;
      padding: 12px;
      margin: 16px 0;
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .arrow {
      margin: 0 12px;
      color: #dc143c;
      font-weight: bold;
    }
    
    .warning {
      color: #dc143c;
      font-size: 0.9rem;
      font-style: italic;
    }
    
    .cancel-btn {
      font-family: 'JetBrains Mono', monospace !important;
      border-radius: 0 !important;
      border: 2px solid #666 !important;
    }
    
    .delete-btn {
      font-family: 'JetBrains Mono', monospace !important;
      border-radius: 0 !important;
      background: #dc143c !important;
      color: white !important;
    }
    
    .checkbox-section {
      margin: 16px 0;
      padding: 8px 0;
      border-top: 1px solid #eee;
    }
    
    .dont-show-checkbox {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 0.9rem;
    }
  `]
})
export class DeleteDialogComponent {
  dontShowAgain = false;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WordPair
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close({ 
      confirmed: true, 
      dontShowAgain: this.dontShowAgain 
    });
  }

  formatText(text: string): string {
    if (!text) return '';
    return text.replace(/\\n/g, ' ');
  }
}