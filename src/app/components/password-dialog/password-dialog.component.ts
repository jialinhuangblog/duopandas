import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="password-dialog">
      <h2 mat-dialog-title>🔓 Unlock Admin</h2>
      
      <mat-dialog-content>
        <p>Enter the admin password to unlock features:</p>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput 
                 type="password"
                 [(ngModel)]="password"
                 placeholder="Enter password"
                 (keyup.enter)="onUnlock()"
                 #passwordInput>
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button 
                color="primary" 
                (click)="onUnlock()"
                [disabled]="!password">
          🔓 Unlock
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .password-dialog {
      min-width: 350px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    h2 {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      margin-bottom: 0;
    }
    
    p {
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 20px;
      color: #666;
    }
    
    button {
      font-family: 'JetBrains Mono', monospace !important;
      font-weight: 500 !important;
    }
  `]
})
export class PasswordDialogComponent {
  password = '';

  constructor(
    private dialogRef: MatDialogRef<PasswordDialogComponent>
  ) {}

  onUnlock(): void {
    if (this.password) {
      this.dialogRef.close(this.password);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}