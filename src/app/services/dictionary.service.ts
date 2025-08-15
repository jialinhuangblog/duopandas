import { Injectable } from '@angular/core';
import { Firestore, doc, docData, updateDoc, deleteField } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WordPair {
  word: string;
  translation: string;
  category?: 'eng' | 'japanese';
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(private firestore: Firestore) { }

  getEngWords(): Observable<WordPair[]> {
    const docRef = doc(this.firestore, 'dictionaries', 'eng');
    return docData(docRef).pipe(
      map((data: any) => {
        if (!data) return [];
        return Object.keys(data).map(key => ({
          word: key,
          translation: data[key],
          category: 'eng' as const
        }));
      })
    );
  }

  getJapaneseWords(): Observable<WordPair[]> {
    const docRef = doc(this.firestore, 'dictionaries', 'japanese');
    return docData(docRef).pipe(
      map((data: any) => {
        if (!data) return [];
        return Object.keys(data).map(key => ({
          word: key,
          translation: data[key],
          category: 'japanese' as const
        }));
      })
    );
  }

  // Add word pair to Firestore
  async addWordPair(wordPair: WordPair): Promise<void> {
    console.log('Adding word pair to Firestore:', wordPair);
    
    try {
      const collection = wordPair.category === 'eng' ? 'eng' : 'japanese';
      const docRef = doc(this.firestore, 'dictionaries', collection);
      
      // Create update object with the new word-translation pair
      const updateData = {
        [wordPair.word]: wordPair.translation
      };
      
      await updateDoc(docRef, updateData);
      console.log('Successfully added word pair to Firestore');
      
    } catch (error) {
      console.error('Error adding word pair to Firestore:', error);
      throw error; // Re-throw so the calling component can handle it
    }
  }

  // Delete word pair from Firestore
  async deleteWordPair(wordPair: WordPair): Promise<void> {
    console.log('Deleting word pair from Firestore:', wordPair);
    
    try {
      const collection = wordPair.category === 'eng' ? 'eng' : 'japanese';
      const docRef = doc(this.firestore, 'dictionaries', collection);
      
      // Delete the field from the document
      const deleteData = {
        [wordPair.word]: deleteField()
      };
      
      await updateDoc(docRef, deleteData);
      console.log('Successfully deleted word pair from Firestore');
      
    } catch (error) {
      console.error('Error deleting word pair from Firestore:', error);
      throw error; // Re-throw so the calling component can handle it
    }
  }
}
