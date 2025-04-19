import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  contacts: any[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private contactService: ContactService
  ) {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    const uid = this.authService.getCurrentUserId();
    console.log('Usuario logueado UID:', uid);

    this.contactService.getContacts().subscribe((contacts) => {
      console.log('Contactos recuperados:', contacts);
      this.contacts = contacts;
    });
  }
}
