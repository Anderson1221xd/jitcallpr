import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/dashboard']); // O la ruta que desees redirigir
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
    }
  }
}
