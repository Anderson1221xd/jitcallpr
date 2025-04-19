import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { User } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  async addContactByPhone(
    currentUserUid: string,
    phone: string
  ): Promise<boolean> {
    try {
      const querySnapshot = await this.afs
        .collection<User>('users', (ref) => ref.where('phone', '==', phone))
        .get()
        .toPromise();

      if (querySnapshot?.empty) {
        console.warn('No se encontró usuario con ese número');
        return false;
      }

      const contactDoc = querySnapshot?.docs[0];
      const contactData = contactDoc?.data();
      const contactUid = contactDoc?.id;

      if (contactUid === currentUserUid) {
        console.warn('No puedes agregarte a ti mismo');
        return false;
      }

      await this.afs
        .collection(`users/${currentUserUid}/contacts`)
        .doc(contactUid)
        .set(contactData);

      console.log('Contacto agregado correctamente');
      return true;
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      return false;
    }
  }

  getContacts(): Observable<User[]> {
    const currentUserUid = this.authService.getCurrentUserId();
    return this.afs
      .collection<User>(`users/${currentUserUid}/contacts`)
      .valueChanges({ idField: 'uid' });
  }
}
