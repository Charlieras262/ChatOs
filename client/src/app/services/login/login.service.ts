import { Injectable } from '@angular/core';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user: User

  constructor() { }

  private loadUser() {
    this.user = JSON.parse(localStorage.getItem('user'))
  }

  isLoggedIn(){
    this.loadUser()
    return this.user != null
  }

  storeUserData(user: string) {
    localStorage.setItem('user', user);
    this.user = JSON.parse(user);
  }

  getUser(){
    this.loadUser()
    return this.user
  }

  logout() {
    this.user = null;
    localStorage.clear();
    window.location.reload()
  }
}
