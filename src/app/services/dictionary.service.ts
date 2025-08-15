import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WordPair {
  word: string;
  translation: string;
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
          translation: data[key]
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
          translation: data[key]
        }));
      })
    );
  }
}
