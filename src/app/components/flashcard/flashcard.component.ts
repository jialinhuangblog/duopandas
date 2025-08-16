import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WordPair, DictionaryService } from '../../services/dictionary.service';
import { AuthService } from '../../services/auth.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-flashcard',
  imports: [CommonModule, MatCardModule, MatDialogModule, MatButtonModule],
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.scss'
})
export class FlashcardComponent implements OnInit, OnDestroy {
  @Input() wordPair!: WordPair;
  @Output() cardHidden = new EventEmitter<WordPair>();
  isFlipped = false;
  isHiding = false;
  mondrianColor: string = '';
  borderWidth: number = 6;
  rotation: number = 0;
  cardWidth: string = 'auto';
  cardHeight: string = 'auto';
  isAuthenticated = false;
  private authSubscription?: Subscription;

  // Mondrian color palette with variations
  private mondrianColors = [
    '#dc143c', // Classic red
    '#b91c3c', // Dark red
    '#ff1744', // Bright red
    '#0047ab', // Classic blue
    '#1976d2', // Bright blue
    '#003d82', // Dark blue
    '#ffdb00', // Classic yellow
    '#ffc107', // Bright yellow
    '#ff6f00', // Orange yellow
    '#ffffff', // White
    '#f5f5f5', // Off white
    '#e8e8e8', // Light gray
    '#000000', // Black (rare)
  ];

  constructor(
    private dictionaryService: DictionaryService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    // Generate random Mondrian properties on initialization
    this.mondrianColor = this.getRandomMondrianColor();
    this.borderWidth = this.getRandomBorderWidth();
    this.rotation = this.getRandomRotation();
  }

  ngOnInit() {
    // Calculate optimal card dimensions based on both front and back text
    this.calculateCardSize();
    
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.getAuthState().subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    
    // Set initial auth state
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    // Clean up subscription
    this.authSubscription?.unsubscribe();
  }

  private calculateCardSize() {
    const frontText = this.formatText(this.wordPair.word);
    const backText = this.formatText(this.wordPair.translation);
    
    // Calculate width based on longest text
    const maxTextLength = Math.max(frontText.length, backText.length);
    const hasNewlines = this.hasNewlines(frontText) || this.hasNewlines(backText);
    
    // Base width calculation for content area
    let contentWidth = 200; // Base content width (reduced)
    
    if (maxTextLength > 30) {
      contentWidth = 280;
    } else if (maxTextLength > 15) {
      contentWidth = 240;
    }
    
    // Height calculation based on text content
    let contentHeight = 120; // Base content height (reduced from 180)
    
    if (hasNewlines) {
      contentHeight = Math.max(140, contentHeight); // Reduced from 200
    }
    
    if (maxTextLength > 30) {
      contentHeight = Math.max(160, contentHeight); // Reduced from 220
    }
    
    // Add some randomization while maintaining consistency
    const widthVariation = Math.random() * 40 - 20; // ±20px
    const heightVariation = Math.random() * 20 - 10; // ±10px (reduced variation)
    
    // Account for padding in box-sizing: border-box
    // .card-front/.card-back has padding: 24px 28px (top/bottom: 24px, left/right: 28px)
    const paddingWidth = 28 * 2; // 56px total horizontal padding
    const paddingHeight = 24 * 2; // 48px total vertical padding
    
    // With box-sizing: border-box, borders are included in total size, not added
    // Final dimensions include content + padding
    const finalWidth = Math.max(200, contentWidth + widthVariation) + paddingWidth;
    const finalHeight = Math.max(120, contentHeight + heightVariation) + paddingHeight;
    
    this.cardWidth = finalWidth + 'px';
    this.cardHeight = finalHeight + 'px';
  }

  private getRandomMondrianColor(): string {
    // Weight the colors - Mondrian used more primary colors
    const weightedColors = [
      ...this.mondrianColors.slice(0, 3), // Reds - higher weight
      ...this.mondrianColors.slice(0, 3), 
      ...this.mondrianColors.slice(3, 6), // Blues - higher weight  
      ...this.mondrianColors.slice(3, 6),
      ...this.mondrianColors.slice(6, 9), // Yellows - higher weight
      ...this.mondrianColors.slice(9, 12), // Whites - moderate weight
      this.mondrianColors[12], // Black - lowest weight
    ];
    
    return weightedColors[Math.floor(Math.random() * weightedColors.length)];
  }

  private getRandomBorderWidth(): number {
    // Mondrian-style varied border widths between 4-8px
    return Math.floor(Math.random() * 5) + 4; // 4-8px
  }

  private getRandomRotation(): number {
    // Slight random rotation for organic feel (-2 to 2 degrees)
    return (Math.random() - 0.5) * 4; // -2 to 2 degrees
  }

  flip() {
    this.isFlipped = !this.isFlipped;
  }

  // Get text color based on background brightness
  getTextColor(): string {
    const isDark = this.isDarkColor(this.mondrianColor);
    return isDark ? '#ffffff' : '#000000';
  }

  // Get text shadow for better readability
  getTextShadow(): string {
    const isDark = this.isDarkColor(this.mondrianColor);
    return isDark ? '2px 2px 0px rgba(0, 0, 0, 0.8)' : '2px 2px 0px rgba(255, 255, 255, 0.5)';
  }

  // Get scrollbar colors based on card background
  getScrollbarThumbColor(): string {
    const isDark = this.isDarkColor(this.mondrianColor);
    return isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  }

  getScrollbarTrackColor(): string {
    const isDark = this.isDarkColor(this.mondrianColor);
    return isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  }

  private isDarkColor(color: string): boolean {
    // Simple brightness calculation for the specific colors we use
    const darkColors = ['#dc143c', '#b91c3c', '#0047ab', '#003d82', '#000000'];
    return darkColors.includes(color);
  }

  // Handle Japanese text with \n newlines
  formatText(text: string): string {
    if (!text) return '';
    // Replace \\n with actual newlines for display
    return text.replace(/\\n/g, '\n');
  }

  // Check if text contains newline identifiers
  hasNewlines(text: string): boolean {
    return !!(text && text.includes('\\n'));
  }

  // Check for long text to adjust font size
  isLongText(text: string): boolean {
    if (!text) return false;
    return text.length > 15 && text.length <= 30;
  }

  // Check for very long text
  isVeryLongText(text: string): boolean {
    if (!text) return false;
    return text.length > 30;
  }

  // Delete this flashcard (red traffic light)
  async deleteCard(event: Event) {
    event.stopPropagation(); // Prevent card flip when clicking delete
    
    // Check if user has chosen to skip confirmation
    const skipConfirmation = localStorage.getItem('skipDeleteConfirmation') === 'true';
    
    if (skipConfirmation) {
      // Delete directly without showing dialog
      try {
        await this.dictionaryService.deleteWordPair(this.wordPair);
        console.log('Card deleted successfully');
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
      return;
    }
    
    // Show confirmation dialog
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: this.wordPair,
      panelClass: 'mondrian-dialog'
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result && result.confirmed) {
      // Save the "don't show again" preference
      if (result.dontShowAgain) {
        localStorage.setItem('skipDeleteConfirmation', 'true');
      }
      
      try {
        await this.dictionaryService.deleteWordPair(this.wordPair);
        console.log('Card deleted successfully');
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  }

  // Hide this flashcard (yellow traffic light) 
  hideCard(event: Event) {
    event.stopPropagation(); // Prevent card flip when clicking hide
    
    // Start hiding animation
    this.isHiding = true;
    
    // Wait for animation to complete before emitting
    setTimeout(() => {
      this.cardHidden.emit(this.wordPair);
    }, 250); // Match the CSS animation duration
  }
}
