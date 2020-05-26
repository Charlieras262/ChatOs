import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private username: string = ""

  constructor() { }

  private loadUser() {
    this.username = localStorage.getItem('user')
  }

  isLoggedIn(){
    this.loadUser()
    return this.username != null
  }

  storeUserData(user: string) {
    localStorage.setItem('user', user);
    this.username = user;
  }

  getUser(){
    this.loadUser()
    return this.username
  }

  logout() {
    this.username = null;
    localStorage.clear();
    window.location.reload()
  }
}
