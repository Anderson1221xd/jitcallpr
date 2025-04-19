import { Injectable } from '@angular/core';

export interface User {
  uid: string;
  email: string;
  name: string;
  lastname: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
}
