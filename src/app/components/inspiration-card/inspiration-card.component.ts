import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AuthService } from '../../services/auth.service';
import { Inspiration } from '../../services/inspirations.service';

@Component({
  selector: 'app-inspiration-card',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="inspiration-card">
      <mat-card-content>
        <div class="inspiration-content">
          <p class="content">{{ inspiration.content }}</p>
          <p class="source">{{ inspiration.source }}</p>
        </div>

        <div *ngIf="authService.isAuthenticated()" class="card-actions">
          <button mat-icon-button
                  color="warn"
                  (click)="onDelete()"
                  aria-label="Delete inspiration">
            🗑️
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .inspiration-card {
      width: 100%;
      position: relative;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid #e0e0e0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .inspiration-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      border-color: #ccc;
    }

    .inspiration-content {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .content {
      font-size: 0.9em;
      font-style: normal;
      margin-bottom: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .source {
      text-align: right;
      color: #999;
      font-weight: 400;
      font-size: 0.8em;
      margin: 0;
      flex-shrink: 0;
    }

    .card-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .inspiration-card:hover .card-actions {
      opacity: 1;
    }
  `]
})
export class InspirationCardComponent {
  @Input() inspiration!: Inspiration;
  @Output() inspirationDeleted = new EventEmitter<Inspiration>();

  constructor(
    private dialog: MatDialog,
    public authService: AuthService
  ) {}


  onDelete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Inspiration',
        message: `Are you sure you want to delete this inspiration?`,
        content: this.inspiration.content
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inspirationDeleted.emit(this.inspiration);
      }
    });
  }
}