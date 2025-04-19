import { Component } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
})
export class AddContactPage {
  phone: string = '';
  errorMessage = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async addContact() {
    this.errorMessage = '';

    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    try {
      const success = await this.contactService.addContactByPhone(
        currentUser.uid,
        this.phone
      );

      if (success) {
        const toast = await this.toastCtrl.create({
          message: 'Contacto agregado',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.phone = '';
        this.router.navigate(['/contact']);
      } else {
        this.errorMessage = 'No se encontró un usuario con ese número';
      }
    } catch (error) {
      this.errorMessage = 'Error al intentar agregar el contacto';
      console.error(error);
    }
  }
}
