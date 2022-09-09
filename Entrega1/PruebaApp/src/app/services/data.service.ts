import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface User {
  email:string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private firestore: Firestore) {
  }
  getUsers(): Observable<User []> {
    return collectionData(collection(this.firestore, 'Usuarios')) as Observable<User[]>;
  }
}
