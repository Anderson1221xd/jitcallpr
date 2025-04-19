import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserSubject.next(user);
        localStorage.setItem('userUid', user.uid);
      } else {
        this.currentUserSubject.next(null);
        localStorage.removeItem('userUid');
      }
    });
  }

  async register(userData: User, password: string): Promise<boolean> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        userData.email,
        password
      );

      const uid = userCredential.user?.uid;
      if (uid) {
        await this.afs
          .collection('users')
          .doc(uid)
          .set({
            ...userData,
            uid,
          });

        console.log(' Usuario guardado en Firestore correctamente');
        return true;
      }

      return false;
    } catch (error) {
      console.error(' Error al registrar o guardar en Firestore:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      localStorage.setItem('userUid', result.user?.uid || '');
      this.currentUserSubject.next(result.user);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('userUid');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('userUid');
  }

  getCurrentUser(): Promise<firebase.default.User | null> {
    return this.afAuth.currentUser;
  }
}
