import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';

// Asegúrate que tengas esta interfaz creada
import { User } from 'src/app/interfaces/user.interface';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name!: string;
  lastname!: string;
  email!: string;
  phone!: number;
  password!: string;

  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  async registerUser(form: NgForm): Promise<void> {
    if (!form.valid) {
      console.error('Formulario inválido.');
      return;
    }

    const userData: User = {
      uid: '',
      email: this.email,
      name: this.name,
      lastname: this.lastname,
      phone: this.phone,
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        this.password
      );
      const firebaseUser: FirebaseUser = userCredential.user;
      userData.uid = firebaseUser.uid;

      const userDocRef = doc(collection(this.db, 'users'), firebaseUser.uid);
      await setDoc(userDocRef, { ...userData });

      this.showSuccessMessage();
    } catch (error: any) {
      console.error('Error al registrar usuario:', error.message);
    }
  }

  async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: 'Registro Exitoso',
      message: 'El usuario se registró correctamente.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await alert.present();
  }
}
